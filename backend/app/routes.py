from fastapi import APIRouter

from app.schemas import AgentRunRequest, AgentRunResponse
from app.services.agent_service import AgentService

router = APIRouter(tags=["agent"])
agent_service = AgentService()


@router.post("/agent/run", response_model=AgentRunResponse)
def run_agent(payload: AgentRunRequest) -> AgentRunResponse:
    return agent_service.run(payload)
