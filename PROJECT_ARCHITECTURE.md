# Project Architecture

## Core idea

CivicOps Agent is an action-oriented assistant for event operations. It accepts a mission, plans the work, executes tools, and returns traceable recommendations for a human operator.

## Frontend

- `frontend/src/main.tsx`: React dashboard, mission controls, integration status, plan, recommendations, tool trace, and approval-style next actions.
- `frontend/src/styles.css`: responsive operational UI styling.
- `VITE_API_URL`: controls the backend endpoint in deployment.

## Backend

- `backend/app/main.py`: FastAPI app, CORS, health endpoint.
- `backend/app/routes.py`: API route for running the agent.
- `backend/app/schemas.py`: Pydantic request/response models.
- `backend/app/services/agent_service.py`: orchestrates planning, tool calls, recommendations, and persistence.
- `backend/app/services/gemini_client.py`: optional Gemini integration.
- `backend/app/services/mcp_client.py`: optional MCP JSON-RPC bridge.
- `backend/app/services/run_store.py`: optional MongoDB persistence.
- `backend/app/services/tool_registry.py`: tool functions exposed to the agent.
- `backend/app/mock_mcp_bridge.py`: local demo bridge for MCP-style calls.

## Production flow

1. User enters a mission in the frontend.
2. Frontend posts to `/api/agent/run`.
3. Backend asks Gemini for a plan if `GOOGLE_API_KEY` is configured.
4. Backend calls local tools and optionally the MongoDB MCP bridge.
5. Backend stores the run in MongoDB if `MONGODB_URI` is configured.
6. Frontend displays the plan, trace, recommendations, and next actions.
