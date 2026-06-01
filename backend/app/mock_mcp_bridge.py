from fastapi import FastAPI
from pydantic import BaseModel


class JsonRpcRequest(BaseModel):
    jsonrpc: str
    id: str | int
    method: str
    params: dict


app = FastAPI(
    title="Mock Partner MCP Bridge",
    description="Local JSON-RPC bridge that mimics a partner MCP tool endpoint.",
)


@app.post("/mcp")
def call_tool(payload: JsonRpcRequest) -> dict:
    tool_name = payload.params.get("name", "unknown")
    arguments = payload.params.get("arguments", {})

    return {
        "jsonrpc": "2.0",
        "id": payload.id,
        "result": {
            "tool": tool_name,
            "partner_signal": "mock-connected",
            "summary": (
                f"Mock MCP context for {arguments.get('city', 'the selected city')} "
                f"using {arguments.get('partner_track', 'partner')}."
            ),
            "recommended_dataset": "event_operations_live_context",
            "confidence": 87,
        },
    }
