"""Document Service - Manages document storage and retrieval."""

from typing import Any, Dict, List, Optional
from datetime import datetime
import uuid


class DocumentService:
    """Service for managing document operations."""

    def __init__(self):
        """Initialize Document Service."""
        self.documents: Dict[str, Dict[str, Any]] = {}

    async def store_document(
        self, content: str, document_type: str, metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Store a document.

        Args:
            content: Document content
            document_type: Type of document (e.g., 'research', 'report')
            metadata: Additional metadata

        Returns:
            Dict with document info including ID
        """
        doc_id = str(uuid.uuid4())
        document = {
            "id": doc_id,
            "content": content,
            "type": document_type,
            "created_at": datetime.utcnow().isoformat(),
            "metadata": metadata or {},
            "size_bytes": len(content.encode("utf-8")),
        }
        self.documents[doc_id] = document
        return document

    async def retrieve_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a document by ID.

        Args:
            doc_id: Document ID

        Returns:
            Document dict or None if not found
        """
        return self.documents.get(doc_id)

    async def list_documents(self, doc_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all documents, optionally filtered by type.

        Args:
            doc_type: Filter by document type

        Returns:
            List of documents
        """
        docs = list(self.documents.values())
        if doc_type:
            docs = [d for d in docs if d["type"] == doc_type]
        return docs

    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document.

        Args:
            doc_id: Document ID

        Returns:
            True if deleted, False if not found
        """
        if doc_id in self.documents:
            del self.documents[doc_id]
            return True
        return False

    async def get_document_count(self) -> int:
        """Get total number of stored documents.

        Returns:
            Document count
        """
        return len(self.documents)
