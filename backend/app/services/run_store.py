from typing import Any

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.config import get_settings


class RunStore:
    def __init__(self) -> None:
        self.settings = get_settings()

    @property
    def is_configured(self) -> bool:
        return bool(self.settings.mongodb_uri)

    def save_agent_run(self, payload: dict[str, Any]) -> dict[str, Any]:
        if not self.is_configured:
            return {"status": "skipped", "reason": "MONGODB_URI is not configured"}

        try:
            with MongoClient(self.settings.mongodb_uri, serverSelectionTimeoutMS=5000) as client:
                database = client[self.settings.mongodb_database]
                database.agent_runs.insert_one(payload)
            return {"status": "stored", "database": self.settings.mongodb_database}
        except PyMongoError as error:
            return {"status": "failed", "error": str(error)}
