from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class IncidentBase(BaseModel):
    title: str
    service: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    status: str = "OPEN"  # OPEN, INVESTIGATING, RESOLVED
    summary: str
    symptoms: List[str] = []
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
