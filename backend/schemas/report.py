"""Report-related schemas."""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum


class ReportStatus(str, Enum):
    """Enumeration of report statuses."""

    DRAFT = "draft"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ReportMetadata(BaseModel):
    """Metadata for a report."""

    report_id: str = Field(..., description="Report ID")
    title: str = Field(..., description="Report title")
    generated_at: str = Field(..., description="Generation timestamp")
    version: str = Field(..., description="Report version")
    status: ReportStatus = Field(..., description="Report status")


class ResearchFinding(BaseModel):
    """A single research finding."""

    finding_id: str = Field(..., description="Finding ID")
    summary: str = Field(..., description="Summary of finding")
    source_id: str = Field(..., description="Source ID")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")


class VerificationResult(BaseModel):
    """Verification result for a claim."""

    finding_id: str = Field(..., description="Finding ID")
    status: str = Field(..., description="Status: verified, partially_verified, unverified")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    supporting_evidence_count: int = Field(..., description="Number of supporting sources")
    contradicting_evidence_count: int = Field(..., description="Number of contradicting sources")
    verification_notes: Optional[str] = Field(None, description="Notes on verification")


class FactCheckReport(BaseModel):
    """Fact checking report."""

    total_verified: int = Field(..., description="Total verified claims")
    total_partially_verified: int = Field(..., description="Total partially verified claims")
    total_unverified: int = Field(..., description="Total unverified claims")
    overall_verification_confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Overall confidence score"
    )
    details: List[VerificationResult] = Field(..., description="Detailed results")


class HallucinationReport(BaseModel):
    """Hallucination detection report."""

    hallucination_score: float = Field(
        ..., ge=0.0, le=1.0, description="Hallucination score"
    )
    risk_level: str = Field(..., description="Risk level: low, moderate, high, critical")
    unverified_claims: int = Field(..., description="Number of unverified claims")
    total_claims: int = Field(..., description="Total claims analyzed")
    detection_confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence in detection"
    )
    recommendations: List[str] = Field(..., description="Recommendations")


class Citation(BaseModel):
    """Citation information."""

    apa: List[str] = Field(..., description="APA format citations")
    chicago: List[str] = Field(..., description="Chicago format citations")
    mla: List[str] = Field(..., description="MLA format citations")
    total_citations: int = Field(..., description="Total citations")


class QualityMetrics(BaseModel):
    """Quality metrics for a report."""

    source_diversity: float = Field(..., ge=0.0, le=1.0, description="Source diversity score")
    information_completeness: float = Field(
        ..., ge=0.0, le=1.0, description="Information completeness"
    )
    verification_coverage: float = Field(
        ..., ge=0.0, le=1.0, description="Verification coverage"
    )
    citation_accuracy: float = Field(
        ..., ge=0.0, le=1.0, description="Citation accuracy"
    )
    overall_quality_score: float = Field(
        ..., ge=0.0, le=1.0, description="Overall quality score"
    )


class ResearchReport(BaseModel):
    """Complete research report."""

    metadata: ReportMetadata = Field(..., description="Report metadata")
    executive_summary: Dict[str, Any] = Field(..., description="Executive summary")
    research_findings: Dict[str, Any] = Field(..., description="Research findings")
    fact_checking_results: FactCheckReport = Field(..., description="Fact checking results")
    hallucination_analysis: HallucinationReport = Field(..., description="Hallucination analysis")
    citations: Citation = Field(..., description="Citations")
    quality_metrics: QualityMetrics = Field(..., description="Quality metrics")
