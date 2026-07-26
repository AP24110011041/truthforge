"""Request schemas for API endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ResearchRequest(BaseModel):
    """Request model for research endpoint."""

    question: str = Field(..., min_length=1, max_length=1000, description="Research question")
    include_citations: bool = Field(
        default=True, description="Include citations in research"
    )
    language: str = Field(default="en", description="Language for research")


class VerificationRequest(BaseModel):
    """Request model for verification endpoint."""

    claim: str = Field(..., min_length=1, max_length=1000, description="Claim to verify")
    sources: List[str] = Field(
        default_factory=list, description="Source IDs to verify against"
    )
    confidence_threshold: float = Field(
        default=0.7, ge=0.0, le=1.0, description="Minimum confidence threshold"
    )


class DocumentUploadRequest(BaseModel):
    """Request model for document upload endpoint."""

    content: str = Field(..., min_length=1, description="Document content")
    document_type: str = Field(
        ..., description="Type of document (research, report, article, etc.)"
    )
    title: Optional[str] = Field(default=None, description="Document title")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")


class BatchResearchRequest(BaseModel):
    """Request model for batch research."""

    questions: List[str] = Field(..., min_length=1, max_length=100, description="Research questions")
    parallel_execution: bool = Field(default=False, description="Execute in parallel")


class AgentStatusRequest(BaseModel):
    """Request model for agent status check."""

    agent_name: Optional[str] = Field(
        default=None, description="Specific agent to check, or all if None"
    )
