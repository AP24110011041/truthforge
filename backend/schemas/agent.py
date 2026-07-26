"""Agent-related schemas."""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum


class AgentType(str, Enum):
    """Enumeration of agent types."""

    PLANNER = "planner"
    RESEARCHER = "researcher"
    FACT_CHECKER = "fact_checker"
    HALLUCINATION_DETECTOR = "hallucination_detector"
    CITATION_GENERATOR = "citation_generator"
    REPORT_GENERATOR = "report_generator"
    ORCHESTRATOR = "orchestrator"


class AgentStatus(str, Enum):
    """Enumeration of agent statuses."""

    RUNNING = "running"
    IDLE = "idle"
    ERROR = "error"
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"


class AgentInfo(BaseModel):
    """Information about an agent."""

    name: str = Field(..., description="Agent name")
    type: AgentType = Field(..., description="Agent type")
    version: str = Field(..., description="Agent version")
    status: AgentStatus = Field(..., description="Current agent status")
    healthy: bool = Field(..., description="Is agent healthy")
    uptime_seconds: float = Field(..., description="Agent uptime in seconds")


class AgentExecutionRequest(BaseModel):
    """Request to execute an agent."""

    agent_type: AgentType = Field(..., description="Type of agent to execute")
    input_data: Dict[str, Any] = Field(..., description="Input data for the agent")
    timeout_seconds: Optional[int] = Field(None, description="Execution timeout in seconds")


class AgentExecutionResult(BaseModel):
    """Result of agent execution."""

    agent_type: AgentType = Field(..., description="Agent that was executed")
    status: str = Field(..., description="Execution status (success, error, timeout)")
    execution_time_seconds: float = Field(..., description="Execution time in seconds")
    output: Optional[Dict[str, Any]] = Field(None, description="Agent output")
    error_message: Optional[str] = Field(None, description="Error message if failed")


class AgentHealthReport(BaseModel):
    """Health report for agents."""

    timestamp: str = Field(..., description="Report timestamp")
    all_healthy: bool = Field(..., description="Are all agents healthy")
    agents: List[AgentInfo] = Field(..., description="Status of each agent")
    uptime_seconds: float = Field(..., description="System uptime in seconds")
