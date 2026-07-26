"""Response schemas for API endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ResearchResponse(BaseModel):
    """Response model for research endpoint."""

    status: str = Field(..., description="Status of the research")
    execution_time_seconds: float = Field(..., description="Execution time in seconds")
    report: Optional[Dict[str, Any]] = Field(None, description="Research report")
    error_message: Optional[str] = Field(None, description="Error message if applicable")


class VerificationResponse(BaseModel):
    """Response model for verification endpoint."""

    verified_count: int = Field(default=0, description="Number of verified claims")
    partially_verified_count: int = Field(default=0, description="Number of partially verified claims")
    unverified_count: int = Field(default=0, description="Number of unverified claims")
    overall_confidence: float = Field(default=0.0, description="Overall confidence score")
    results: List[Dict[str, Any]] = Field(
        default_factory=list, description="Detailed verification results"
    )


class DocumentResponse(BaseModel):
    """Response model for document operations."""

    id: str = Field(..., description="Document ID")
    title: Optional[str] = Field(None, description="Document title")
    created_at: str = Field(..., description="Creation timestamp")
    size_bytes: int = Field(..., description="Document size in bytes")
    type: str = Field(..., description="Document type")


class ReportResponse(BaseModel):
    """Response model for report operations."""

    id: str = Field(..., description="Report ID")
    title: str = Field(..., description="Report title")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")
    status: str = Field(..., description="Report status")
    version: str = Field(..., description="Report version")


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Overall system status")
    version: str = Field(..., description="API version")
    uptime: float = Field(..., description="System uptime in seconds")
    registered_agents: List[Dict[str, Any]] = Field(
        ..., description="List of registered agents and their status"
    )
    timestamp: str = Field(..., description="Response timestamp")


class ErrorResponse(BaseModel):
    """Response model for error responses."""

    status: str = Field(default="error", description="Status")
    error_code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: str = Field(..., description="Error timestamp")


class PaginatedResponse(BaseModel):
    """Generic paginated response model."""

    items: List[Dict[str, Any]] = Field(..., description="Items in current page")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")
