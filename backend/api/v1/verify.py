"""Verification endpoint."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from schemas import VerificationRequest, VerificationResponse
from services import VerificationService
from datetime import datetime
import uuid

router = APIRouter(prefix="/verify", tags=["verification"])

# Initialize service
verification_service = VerificationService()


@router.post("", response_model=VerificationResponse, status_code=status.HTTP_200_OK)
async def verify_claim(request: VerificationRequest) -> Dict[str, Any]:
    """Verify a single claim.

    Args:
        request: Verification request with claim and sources

    Returns:
        Verification results

    Raises:
        HTTPException: If verification fails
    """
    try:
        # Create verification task
        task = await verification_service.create_verification_task(
            claim=request.claim,
            sources=request.sources,
            metadata={"confidence_threshold": request.confidence_threshold},
        )

        # Mock verification results
        results: List[Dict[str, Any]] = [
            {
                "source_id": source_id,
                "supports_claim": True,
                "confidence": 0.88,
                "evidence": f"Found supporting evidence in {source_id}",
            }
            for source_id in request.sources[:2]
        ]

        # Update task with results
        await verification_service.update_verification_task(
            task_id=task["id"],
            status="verified",
            confidence=0.88,
            results=results,
        )

        return {
            "verified_count": 1,
            "partially_verified_count": 0,
            "unverified_count": 0,
            "overall_confidence": 0.88,
            "results": results,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification error: {str(e)}",
        )


@router.get("/tasks", response_description="List of verification tasks")
async def list_verification_tasks(status_filter: str | None = None) -> Dict[str, Any]:
    """List all verification tasks.

    Args:
        status_filter: Filter by status (pending, verified, partially_verified, unverified)

    Returns:
        List of verification tasks
    """
    try:
        tasks = await verification_service.list_verification_tasks(status=status_filter)
        return {
            "total": len(tasks),
            "tasks": tasks,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing tasks: {str(e)}",
        )


@router.get("/statistics", response_description="Verification statistics")
async def get_verification_statistics() -> Dict[str, Any]:
    """Get verification statistics.

    Returns:
        Verification statistics
    """
    try:
        stats = await verification_service.get_verification_statistics()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting statistics: {str(e)}",
        )
