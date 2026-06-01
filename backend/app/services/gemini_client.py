import json

import httpx

from app.config import get_settings
from app.schemas import AgentRunRequest, PlanStep, Recommendation


class GeminiClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    @property
    def is_configured(self) -> bool:
        return bool(self.settings.google_api_key)

    def create_plan(self, request: AgentRunRequest) -> list[PlanStep] | None:
        if not self.is_configured:
            return None

        prompt = (
            "Create exactly 3 concise JSON plan steps for an operations agent. "
            "Each step must include id, title, rationale, and tool. "
            "Use only these tools: inspect_live_incidents, partner_context_lookup, "
            "match_response_resources, draft_public_updates. "
            f"Goal: {request.goal}. City: {request.city}. "
            f"Partner track: {request.partner_track.value}."
        )
        data = self._generate_json(prompt)
        if not isinstance(data, list):
            return None

        steps: list[PlanStep] = []
        for index, item in enumerate(data[:3], start=1):
            if not isinstance(item, dict):
                continue
            steps.append(
                PlanStep(
                    id=str(item.get("id") or f"step-{index}"),
                    title=str(item.get("title") or "Operate safely"),
                    rationale=str(item.get("rationale") or "Advance the mission."),
                    tool=str(item.get("tool") or "inspect_live_incidents"),
                )
            )
        return steps or None

    def summarize(
        self,
        request: AgentRunRequest,
        recommendations: list[Recommendation],
    ) -> str | None:
        if not self.is_configured:
            return None

        prompt = (
            "Write one polished sentence summarizing this agent run for a hackathon demo. "
            f"Goal: {request.goal}. City: {request.city}. "
            f"Partner track: {request.partner_track.value}. "
            f"Recommendations: {[item.model_dump() for item in recommendations]}"
        )
        text = self._generate_text(prompt)
        return text.strip() if text else None

    def _generate_text(self, prompt: str) -> str | None:
        response = self._post(prompt)
        candidates = response.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        return "".join(part.get("text", "") for part in parts)

    def _generate_json(self, prompt: str) -> object | None:
        text = self._generate_text(prompt)
        if not text:
            return None
        cleaned = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```")
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return None

    def _post(self, prompt: str) -> dict:
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.settings.gemini_model}:generateContent"
        )
        params = {"key": self.settings.google_api_key}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        with httpx.Client(timeout=18) as client:
            response = client.post(url, params=params, json=payload)
            response.raise_for_status()
            return response.json()
