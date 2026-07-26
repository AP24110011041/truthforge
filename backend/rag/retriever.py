"""Retriever - Retrieves relevant documents for RAG."""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

from .embedding_service import EmbeddingService
from .vector_store import VectorStore

logger = logging.getLogger(__name__)


class Retriever:
    """Retrieval service for semantic search."""

    def __init__(
        self,
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        """Initialize retriever.

        Args:
            vector_store: Vector store instance
            embedding_service: Embedding service instance
        """
        self.vector_store = vector_store or VectorStore()
        self.embedding_service = embedding_service or EmbeddingService()

    async def retrieve(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, str]] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant documents for query.

        Args:
            query: Query text
            top_k: Number of documents to retrieve
            filters: Optional metadata filters (source, document_id, title)

        Returns:
            List of relevant documents
        """
        if not query or top_k <= 0:
            return []

        try:
            query_embedding = await self.embedding_service.embed_text(query)
            if not query_embedding:
                logger.debug("Empty query embedding generated for query: %s", query)
                return []

            search_k = max(top_k * 3, top_k + 10)
            raw_results = await self._query_vector_store(query_embedding, search_k)

            if not raw_results:
                logger.debug("No retrieval results returned for query: %s", query)
                return []

            filtered_results = self._apply_filters(raw_results, filters)
            unique_results = self._deduplicate(filtered_results)
            normalized_results = self._normalize_scores(unique_results)
            sorted_results = sorted(
                normalized_results, key=lambda result: result["score"], reverse=True
            )

            final_results = [
                {
                    "content": result["content"],
                    "metadata": result["metadata"],
                    "document_id": result["document_id"],
                    "chunk_id": result["chunk_id"],
                    "score": result["score"],
                }
                for result in sorted_results[:top_k]
            ]

            logger.debug(
                "Retrieved %d results for query=%s top_k=%d filters=%s",
                len(final_results),
                query,
                top_k,
                filters,
            )
            return final_results
        except Exception as exc:
            logger.exception("Failed to retrieve documents for query: %s", query)
            raise RuntimeError("Failed to retrieve documents") from exc

    async def _query_vector_store(
        self, query_embedding: List[float], top_k: int
    ) -> List[Dict[str, Any]]:
        try:
            return await self.vector_store.similarity_search(
                query_embedding=query_embedding,
                top_k=top_k,
            )
        except Exception as exc:
            logger.exception(
                "Vector store query failed for top_k=%s: %s", top_k, exc
            )
            raise

    async def retrieve_batch(
        self,
        queries: List[str],
        top_k: int = 5,
        filters: Optional[Dict[str, str]] = None,
    ) -> List[List[Dict[str, Any]]]:
        """Retrieve documents for multiple queries.

        Args:
            queries: List of queries
            top_k: Number of documents per query
            filters: Optional metadata filters applied to each query

        Returns:
            List of result lists
        """
        results: List[List[Dict[str, Any]]] = []
        for query in queries:
            results.append(await self.retrieve(query, top_k=top_k, filters=filters))
        return results

    async def retrieve_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single document chunk by its document ID.

        Args:
            doc_id: Document ID or chunk ID

        Returns:
            Document chunk or None
        """
        if not doc_id:
            return None

        try:
            results = await self.vector_store.similarity_search(
                query_embedding=[0.0] * self.embedding_service.dimension,
                top_k=1,
            )
            for result in results:
                if result.get("document_id") == doc_id or result.get("chunk_id") == doc_id:
                    return {
                        "content": result["content"],
                        "metadata": result["metadata"],
                        "document_id": result["document_id"],
                        "chunk_id": result["chunk_id"],
                        "score": result["similarity_score"],
                    }
            return None
        except Exception:
            logger.exception("Failed to retrieve document by id: %s", doc_id)
            return None

    async def get_statistics(self) -> Dict[str, Any]:
        """Get retriever statistics."""
        try:
            return {
                "vector_store_status": "ready",
                "embedding_service_status": "ready",
            }
        except Exception as exc:
            logger.exception("Failed to get retriever statistics")
            raise RuntimeError("Failed to get retriever statistics") from exc

    def _apply_filters(
        self, results: List[Dict[str, Any]], filters: Optional[Dict[str, str]]
    ) -> List[Dict[str, Any]]:
        if not filters:
            return results

        allowed: List[Dict[str, Any]] = []
        for result in results:
            metadata = result.get("metadata", {}) or {}
            if self._matches_filters(metadata, filters):
                allowed.append(result)
        return allowed

    def _matches_filters(
        self, metadata: Dict[str, Any], filters: Dict[str, str]
    ) -> bool:
        for key in ("source", "document_id", "title"):
            filter_value = filters.get(key)
            if filter_value is None:
                continue
            if str(metadata.get(key)) != str(filter_value):
                return False
        return True

    def _deduplicate(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        unique: Dict[str, Dict[str, Any]] = {}
        for result in sorted(results, key=lambda item: item.get("similarity_score", 0), reverse=True):
            document_id = result.get("document_id") or "<unknown>"
            chunk_id = result.get("chunk_id") or "<unknown>"
            chunk_key = f"{document_id}:{chunk_id}"
            if chunk_key not in unique:
                unique[chunk_key] = result
        return list(unique.values())

    def _normalize_scores(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not results:
            return []

        scores = [float(result.get("similarity_score", 0.0)) for result in results]
        min_score, max_score = min(scores), max(scores)
        normalized: List[Dict[str, Any]] = []

        if max_score <= min_score:
            for result in results:
                normalized_score = 1.0 if max_score > 0 else 0.0
                normalized.append({**result, "score": normalized_score})
            return normalized

        range_score = max_score - min_score
        for result in results:
            raw_score = float(result.get("similarity_score", 0.0))
            normalized_score = max(0.0, min(1.0, (raw_score - min_score) / range_score))
            normalized.append({**result, "score": normalized_score})
        return normalized
