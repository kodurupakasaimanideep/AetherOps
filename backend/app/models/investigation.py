from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class InvestigationStep(BaseModel):
    step_number: int
    tool_used: str
    action: str
    observation: str
    timestamp: str

class InvestigationResult(BaseModel):
    incident_id: str
    status: str
    root_cause: str
    confidence_score: float
    matched_past_incidents: List[Dict[str, Any]] = []
    investigation_steps: List[InvestigationStep] = []
    recommended_runbook: Optional[str] = None
    remediation_steps: List[str] = []
