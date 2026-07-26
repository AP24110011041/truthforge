"""Health check endpoint."""

from fastapi import APIRouter, status
from datetime import datetime, timedelta
from typing import Dict, Any, List

router = APIRouter(prefix="/health", tags=["health"])

# Mock uptime tracking
start_time = datetime.utcnow()


@router.get("", response_description="Health status of the system")
async def health_check() -> Dict[str, Any]:
    """Check the health of the system and all agents.

    Returns:
        Dict with system health status and agent information
    """
    uptime = datetime.utcnow() - start_time

    # Mock agent status
    registered_agents: List[Dict[str, Any]] = [
        {
            "name": "PlannerAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "ResearchAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "FactCheckerAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "HallucinationAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "CitationAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "ReportAgent",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
        {
            "name": "Orchestrator",
            "status": "healthy",
            "version": "1.0.0",
            "uptime_seconds": uptime.total_seconds(),
        },
    ]

    return {
        "status": "healthy",
        "version": "1.0.0",
        "uptime": str(uptime),
        "uptime_seconds": uptime.total_seconds(),
        "timestamp": datetime.utcnow().isoformat(),
        "registered_agents": registered_agents,
    }
