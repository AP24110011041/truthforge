"""Report Service - Manages research report generation and storage."""

from typing import Any, Dict, List, Optional
from datetime import datetime
import uuid
import json


class ReportService:
    """Service for managing research reports."""

    def __init__(self):
        """Initialize Report Service."""
        self.reports: Dict[str, Dict[str, Any]] = {}

    async def create_report(
        self, title: str, content: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new research report.

        Args:
            title: Report title
            content: Report content (structured data)
            metadata: Additional metadata

        Returns:
            Dict with report info
        """
        report_id = str(uuid.uuid4())
        report = {
            "id": report_id,
            "title": title,
            "content": content,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "status": "completed",  # draft, in_review, completed
            "version": "1.0",
            "metadata": metadata or {},
        }
        self.reports[report_id] = report
        return report

    async def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        """Get a report by ID.

        Args:
            report_id: Report ID

        Returns:
            Report dict or None if not found
        """
        return self.reports.get(report_id)

    async def list_reports(
        self, status: Optional[str] = None, limit: int = 100
    ) -> List[Dict[str, Any]]:
        """List all reports, optionally filtered by status.

        Args:
            status: Filter by status
            limit: Maximum number of reports to return

        Returns:
            List of reports
        """
        reports = list(self.reports.values())
        if status:
            reports = [r for r in reports if r["status"] == status]

        # Sort by created_at descending
        reports.sort(key=lambda r: r["created_at"], reverse=True)
        return reports[:limit]

    async def update_report(
        self, report_id: str, title: Optional[str] = None, content: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Update a report.

        Args:
            report_id: Report ID
            title: New title (optional)
            content: New content (optional)

        Returns:
            Updated report or None if not found
        """
        if report_id not in self.reports:
            return None

        report = self.reports[report_id]
        if title:
            report["title"] = title
        if content:
            report["content"] = content
        report["updated_at"] = datetime.utcnow().isoformat()
        return report

    async def delete_report(self, report_id: str) -> bool:
        """Delete a report.

        Args:
            report_id: Report ID

        Returns:
            True if deleted, False if not found
        """
        if report_id in self.reports:
            del self.reports[report_id]
            return True
        return False

    async def export_report_json(self, report_id: str) -> Optional[str]:
        """Export report as JSON string.

        Args:
            report_id: Report ID

        Returns:
            JSON string or None if not found
        """
        report = self.reports.get(report_id)
        if not report:
            return None
        return json.dumps(report, indent=2)

    async def get_report_count(self) -> int:
        """Get total number of reports.

        Returns:
            Report count
        """
        return len(self.reports)
