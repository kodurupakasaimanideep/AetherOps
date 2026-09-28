from pydantic import BaseModel
from typing import List, Optional

class ResolutionPlan(BaseModel):
    incident_id: str
    action_plan: List[str]
    automated_actions_available: List[str] = []
    estimated_recovery_time_minutes: int = 15
    safety_checks: List[str] = []
