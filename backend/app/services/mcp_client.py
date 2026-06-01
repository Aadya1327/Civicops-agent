from typing import Any

import httpx

from app.config import get_settings


class PartnerMcpClient:
    """HTTP adapter for a partner MCP bridge or gateway.

    Many hackathon MCP servers run as local processes. For a web backend, expose
    that server through a small HTTP bridge and set MCP_SERVER_URL.
    """

    def __init__(self) -> None:
        self.settings = get_settings()

    @property
    def is_configured(self) -> bool:
        return bool(self.settings.mcp_server_url)

    def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        if not self.is_configured:
            return {
                "source": "demo",
                "message": "Set MCP_SERVER_URL to call a real partner MCP bridge.",
                "tool": tool_name,
                "arguments": arguments,
            }

        headers = {}
        if self.settings.mcp_auth_token:
            headers["Authorization"] = f"Bearer {self.settings.mcp_auth_token}"

        payload = {
            "jsonrpc": "2.0",
            "id": "civicops-tool-call",
            "method": "tools/call",
            "params": {"name": tool_name, "arguments": arguments},
        }

        with httpx.Client(timeout=18) as client:
            response = client.post(
                self.settings.mcp_server_url,
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()
