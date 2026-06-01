from app.schemas import AgentRunRequest
from app.services.agent_service import AgentService


def main() -> None:
    response = AgentService().run(
        AgentRunRequest(
            goal=(
                "Help event staff reduce crowd pressure and prepare clear "
                "public guidance for visitors."
            ),
            city="Toronto",
            partner_track="MongoDB",
            risk_tolerance=45,
        )
    )
    print(response.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
