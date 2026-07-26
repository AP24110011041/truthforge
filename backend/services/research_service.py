"""Research Service - Orchestrates retrieval and generation for grounded answers."""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from ..core.config import get_settings
from ..rag.embedding_service import EmbeddingService
from ..rag.llm_service import LLMService, LLMError
from ..rag.retriever import Retriever

logger = logging.getLogger(__name__)


class ResearchService:
    """Service for research query orchestration."""

    def __init__(self):
        self.settings = get_settings()
        self.retriever = Retriever()
        self.llm_service = LLMService()

    async def research(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Execute a grounded research workflow with retrieval and generation."""
        try:
            if not query:
                return {
                    "success": False,
                    "answer": "Please provide a valid query to search.",
                    "sources": [],
                    "retrieved_chunks": [],
                    "error": "Invalid query",
                }

            retrieved_chunks = await self.retriever.retrieve(query, top_k=top_k, filters=filters)

            if not retrieved_chunks:
                logger.info("No retrieval context found for query: %s", query)
                return {
                    "success": False,
                    "answer": "No relevant context could be retrieved for your query. Please refine your question or try again later.",
                    "sources": [],
                    "retrieved_chunks": [],
                    "error": "No retrieval context available",
                }

            prompt = self._build_prompt(query, retrieved_chunks)

            try:
                answer = await self.llm_service.generate(prompt)
            except LLMError as exc:
                logger.exception("LLM generation failed for query: %s", query)
                return {
                    "success": False,
                    "answer": "The language model failed to generate a response. Please try again.",
                    "sources": [chunk.get("metadata", {}).get("source") for chunk in retrieved_chunks if chunk.get("metadata", {}).get("source")],
                    "retrieved_chunks": retrieved_chunks,
                    "error": str(exc),
                }

            sources = self._extract_sources(retrieved_chunks)

            return {
                "success": True,
                "answer": answer,
                "sources": sources,
                "retrieved_chunks": retrieved_chunks,
                "error": "",
            }
        except Exception as exc:
            logger.exception("Research workflow failed for query: %s", query)
            return {
                "success": False,
                "answer": "The research request failed due to an internal error. Please try again later.",
                "sources": [],
                "retrieved_chunks": [],
                "error": str(exc),
            }

    def _build_prompt(self, query: str, chunks: List[Dict[str, Any]]) -> str:
        context_sections = []
        for idx, chunk in enumerate(chunks, start=1):
            metadata = chunk.get("metadata", {}) or {}
            source = metadata.get("source", "unknown source")
            title = metadata.get("title", "untitled")
            context_sections.append(
                f"[{idx}] Source: {source} | Title: {title}\nContent: {chunk.get('content', '')}"
            )

        joined_context = "\n\n".join(context_sections)
        prompt = (
            f"You are a research assistant. Use only the retrieved context below to answer the question. "
            f"Do not hallucinate or invent information. If the answer is not contained in the context, say that the information is not available.\n\n"
            f"Retrieved Context:\n{joined_context}\n\n"
            f"Question: {query}\n\n"
            f"Answer concisely and cite the sources by their source and title."
        )
        return prompt

    def _extract_sources(self, chunks: List[Dict[str, Any]]) -> List[str]:
        sources: List[str] = []
        for chunk in chunks:
            metadata = chunk.get("metadata", {}) or {}
            source = metadata.get("source")
            title = metadata.get("title")
            if source and title:
                source_label = f"{source} - {title}"
            elif source:
                source_label = source
            elif title:
                source_label = title
            else:
                continue
            if source_label not in sources:
                sources.append(source_label)
        return sources
