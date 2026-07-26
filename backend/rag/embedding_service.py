"""Embedding Service - Generates embeddings for RAG."""

from __future__ import annotations

from typing import List, Dict, Any
import asyncio
import logging

from sentence_transformers import SentenceTransformer


logger = logging.getLogger(__name__)


class EmbeddingService:
    """Embedding generation service using Sentence Transformers."""

    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        device: str = "cpu",
    ):
        """Initialize the embedding service.

        Args:
            model_name: Pretrained Sentence Transformer model name.
            device: Device to run embeddings on (cpu, cuda).
        """
        self.model_name = model_name
        self.device = device

        try:
            self.model = SentenceTransformer(model_name, device=device)
            self.dimension = self.model.get_sentence_embedding_dimension()
        except Exception as e:
            logger.exception("Failed to initialize embedding model %s", model_name)
            raise RuntimeError(
                f"Failed to initialize embedding model '{model_name}': {e}"
            ) from e

    async def embed_text(self, text: str) -> List[float]:
        """Generate an embedding for a single text input.

        Args:
            text: Text to embed.

        Returns:
            Embedding vector.
        """
        if not text:
            return []

        try:
            embedding = await asyncio.to_thread(
                self.model.encode,
                text,
                convert_to_numpy=True,
                show_progress_bar=False,
                normalize_embeddings=True,
            )
            return embedding.tolist()
        except Exception as e:
            logger.exception("Failed to generate embedding for text input")
            raise RuntimeError(
                "Failed to generate embedding for text input"
            ) from e

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts.

        Args:
            texts: List of texts to embed.

        Returns:
            List of embedding vectors.
        """
        if not texts:
            return []

        try:
            embeddings = await asyncio.to_thread(
                self.model.encode,
                texts,
                convert_to_numpy=True,
                show_progress_bar=False,
                normalize_embeddings=True,
            )
            return [embedding.tolist() for embedding in embeddings]
        except Exception as e:
            logger.exception("Failed to generate batch embeddings")
            raise RuntimeError("Failed to generate batch embeddings") from e

    async def embed_chunks(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate embeddings for document chunks.

        Args:
            chunks: List of document chunk objects.

        Returns:
            Chunk list enriched with embeddings.
        """
        if not chunks:
            return []

        try:
            texts = [chunk.get("content", "") for chunk in chunks]
            embeddings = await self.embed_batch(texts)
            for chunk, embedding in zip(chunks, embeddings):
                chunk["embedding"] = embedding
            return chunks
        except Exception as e:
            logger.exception("Failed to generate embeddings for document chunks")
            raise RuntimeError("Failed to generate embeddings for document chunks") from e

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the embedding model."""
        return {
            "model_name": self.model_name,
            "dimension": self.dimension,
            "type": "sentence-transformers",
            "device": self.device,
            "status": "ready",
        }
