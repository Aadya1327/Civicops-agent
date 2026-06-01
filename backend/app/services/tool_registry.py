from app.services.mock_data import INCIDENTS, MESSAGES, RESOURCES
from app.services.mcp_client import PartnerMcpClient


class ToolRegistry:
    """Small local stand-in for partner MCP tools."""

    def __init__(self) -> None:
        self.mcp = PartnerMcpClient()

    def inspect_live_incidents(self, city: str) -> dict:
        incidents = sorted(INCIDENTS, key=lambda item: item["severity"], reverse=True)
        return {"city": city, "incidents": incidents[:4]}

    def partner_context_lookup(self, city: str, partner_track: str) -> dict:
        return self.mcp.call_tool(
            "partner_context_lookup",
            {"city": city, "partner_track": partner_track},
        )

    def match_response_resources(self) -> dict:
        matches = []
        for incident in INCIDENTS:
            resource = next(
                item for item in RESOURCES if item["best_for"] == incident["type"]
            )
            matches.append(
                {
                    "zone": incident["zone"],
                    "incident": incident["type"],
                    "resource": resource["name"],
                    "capacity": resource["capacity"],
                }
            )
        return {"matches": matches}

    def draft_public_updates(self) -> dict:
        updates = [
            {"zone": incident["zone"], "message": MESSAGES[incident["type"]]}
            for incident in INCIDENTS
        ]
        return {"updates": updates}
