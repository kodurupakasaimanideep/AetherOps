from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LiveSignals(BaseModel):
    cpu: str = "41%"
    memory: str = "78%"
    errors: str = "2,481"
    latency: str = "3.8 sec"

class IncidentBase(BaseModel):
    title: str
    service: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    status: str = "OPEN"  # OPEN, INVESTIGATING, RESOLVED
    summary: str
    symptoms: List[str] = []
    live_signals: Optional[LiveSignals] = Field(default_factory=LiveSignals)
    deployment: Optional[str] = None
    tags: List[str] = []

class IncidentCreate(IncidentBase):
    root_cause: Optional[str] = None
    resolution: Optional[str] = None

class Incident(IncidentBase):
    id: str
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    created_at: str
    resolved_at: Optional[str] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    summary: Optional[str] = None
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    resolved_at: Optional[str] = None

class TeachAIRequest(BaseModel):
    actual_root_cause: str
    fix_description: str
    ai_recommendation_useful: bool = True
