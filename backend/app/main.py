from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.health import router as health_router
from app.api.incidents import router as incidents_router
from app.api.agent import router as agent_router
from app.api.memory import router as memory_router

app = FastAPI(
    title="OpsMind API",
    description="AI DevOps Incident Memory & Root-Cause Agent API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(incidents_router, prefix="/api/v1")
app.include_router(agent_router, prefix="/api/v1")
app.include_router(memory_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "OpsMind AI DevOps Incident Memory Engine API", "status": "active"}
