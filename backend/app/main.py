from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import routes
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="CivicOps Agent API",
    description="A hackathon-ready agent backend with planning, tools, and traceable execution.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
