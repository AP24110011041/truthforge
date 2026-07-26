"""Vector Store - Stores and retrieves embeddings for RAG."""

from __future__ import annotations

from typing import List, Dict, Any, Optional
import asyncio
import logging

from chromadb import PersistentClient
from chromadb.config import Settings

from ..core.config import get_settings

logger = logging.getLogger(__name__)


class VectorStore:
    """ChromaDB-backed vector store for persistent embedding search."""

    def __init__(
        self,
        persist_directory: Optional[str] = None,
        collection_name: Optional[str] = None,
        embedding_dimension: int = 768,
    ):
        """Initialize the ChromaDB vector store.

        Args:
            persist_directory: Filesystem path for ChromaDB persistence.
            collection_name: Name of the ChromaDB collection.
            embedding_dimension: Expected embedding vector dimension.
        """
        settings = get_settings()
        self.persist_directory = persist_directory or settings.chroma_persist_directory
        self.collection_name = collection_name or settings.chroma_collection_name
        self.embedding_dimension = embedding_dimension
        self.collection_metadata = {
            "source": "truthforge_ai",
            "hnsw:space": "cosine",
        }

        try:
            self.client = PersistentClient(path=self.persist_directory)
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata=self.collection_metadata,
                get_or_create=True,
            )
        except Exception as e:
            logger.exception(
                "Failed to initialize ChromaDB client for collection %s at %s",
                self.collection_name,
                self.persist_directory,
            )
            raise RuntimeError(
                f"Failed to initialize ChromaDB vector store '{self.collection_name}' at '{self.persist_directory}': {e}"
            ) from e

    async def add_documents(self, documents: List[Dict[str, Any]]) -> List[str]:
        """Add document chunks with embeddings to the vector store.

        Each document entry must include:
        - document_id
        - chunk_id
        - content
        - embedding
        - metadata (optional)

        Args:
            documents: List of document chunk entries.

        Returns:
            List of stored vector IDs.
        """
        if not documents:
            return []

        try:
            ids: List[str] = []
            texts: List[str] = []
            embeddings: List[List[float]] = []
            metadatas: List[Dict[str, Any]] = []

            for entry in documents:
                document_id = entry["document_id"]
                chunk_id = entry["chunk_id"]
                content = entry["content"]
                embedding = entry["embedding"]
                metadata = entry.get("metadata", {}) or {}

                vector_id = f"{document_id}:{chunk_id}"
                ids.append(vector_id)
                texts.append(content)
                embeddings.append(embedding)
                metadatas.append(
                    {
                        "document_id": document_id,
                        "chunk_id": chunk_id,
                        **metadata,
                    }
                )

            if not (len(ids) == len(texts) == len(embeddings) == len(metadatas)):
                lengths = {
                    "ids": len(ids),
                    "documents": len(texts),
                    "embeddings": len(embeddings),
                    "metadatas": len(metadatas),
                }
                raise ValueError(
                    f"Document insertion failed due to mismatched lengths: {lengths}"
                )

            await asyncio.to_thread(
                self.collection.add,
                ids=ids,
                documents=texts,
                metadatas=metadatas,
                embeddings=embeddings,
            )
            return ids
        except Exception as e:
            logger.exception("Failed to add documents to ChromaDB collection %s", self.collection_name)
            raise RuntimeError("Failed to add documents to the ChromaDB vector store") from e

    async def similarity_search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """Search for the most similar document chunks.

        Args:
            query_embedding: Query embedding vector.
            top_k: Number of top results to return.

        Returns:
            List of search results with content, metadata, and similarity_score.
        """
        try:
            results = await asyncio.to_thread(
                self.collection.query,
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=["documents", "metadatas", "distances"],
            )

            documents = results.get("documents", [[]])[0]
            metadatas = results.get("metadatas", [[]])[0]
            distances = results.get("distances", [[]])[0]

            search_results: List[Dict[str, Any]] = []
            for content, metadata, distance in zip(documents, metadatas, distances):
                metadata = metadata or {}
                document_id = metadata.get("document_id")
                chunk_id = metadata.get("chunk_id")
                vector_id = (
                    f"{document_id}:{chunk_id}"
                    if document_id is not None and chunk_id is not None
                    else metadata.get("id")
                )
                similarity_score = max(0.0, 1.0 - distance) if distance is not None else 0.0
                search_results.append(
                    {
                        "id": vector_id,
                        "document_id": document_id,
                        "chunk_id": chunk_id,
                        "content": content,
                        "metadata": metadata,
                        "similarity_score": similarity_score,
                    }
                )

            return search_results
        except Exception as e:
            logger.exception("Failed to execute similarity search on ChromaDB collection %s", self.collection_name)
            raise RuntimeError("Failed to execute similarity search") from e

    async def delete_documents(self, document_ids: List[str]) -> None:
        """Delete all vector chunks for the given document IDs.

        Args:
            document_ids: List of document IDs to remove.
        """
        if not document_ids:
            return

        try:
            for document_id in document_ids:
                await asyncio.to_thread(
                    self.collection.delete,
                    where={"document_id": document_id},
                )
        except Exception as e:
            logger.exception("Failed to delete documents from ChromaDB collection %s", self.collection_name)
            raise RuntimeError("Failed to delete documents from the ChromaDB vector store") from e

    async def reset_collection(self) -> None:
        """Delete and recreate the ChromaDB collection."""
        try:
            await asyncio.to_thread(self.client.delete_collection, name=self.collection_name)
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata=self.collection_metadata,
                get_or_create=True,
            )
        except Exception as e:
            logger.exception("Failed to reset ChromaDB collection %s", self.collection_name)
            raise RuntimeError("Failed to reset the ChromaDB collection") from e

    async def get_statistics(self) -> Dict[str, Any]:
        """Return collection statistics."""
        try:
            count = await asyncio.to_thread(self.collection.count)
            return {
                "collection_name": self.collection_name,
                "persist_directory": self.persist_directory,
                "total_documents": count,
                "dimension": self.embedding_dimension,
                "status": "ready",
            }
        except Exception as e:
            logger.exception("Failed to retrieve statistics from ChromaDB collection %s", self.collection_name)
            raise RuntimeError("Failed to retrieve ChromaDB statistics") from e
