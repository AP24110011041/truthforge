"""Agents endpoint."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from schemas import AgentInfo, AgentStatus, AgentHealthReport
from services import AgentService
from datetime import datetime

router = APIRouter(prefix="/agents", tags=["agents"])

# Initialize service
agent_service = AgentService()


@router.get("", response_description="List of all agents")
async def list_agents() -> Dict[str, Any]:
    """List all registered agents.

    Returns:
        List of agents with their status
    """
    try:
        status_info = await agent_service.get_orchestrator_status()

        agents: List[Dict[str, Any]] = []
        for agent_name, agent_status in status_info.get("agents", {}).items():
            agents.append({
                "name": agent_name,
                "status": "healthy" if agent_status.get("healthy") else "unhealthy",
                "version": agent_status.get("version", "unknown"),
                "uptime_seconds": agent_status.get("uptime_seconds", 0),
            })

        return {
            "total": len(agents),
            "agents": agents,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing agents: {str(e)}",
        )


@router.get("/health", response_description="Health status of all agents")
async def get_agents_health() -> Dict[str, Any]:
    """Get health status of all agents.

    Returns:
        Health report for all agents
    """
    try:
        is_healthy = await agent_service.get_agent_health()
        status_info = await agent_service.get_orchestrator_status()

        agents_info: List[Dict[str, Any]] = []
        for agent_name, agent_status in status_info.get("agents", {}).items():
            agents_info.append({
                "name": agent_name,
                "healthy": agent_status.get("healthy", False),
                "version": agent_status.get("version", "unknown"),
                "uptime_seconds": agent_status.get("uptime_seconds", 0),
            })

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "all_healthy": is_healthy,
            "agents": agents_info,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting health: {str(e)}",
        )


@router.get("/{agent_name}", response_description="Agent status")
async def get_agent_status(agent_name: str) -> Dict[str, Any]:
    """Get status of a specific agent.

    Args:
        agent_name: Name of the agent

    Returns:
        Agent status information

    Raises:
        HTTPException: If agent not found
    """
    try:
        status_info = await agent_service.get_orchestrator_status()
        agents = status_info.get("agents", {})

        # Normalize agent name (case-insensitive)
        agent_key = next(
            (k for k in agents.keys() if k.lower() == agent_name.lower()),
            None,
        )

        if not agent_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent {agent_name} not found",
            )

        agent_status = agents[agent_key]
        return {
            "name": agent_key,
            "status": "healthy" if agent_status.get("healthy") else "unhealthy",
            "version": agent_status.get("version", "unknown"),
            "uptime_seconds": agent_status.get("uptime_seconds", 0),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting agent status: {str(e)}",
        )
