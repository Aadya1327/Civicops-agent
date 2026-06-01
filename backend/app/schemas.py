from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class PartnerTrack(str, Enum):
    mongodb = "MongoDB"
    elastic = "Elastic"
    arize = "Arize"
    fivetran = "Fivetran"
    gitlab = "GitLab"
    dynatrace = "Dynatrace"


class AgentRunRequest(BaseModel):
    goal: str = Field(min_length=10, max_length=700)
    city: str = Field(default="Toronto")
    partner_track: PartnerTrack = Field(default=PartnerTrack.mongodb)
    risk_tolerance: int = Field(default=45, ge=0, le=100)


class PlanStep(BaseModel):
    id: str
    title: str
    rationale: str
    tool: str


class ToolResult(BaseModel):
    tool: str
    status: str
    output: dict[str, Any]


class IntegrationStatus(BaseModel):
    gemini: str
    partner_mcp: str
    mode: str


class Recommendation(BaseModel):
    title: str
    impact: str
    confidence: int


class AgentRunResponse(BaseModel):
    run_id: str
    integration_status: IntegrationStatus
    summary: str
    plan: list[PlanStep]
    tool_results: list[ToolResult]
    recommendations: list[Recommendation]
    next_actions: list[str]
