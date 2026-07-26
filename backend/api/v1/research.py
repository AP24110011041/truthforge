"""Research endpoint."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from backend.schemas import ResearchRequest, ResearchResponse
from backend.services import AgentService
from datetime import datetime

router = APIRouter(prefix="/research", tags=["research"])

# Initialize service
agent_service = AgentService()


@router.post("", response_model=ResearchResponse, status_code=status.HTTP_200_OK)
async def conduct_research(request: ResearchRequest) -> Dict[str, Any]:
    """Conduct research on a given question.

    Executes the complete research pipeline:
    1. Planner - Creates research plan
    2. Researcher - Gathers information
    3. Fact Checker - Verifies claims
    4. Hallucination Detector - Detects hallucinations
    5. Citation Generator - Generates citations
    6. Report Generator - Creates final report

    Args:
        request: Research request with question and options

    Returns:
        Research response with complete report

    Raises:
        HTTPException: If research fails
    """
    try:
        start_time = datetime.utcnow()

        # Execute research pipeline
        result = await agent_service.execute_research_pipeline(request.question)

        execution_time = (datetime.utcnow() - start_time).total_seconds()

        if result.get("status") == "error":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error_message", "Research execution failed"),
            )

        return {
            "status": "success",
            "execution_time_seconds": execution_time,
            "report": result.get("report"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research execution error: {str(e)}",
        )


@router.get("/status", response_description="Status of research agents")
async def get_research_status() -> Dict[str, Any]:
    """Get status of research agents.

    Returns:
        Dict with agent statuses
    """
    try:
        status_info = await agent_service.get_orchestrator_status()
        return status_info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting status: {str(e)}",
        )
