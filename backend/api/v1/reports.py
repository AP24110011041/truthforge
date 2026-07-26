"""Reports endpoint."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from schemas import ReportResponse
from services import ReportService
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["reports"])

# Initialize service
report_service = ReportService()


@router.get("", response_description="List of reports")
async def list_reports(
    status_filter: str | None = None, limit: int = 100
) -> Dict[str, Any]:
    """List all research reports.

    Args:
        status_filter: Filter by status (draft, in_review, completed)
        limit: Maximum number of reports to return

    Returns:
        List of reports
    """
    try:
        reports = await report_service.list_reports(status=status_filter, limit=limit)

        return {
            "total": len(reports),
            "limit": limit,
            "reports": [
                {
                    "id": report["id"],
                    "title": report["title"],
                    "created_at": report["created_at"],
                    "updated_at": report["updated_at"],
                    "status": report["status"],
                    "version": report["version"],
                }
                for report in reports
            ],
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing reports: {str(e)}",
        )


@router.get("/{report_id}", response_description="Report details")
async def get_report(report_id: str) -> Dict[str, Any]:
    """Get a specific report.

    Args:
        report_id: Report ID

    Returns:
        Report details

    Raises:
        HTTPException: If report not found
    """
    try:
        report = await report_service.get_report(report_id)

        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )

        return report

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving report: {str(e)}",
        )


@router.get("/{report_id}/export", response_description="Report as JSON")
async def export_report(report_id: str) -> Dict[str, Any]:
    """Export report as JSON.

    Args:
        report_id: Report ID

    Returns:
        Report JSON data

    Raises:
        HTTPException: If report not found
    """
    try:
        json_data = await report_service.export_report_json(report_id)

        if not json_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )

        return {
            "report_id": report_id,
            "export_timestamp": datetime.utcnow().isoformat(),
            "format": "json",
            "data": json_data,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exporting report: {str(e)}",
        )


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(report_id: str) -> None:
    """Delete a report.

    Args:
        report_id: Report ID

    Raises:
        HTTPException: If report not found or deletion fails
    """
    try:
        success = await report_service.delete_report(report_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting report: {str(e)}",
        )


@router.get("/statistics", response_description="Report statistics")
async def get_report_statistics() -> Dict[str, Any]:
    """Get report statistics.

    Returns:
        Report statistics
    """
    try:
        count = await report_service.get_report_count()

        return {
            "total_reports": count,
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting statistics: {str(e)}",
        )
