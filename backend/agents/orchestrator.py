"""Orchestrator - Coordinates all agents in the research and verification pipeline."""

from typing import Any, Dict, List
from datetime import datetime
from .base_agent import BaseAgent
from .planner_agent import PlannerAgent
from .research_agent import ResearchAgent
from .fact_checker_agent import FactCheckerAgent
from .hallucination_agent import HallucinationAgent
from .citation_agent import CitationAgent
from .report_agent import ReportAgent


class Orchestrator(BaseAgent):
    """Orchestrates the complete research and fact-checking pipeline."""

    def __init__(self):
        """Initialize Orchestrator with all agents."""
        super().__init__(name="Orchestrator", version="1.0.0")
        self.planner = PlannerAgent()
        self.researcher = ResearchAgent()
        self.fact_checker = FactCheckerAgent()
        self.hallucination_detector = HallucinationAgent()
        self.citation_generator = CitationAgent()
        self.report_generator = ReportAgent()

        self.agents: List[BaseAgent] = [
            self.planner,
            self.researcher,
            self.fact_checker,
            self.hallucination_detector,
            self.citation_generator,
            self.report_generator,
        ]

    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the complete research and verification pipeline.

        Pipeline:
        1. Planner - Create research plan
        2. Researcher - Conduct research
        3. Fact Checker - Verify findings
        4. Hallucination Detector - Detect hallucinations
        5. Citation Generator - Generate citations
        6. Report Generator - Create final report

        Args:
            input_data: Contains 'question' key with research query

        Returns:
            Dict with complete research report and findings
        """
        question: str = input_data.get("question", "")
        pipeline_start = datetime.utcnow()

        try:
            # Step 1: Planner
            plan_result = await self.planner.run({"question": question})

            # Step 2: Researcher
            research_result = await self.researcher.run(
                {"question": question, "plan": plan_result.get("plan", [])}
            )

            # Step 3: Fact Checker
            verification_result = await self.fact_checker.run(
                {"findings": research_result.get("findings", [])}
            )

            # Step 4: Hallucination Detector
            hallucination_result = await self.hallucination_detector.run(
                {"verification_results": verification_result}
            )

            # Step 5: Citation Generator
            citation_result = await self.citation_generator.run(
                {"sources": research_result.get("sources", [])}
            )

            # Step 6: Report Generator
            report_result = await self.report_generator.run(
                {
                    "question": question,
                    "research_data": research_result,
                    "verification_data": verification_result,
                    "hallucination_data": hallucination_result,
                    "citation_data": citation_result,
                }
            )

            pipeline_end = datetime.utcnow()

            return {
                "status": "success",
                "execution_time_seconds": (pipeline_end - pipeline_start).total_seconds(),
                "report": report_result,
                "pipeline_stages": {
                    "planner": plan_result,
                    "researcher": research_result,
                    "fact_checker": verification_result,
                    "hallucination_detector": hallucination_result,
                    "citation_generator": citation_result,
                },
            }

        except Exception as e:
            self.is_healthy = False
            return {
                "status": "error",
                "error_message": str(e),
                "execution_time_seconds": (datetime.utcnow() - pipeline_start).total_seconds(),
            }

    async def health(self) -> bool:
        """Check health of all agents.

        Returns:
            True if all agents are healthy
        """
        all_healthy = True
        for agent in self.agents:
            if not await agent.health():
                all_healthy = False
                break
        return all_healthy and self.is_healthy

    async def get_agent_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all agents in the orchestrator.

        Returns:
            Dict with status of each agent
        """
        agent_statuses = {}
        for agent in self.agents:
            status = await agent.status()
            agent_statuses[agent.name] = status
        return agent_statuses
