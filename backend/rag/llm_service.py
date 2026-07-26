"""LLM Service - Provider abstraction for text generation."""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, AsyncIterator, Dict, List, Optional

import httpx
from pydantic import BaseModel

from ..core.config import get_settings

logger = logging.getLogger(__name__)


class LLMError(Exception):
    """Generic exception for LLM service errors."""


class LLMService:
    """Abstraction for OpenAI-compatible LLM providers."""

    def __init__(self):
        settings = get_settings()
        self.provider = settings.llm_provider.lower() if hasattr(settings, "llm_provider") else "openai"
        self.model = settings.llm_model if hasattr(settings, "llm_model") else "gpt-3.5-turbo"
        self.api_key = settings.llm_api_key if hasattr(settings, "llm_api_key") else None
        self.api_base = settings.llm_api_base if hasattr(settings, "llm_api_base") else "https://api.openai.com/v1"
        self.timeout = settings.llm_timeout if hasattr(settings, "llm_timeout") else 60

        if not self.api_key:
            logger.warning("LLM API key is not configured")

    async def generate(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.0,
        top_p: float = 1.0,
        stop: Optional[List[str]] = None,
    ) -> str:
        """Generate text from the LLM provider."""
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
        }
        if stop:
            payload["stop"] = stop

        response = await self._send_request(payload, stream=False)
        return self._extract_text(response)

    async def generate_stream(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.0,
        top_p: float = 1.0,
        stop: Optional[List[str]] = None,
    ) -> AsyncIterator[str]:
        """Generate text from the LLM provider as a stream."""
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
            "stream": True,
        }
        if stop:
            payload["stop"] = stop

        async for chunk in self._send_stream_request(payload):
            yield chunk

    def _build_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def _send_request(self, payload: Dict[str, Any], stream: bool = False) -> Dict[str, Any]:
        url = f"{self.api_base}/chat/completions"
        retries = 2
        last_exception: Optional[Exception] = None

        for attempt in range(1, retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    logger.debug("LLM request attempt %d: %s", attempt, url)
                    response = await client.post(url, json=payload, headers=self._build_headers())
                    response.raise_for_status()
                    result = response.json()
                    logger.debug("LLM response received: %s", {"model": self.model, "status_code": response.status_code})
                    return result
            except (httpx.HTTPStatusError, httpx.RequestError) as exc:
                logger.warning(
                    "LLM request failed on attempt %d/%d: %s",
                    attempt,
                    retries,
                    str(exc),
                )
                last_exception = exc
                if attempt == retries:
                    logger.exception("LLM request failed after retries")
                    raise LLMError("Failed to generate completion from LLM provider") from exc
                await asyncio.sleep(1)
        raise LLMError("LLM request retry loop exited unexpectedly")

    async def _send_stream_request(self, payload: Dict[str, Any]) -> AsyncIterator[str]:
        url = f"{self.api_base}/chat/completions"
        retries = 2
        last_exception: Optional[Exception] = None

        for attempt in range(1, retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    logger.debug("LLM stream request attempt %d: %s", attempt, url)
                    async with client.stream("POST", url, json=payload, headers=self._build_headers()) as response:
                        response.raise_for_status()
                        async for line in response.aiter_lines():
                            if not line or line.startswith("data: [DONE]"):
                                continue
                            if line.startswith("data: "):
                                line_payload = line[len("data: "):]
                                try:
                                    decoded = json.loads(line_payload)
                                    delta = decoded["choices"][0].get("delta", {})
                                    content = delta.get("content")
                                    if content:
                                        yield content
                                except ValueError:
                                    logger.debug("Skipping non-JSON stream line: %s", line_payload)
                return
            except (httpx.HTTPStatusError, httpx.RequestError) as exc:
                logger.warning(
                    "LLM stream request failed on attempt %d/%d: %s",
                    attempt,
                    retries,
                    str(exc),
                )
                last_exception = exc
                if attempt == retries:
                    logger.exception("LLM stream request failed after retries")
                    raise LLMError("Failed to stream completion from LLM provider") from exc
                await asyncio.sleep(1)
        raise LLMError("LLM stream request retry loop exited unexpectedly")

    def _extract_text(self, response: Dict[str, Any]) -> str:
        try:
            choices = response.get("choices", [])
            if not choices:
                raise LLMError("Unexpected LLM response structure: missing choices")
            return "".join(
                choice.get("message", {}).get("content", "") for choice in choices
            ).strip()
        except Exception as exc:
            logger.exception("Failed to parse LLM response")
            raise LLMError("Failed to parse LLM response") from exc
