"""Base agent interface for all agents in the system."""

from abc import ABC, abstractmethod
from typing import Any, Dict
from datetime import datetime


class BaseAgent(ABC):
    """Abstract base class for all agents."""

    def __init__(self, name: str, version: str = "1.0.0"):
        """Initialize agent with name and version.

        Args:
            name: Agent name
            version: Agent version
        """
        self.name = name
        self.version = version
        self.started_at = datetime.utcnow()
        self.is_healthy = True

    @abstractmethod
    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent with given input.

        Args:
            input_data: Input data for the agent

        Returns:
            Dict containing agent output
        """
        pass

    async def status(self) -> Dict[str, Any]:
        """Get agent status.

        Returns:
            Dict containing agent status information
        """
        return {
            "name": self.name,
            "version": self.version,
            "healthy": self.is_healthy,
            "uptime_seconds": (datetime.utcnow() - self.started_at).total_seconds(),
        }

    async def health(self) -> bool:
        """Check agent health.

        Returns:
            True if agent is healthy, False otherwise
        """
        return self.is_healthy
