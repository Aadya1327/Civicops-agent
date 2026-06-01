from uuid import uuid4

from app.schemas import (
    AgentRunRequest,
    AgentRunResponse,
    IntegrationStatus,
    PlanStep,
    Recommendation,
    ToolResult,
)
from app.services.gemini_client import GeminiClient
from app.services.run_store import RunStore
from app.services.tool_registry import ToolRegistry


class AgentService:
    def __init__(self) -> None:
        self.tools = ToolRegistry()
        self.gemini = GeminiClient()
        self.store = RunStore()

    def run(self, request: AgentRunRequest) -> AgentRunResponse:
        plan = self.gemini.create_plan(request) or self._build_plan(request)
        tool_results = self._execute_plan(plan, request)
        recommendations = self._recommend(tool_results, request.risk_tolerance)
        summary = self.gemini.summarize(request, recommendations) or (
            f"CivicOps Agent analyzed {request.city}, used the "
            f"{request.partner_track.value} track pattern, and prepared an "
            "operator-approved response plan."
        )

        response = AgentRunResponse(
            run_id=str(uuid4()),
            integration_status=IntegrationStatus(
                gemini="connected" if self.gemini.is_configured else "demo fallback",
                partner_mcp="connected" if self.tools.mcp.is_configured else "demo fallback",
                mode=(
                    "production-ready"
                    if self.gemini.is_configured and self.tools.mcp.is_configured
                    else "local demo"
                ),
            ),
            summary=summary,
            plan=plan,
            tool_results=tool_results,
            recommendations=recommendations,
            next_actions=[
                "Review the highest-confidence recommendation.",
                "Approve resource dispatch for the top two affected zones.",
                "Publish the drafted public guidance after human review.",
            ],
        )
        self.store.save_agent_run(response.model_dump())
        return response

    def _build_plan(self, request: AgentRunRequest) -> list[PlanStep]:
        return [
            PlanStep(
                id="step-1",
                title="Detect active pressure points",
                rationale=f"Understand what is changing before acting on: {request.goal}",
                tool="inspect_live_incidents",
            ),
            PlanStep(
                id="step-2",
                title="Match resources to incidents",
                rationale="Allocate the right team to each issue without overreacting.",
                tool="match_response_resources",
            ),
            PlanStep(
                id="step-3",
                title="Draft public updates",
                rationale="Keep people informed while operators stay in control.",
                tool="draft_public_updates",
            ),
        ]

    def _execute_plan(
        self, plan: list[PlanStep], request: AgentRunRequest
    ) -> list[ToolResult]:
        results: list[ToolResult] = []

        for step in plan:
            if step.tool == "inspect_live_incidents":
                output = self.tools.inspect_live_incidents(request.city)
            elif step.tool == "partner_context_lookup":
                output = self.tools.partner_context_lookup(
                    request.city,
                    request.partner_track.value,
                )
            elif step.tool == "match_response_resources":
                output = self.tools.match_response_resources()
            elif step.tool == "draft_public_updates":
                output = self.tools.draft_public_updates()
            else:
                output = {"error": f"Unknown tool: {step.tool}"}

            results.append(ToolResult(tool=step.tool, status="completed", output=output))

        return results

    def _recommend(
        self, tool_results: list[ToolResult], risk_tolerance: int
    ) -> list[Recommendation]:
        incident_result = next(
            result for result in tool_results if result.tool == "inspect_live_incidents"
        )
        top_incident = incident_result.output["incidents"][0]
        confidence = max(62, min(96, 100 - abs(risk_tolerance - top_incident["severity"])))

        return [
            Recommendation(
                title=f"Prioritize {top_incident['zone']}",
                impact="Reduces congestion risk before it spills into nearby areas.",
                confidence=confidence,
            ),
            Recommendation(
                title="Dispatch matched response teams",
                impact="Turns analysis into concrete action while keeping approvals human-led.",
                confidence=88,
            ),
            Recommendation(
                title="Publish zone-specific guidance",
                impact="Improves visitor trust and reduces avoidable support requests.",
                confidence=84,
            ),
        ]
