"""Pydantic schemas for API request and response contracts."""

# Request schemas
from .request import (
    ResearchRequest,
    VerificationRequest,
    DocumentUploadRequest,
    BatchResearchRequest,
    AgentStatusRequest,
)

# Response schemas
from .response import (
    ResearchResponse,
    VerificationResponse,
    DocumentResponse,
    ReportResponse,
    HealthResponse,
    ErrorResponse,
    PaginatedResponse,
)

# Agent schemas
from .agent import (
    AgentType,
    AgentStatus,
    AgentInfo,
    AgentExecutionRequest,
    AgentExecutionResult,
    AgentHealthReport,
)

# Report schemas
from .report import (
    ReportStatus,
    ReportMetadata,
    ResearchFinding,
    VerificationResult,
    FactCheckReport,
    HallucinationReport,
    Citation,
    QualityMetrics,
    ResearchReport,
)

__all__ = [
    # Request
    "ResearchRequest",
    "VerificationRequest",
    "DocumentUploadRequest",
    "BatchResearchRequest",
    "AgentStatusRequest",
    # Response
    "ResearchResponse",
    "VerificationResponse",
    "DocumentResponse",
    "ReportResponse",
    "HealthResponse",
    "ErrorResponse",
    "PaginatedResponse",
    # Agent
    "AgentType",
    "AgentStatus",
    "AgentInfo",
    "AgentExecutionRequest",
    "AgentExecutionResult",
    "AgentHealthReport",
    # Report
    "ReportStatus",
    "ReportMetadata",
    "ResearchFinding",
    "VerificationResult",
    "FactCheckReport",
    "HallucinationReport",
    "Citation",
    "QualityMetrics",
    "ResearchReport",
]
