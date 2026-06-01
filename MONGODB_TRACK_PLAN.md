# MongoDB Track Plan

## Why MongoDB is the best track for this app

CivicOps Agent works with event operations data that changes shape quickly. MongoDB is a natural fit because each incident, tool call, recommendation, action approval, and public update can be stored as a flexible document.

## Suggested collections

### `incidents`

```json
{
  "_id": "incident_north_gate_001",
  "eventId": "world-cup-fan-zone",
  "zone": "North Gate",
  "type": "crowd_density",
  "severity": 82,
  "trend": "rising",
  "updatedAt": "2026-06-01T18:10:00Z"
}
```

### `resources`

```json
{
  "_id": "resource_volunteer_a",
  "name": "Volunteer Team A",
  "capacity": 12,
  "bestFor": "crowd_density",
  "status": "available"
}
```

### `agent_runs`

```json
{
  "_id": "run_123",
  "goal": "Reduce crowd pressure",
  "plan": [],
  "toolResults": [],
  "recommendations": [],
  "integrationStatus": {
    "gemini": "connected",
    "partnerMcp": "connected"
  },
  "createdAt": "2026-06-01T18:12:00Z"
}
```

### `approvals`

```json
{
  "_id": "approval_123",
  "runId": "run_123",
  "action": "Dispatch Volunteer Team A",
  "status": "pending",
  "reviewedBy": null
}
```

## MCP tools to expose

- `find_active_incidents`
- `find_available_resources`
- `insert_agent_run`
- `create_approval_request`
- `update_public_guidance`

## How to connect this code

1. Run or deploy a MongoDB MCP server/bridge.
2. Expose JSON-RPC `tools/call` over HTTP.
3. Set `MCP_SERVER_URL` in `backend/.env`.
4. Replace `partner_context_lookup` in `backend/app/services/tool_registry.py` with the MongoDB tool names above.
5. Store every agent run and approval for judge-friendly auditability.
