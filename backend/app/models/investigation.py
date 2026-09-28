from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class InvestigationStep(BaseModel):
    step_number: int
    tool_used: str
    action: str
    observation: str
    timestamp: str

class EvidenceChainItem(BaseModel):
    title: str
    incident_id: str
    match_score: float
    evidence_type: str
    description: str
    resolution: str

class InvestigationResult(BaseModel):
    incident_id: str
    status: str
    root_cause: str
    confidence_score: float
    matched_past_incidents: List[Dict[str, Any]] = []
    evidence_chain: List[EvidenceChainItem] = []
    investigation_steps: List[InvestigationStep] = []
    recommended_checklist: List[str] = []
    recommended_runbook: Optional[str] = None
    remediation_steps: List[str] = []
    ai_analysis_text: Optional[str] = None
