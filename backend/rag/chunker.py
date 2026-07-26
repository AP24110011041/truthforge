"""Document Chunker - Splits documents into chunks for RAG."""

from __future__ import annotations

import asyncio
import logging
import re
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence, Tuple

from ..core.config import get_settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class TextBlock:
    text: str
    start: int
    end: int
    block_type: str


class DocumentChunker:
    """Production-ready document chunker for RAG."""

    _HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+.*$")
    _LIST_ITEM_RE = re.compile(r"^\s{0,3}([*\-+]|\d+[.)])\s+.*$")
    _FENCED_CODE_RE = re.compile(r"^\s{0,3}(`{3,}|~{3,})(.*)$")
    _TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
    _TABLE_DIVIDER_RE = re.compile(r"^\s*[:\-\|\s]+$")
    _INLINE_CODE_RE = re.compile(r"`[^`]+`")
    _MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\([^\)]+\)")
    _URL_RE = re.compile(r"https?://\S+|www\.\S+")
    _SENTENCE_END_RE = re.compile(r"([\.\?!])(\s+|$)")

    def __init__(
        self,
        chunk_size: Optional[int] = None,
        overlap: Optional[int] = None,
    ):
        """Initialize chunker.

        Args:
            chunk_size: Maximum chunk length in characters.
            overlap: Exact overlap length between consecutive chunks.
        """
        settings = get_settings()
        default_chunk_size = getattr(settings, "chunk_size", 512)
        default_overlap = getattr(settings, "chunk_overlap", 50)

        self.chunk_size = chunk_size if chunk_size is not None else default_chunk_size
        self.overlap = overlap if overlap is not None else default_overlap

        if self.chunk_size <= 0:
            raise ValueError("chunk_size must be a positive integer")
        if self.overlap < 0 or self.overlap >= self.chunk_size:
            raise ValueError("overlap must be non-negative and smaller than chunk_size")

    def chunk_document(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Split document content into deterministic chunks with metadata."""
        if content is None:
            raise ValueError("content cannot be None")

        try:
            normalized_text = self._normalize_text(content)
            if not normalized_text:
                return []

            blocks = self._split_into_blocks(normalized_text)
            title = self._extract_title(blocks, metadata)
            chunks = self._build_chunks(normalized_text, blocks)

            document_id = metadata.get("document_id") if metadata else None
            source = metadata.get("source") if metadata else None
            page_number = metadata.get("page_number") if metadata else None

            result: List[Dict[str, Any]] = []
            for index, (chunk_start, chunk_end, chunk_text) in enumerate(chunks):
                chunk_id = f"{document_id or 'document'}_chunk_{index}"
                result.append(
                    {
                        "document_id": document_id,
                        "chunk_id": chunk_id,
                        "source": source,
                        "title": title,
                        "page_number": page_number,
                        "start_offset": chunk_start,
                        "end_offset": chunk_end,
                        "content": chunk_text,
                    }
                )

            logger.debug(
                "Chunked document %s into %d chunks (size=%d overlap=%d)",
                document_id or "<unknown>",
                len(result),
                self.chunk_size,
                self.overlap,
            )
            return result
        except Exception as exc:
            logger.exception(
                "Failed to chunk document %s",
                metadata.get("document_id") if metadata else "<unknown>",
            )
            raise RuntimeError("Failed to chunk document") from exc

    async def chunk_document_async(
        self, content: str, metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Async-compatible wrapper for chunk_document."""
        return await asyncio.to_thread(self.chunk_document, content, metadata)

    def get_chunk_statistics(self, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get statistics about chunks."""
        sizes = [len(chunk["content"]) for chunk in chunks]
        return {
            "total_chunks": len(chunks),
            "average_chunk_size": sum(sizes) / len(sizes) if sizes else 0,
            "total_content_size": sum(sizes),
        }

    def _normalize_text(self, content: str) -> str:
        content = content.replace("\r\n", "\n").replace("\r", "\n")
        content = re.sub(r"[ \t]+$", "", content, flags=re.M)

        lines = content.split("\n")
        normalized_lines: List[str] = []
        in_fenced_code = False
        fence_delimiter = ""

        for line in lines:
            fence_match = self._FENCED_CODE_RE.match(line)
            if fence_match:
                delimiter = fence_match.group(1)
                if not in_fenced_code:
                    in_fenced_code = True
                    fence_delimiter = delimiter
                elif delimiter == fence_delimiter:
                    in_fenced_code = False
                    fence_delimiter = ""

            if not in_fenced_code:
                line = re.sub(r"[ \t]{2,}", " ", line)
            normalized_lines.append(line.rstrip())

        normalized_text = "\n".join(normalized_lines).strip()
        normalized_text = re.sub(r"\n{3,}", "\n\n", normalized_text)
        return normalized_text

    def _split_into_blocks(self, text: str) -> List[TextBlock]:
        lines = text.split("\n")
        blocks: List[TextBlock] = []
        block_start = 0
        current_type: Optional[str] = None
        current_end = 0
        in_fenced_code = False
        fence_delimiter = ""

        def flush_block(end: int) -> None:
            nonlocal block_start, current_type
            if current_type is not None and end > block_start:
                blocks.append(TextBlock(text=normalized_text[block_start:end], start=block_start, end=end, block_type=current_type))
            block_start = end

        normalized_text = text
        current_type = None

        for index, line in enumerate(lines):
            line_length = len(line)
            next_pos = current_end + line_length
            line_end = next_pos + 1 if index < len(lines) - 1 else next_pos
            stripped = line.strip()
            fence_match = self._FENCED_CODE_RE.match(line)
            is_heading = bool(self._HEADING_RE.match(line))
            is_list = bool(self._LIST_ITEM_RE.match(line))
            is_table_header = bool(self._TABLE_ROW_RE.match(line))
            is_table_divider = bool(self._TABLE_DIVIDER_RE.match(line)) and "|" in line
            is_blank = stripped == ""

            if in_fenced_code:
                if fence_match and fence_match.group(1) == fence_delimiter:
                    current_end = line_end
                    flush_block(current_end)
                    current_type = None
                    in_fenced_code = False
                    fence_delimiter = ""
                    continue
                current_end = line_end
                continue

            if fence_match:
                flush_block(current_end)
                current_type = "fenced_code"
                in_fenced_code = True
                fence_delimiter = fence_match.group(1)
                current_end = line_end
                continue

            if is_blank:
                flush_block(current_end)
                current_type = None
                current_end = line_end
                continue

            if is_heading:
                flush_block(current_end)
                current_type = "heading"
                current_end = line_end
                continue

            if is_table_header or is_table_divider:
                if current_type != "table":
                    flush_block(current_end)
                    current_type = "table"
                current_end = line_end
                continue

            if current_type == "table":
                if stripped.startswith("|") or "|" in line:
                    current_end = line_end
                    continue
                flush_block(current_end)
                current_type = None

            if is_list:
                if current_type != "list":
                    flush_block(current_end)
                    current_type = "list"
                current_end = line_end
                continue

            if current_type != "paragraph":
                flush_block(current_end)
                current_type = "paragraph"
            current_end = line_end

        flush_block(len(normalized_text))
        return blocks

    def _extract_title(self, blocks: List[TextBlock], metadata: Optional[Dict[str, Any]]) -> Optional[str]:
        if metadata and metadata.get("title"):
            return metadata.get("title")

        for block in blocks:
            if block.block_type == "heading":
                heading = block.text.strip()
                heading = re.sub(r"^#{1,6}\s*", "", heading).strip()
                return heading or None

        return None

    def _find_protected_spans(self, text: str) -> List[Tuple[int, int]]:
        spans: List[Tuple[int, int]] = self._find_fenced_code_spans(text)
        for regex in (self._INLINE_CODE_RE, self._MARKDOWN_LINK_RE, self._URL_RE):
            for match in regex.finditer(text):
                spans.append((match.start(), match.end()))

        spans.sort(key=lambda span: (span[0], span[1]))
        merged: List[Tuple[int, int]] = []
        for start, end in spans:
            if not merged or start > merged[-1][1]:
                merged.append((start, end))
            else:
                merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        return merged

    def _find_fenced_code_spans(self, text: str) -> List[Tuple[int, int]]:
        spans: List[Tuple[int, int]] = []
        in_fenced_code = False
        fence_delimiter = ""
        fence_start: Optional[int] = None
        offset = 0

        for line in text.splitlines(True):
            fence_match = self._FENCED_CODE_RE.match(line)
            if fence_match:
                delimiter = fence_match.group(1)
                if not in_fenced_code:
                    in_fenced_code = True
                    fence_delimiter = delimiter
                    fence_start = offset
                elif delimiter == fence_delimiter and fence_start is not None:
                    spans.append((fence_start, offset + len(line)))
                    in_fenced_code = False
                    fence_delimiter = ""
                    fence_start = None
            offset += len(line)

        if in_fenced_code and fence_start is not None:
            spans.append((fence_start, offset))

        return spans

    def _is_in_protected_span(self, position: int, spans: Sequence[Tuple[int, int]]) -> bool:
        for start, end in spans:
            if start <= position < end:
                return True
        return False

    def _find_span_containing(self, position: int, spans: Sequence[Tuple[int, int]]) -> Optional[Tuple[int, int]]:
        for start, end in spans:
            if start <= position < end:
                return (start, end)
        return None

    def _is_position_allowed(self, position: int, spans: Sequence[Tuple[int, int]]) -> bool:
        if position < 0:
            return False
        if position == 0:
            return True
        if position > spans[-1][1] if spans else True:
            return True
        return not self._is_in_protected_span(position, spans)

    def _adjust_backward(self, position: int, spans: Sequence[Tuple[int, int]]) -> int:
        while position > 0 and not self._is_position_allowed(position, spans):
            position -= 1
        return max(position, 0)

    def _find_sentence_boundaries(self, text: str, base: int = 0) -> List[int]:
        positions: List[int] = []
        spans = self._find_protected_spans(text)
        for match in self._SENTENCE_END_RE.finditer(text):
            boundary = match.end()
            if boundary < len(text) and self._is_in_protected_span(boundary, spans):
                continue
            if boundary > 0 and boundary < len(text):
                positions.append(base + boundary)
        return positions

    def _find_list_boundaries(self, text: str, base: int = 0) -> List[int]:
        positions: List[int] = []
        for match in re.finditer(r"^\s{0,3}([*\-+]|\d+[.)])\s+", text, flags=re.M):
            positions.append(base + match.start())
        return positions

    def _build_safe_positions(self, text: str, blocks: List[TextBlock]) -> List[int]:
        positions = {0, len(text)}
        for block in blocks:
            positions.add(block.start)
            positions.add(block.end)
            if block.block_type in {"paragraph", "list", "heading"}:
                positions.update(self._find_sentence_boundaries(block.text, block.start))
            if block.block_type == "list":
                positions.update(self._find_list_boundaries(block.text, block.start))
        return sorted(positions)

    def _build_chunks(self, text: str, blocks: List[TextBlock]) -> List[Tuple[int, int, str]]:
        protected_spans = self._find_protected_spans(text)
        safe_positions = self._build_safe_positions(text, blocks)
        if not text:
            return []

        chunks: List[Tuple[int, int, str]] = []
        current_start = 0
        text_length = len(text)

        while current_start < text_length:
            if self._is_in_protected_span(current_start, protected_spans):
                span = self._find_span_containing(current_start, protected_spans)
                if span is not None:
                    current_start = span[1]
                    continue

            max_end = min(current_start + self.chunk_size, text_length)
            candidates = [pos for pos in safe_positions if current_start < pos <= max_end]
            if not candidates:
                candidates = [pos for pos in safe_positions if pos > current_start]
                if not candidates:
                    break

            end = self._choose_chunk_end(current_start, candidates, protected_spans)
            if end <= current_start:
                end = max(current_start + 1, min(current_start + self.chunk_size, text_length))

            chunks.append((current_start, end, text[current_start:end]))

            if end >= text_length:
                break

            next_start = end - self.overlap
            if next_start <= current_start:
                next_start = end
            current_start = next_start

        return chunks

    def _choose_chunk_end(self, current_start: int, candidates: List[int], protected_spans: Sequence[Tuple[int, int]]) -> int:
        for candidate in reversed(candidates):
            if not self._is_position_allowed(candidate, protected_spans):
                continue
            next_start = candidate - self.overlap
            if next_start <= current_start:
                continue
            if self._is_position_allowed(next_start, protected_spans):
                return candidate

        for candidate in reversed(candidates):
            if self._is_position_allowed(candidate, protected_spans):
                return candidate

        return current_start + 1
