"""Agent Service - Manages agent lifecycle and execution."""

from typing import Any, Dict, Optional
from backend.agents import Orchestrator


class AgentService:
    """Service for managing agent operations."""

    def __init__(self):
        """Initialize Agent Service."""
        self.orchestrator = Orchestrator()

    async def execute_research_pipeline(self, question: str) -> Dict[str, Any]:
        """Execute the complete research pipeline.

        Args:
            question: Research question to process

        Returns:
            Dict with complete research report
        """
        result = await self.orchestrator.run({"question": question})
        return result

    async def get_orchestrator_status(self) -> Dict[str, Any]:
        """Get status of the orchestrator and all agents.

        Returns:
            Dict with orchestrator and agent statuses
        """
        agent_statuses = await self.orchestrator.get_agent_status()
        orchestrator_status = await self.orchestrator.status()

        return {
            "orchestrator": orchestrator_status,
            "agents": agent_statuses,
            "is_healthy": await self.orchestrator.health(),
            "total_agents": len(agent_statuses),
        }

    async def get_agent_health(self) -> bool:
        """Check if all agents are healthy.

        Returns:
            True if all agents are healthy
        """
        return await self.orchestrator.health()
