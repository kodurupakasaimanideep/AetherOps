from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.root_cause_service import RootCauseService
from app.agent.incident_agent import IncidentAgent

router = APIRouter(prefix="/agent", tags=["Agent"])
root_cause_service = RootCauseService()
agent = IncidentAgent()

class ChatRequest(BaseModel):
    message: str
    incident_context: Optional[Dict[str, Any]] = None

@router.post("/investigate/{incident_id}")
def investigate_incident(incident_id: str):
    res = root_cause_service.analyze_incident(incident_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.post("/chat")
def chat_with_agent(req: ChatRequest):
    reply = agent.chat_copilot(req.message, req.incident_context)
    return {"response": reply}
