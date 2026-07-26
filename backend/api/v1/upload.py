"""Document upload endpoint."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from backend.schemas import DocumentUploadRequest, DocumentResponse
from backend.services import DocumentService
from datetime import datetime

router = APIRouter(prefix="/upload", tags=["documents"])

# Initialize service
document_service = DocumentService()


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(request: DocumentUploadRequest) -> Dict[str, Any]:
    """Upload a document.

    Args:
        request: Document upload request

    Returns:
        Document metadata

    Raises:
        HTTPException: If upload fails
    """
    try:
        document = await document_service.store_document(
            content=request.content,
            document_type=request.document_type,
            metadata=request.metadata,
        )

        return {
            "id": document["id"],
            "title": request.title or "Untitled",
            "created_at": document["created_at"],
            "size_bytes": document["size_bytes"],
            "type": document["type"],
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document upload error: {str(e)}",
        )


@router.get("/documents", response_description="List of uploaded documents")
async def list_documents(doc_type: str | None = None) -> Dict[str, Any]:
    """List all uploaded documents.

    Args:
        doc_type: Filter by document type

    Returns:
        List of documents
    """
    try:
        documents = await document_service.list_documents(doc_type=doc_type)

        return {
            "total": len(documents),
            "documents": [
                {
                    "id": doc["id"],
                    "type": doc["type"],
                    "created_at": doc["created_at"],
                    "size_bytes": doc["size_bytes"],
                }
                for doc in documents
            ],
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing documents: {str(e)}",
        )


@router.get("/documents/{doc_id}", response_description="Document details")
async def get_document(doc_id: str) -> Dict[str, Any]:
    """Get a specific document.

    Args:
        doc_id: Document ID

    Returns:
        Document details

    Raises:
        HTTPException: If document not found
    """
    try:
        document = await document_service.retrieve_document(doc_id)

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {doc_id} not found",
            )

        return document

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving document: {str(e)}",
        )


@router.delete("/documents/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(doc_id: str) -> None:
    """Delete a document.

    Args:
        doc_id: Document ID

    Raises:
        HTTPException: If document not found or deletion fails
    """
    try:
        success = await document_service.delete_document(doc_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {doc_id} not found",
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting document: {str(e)}",
        )
