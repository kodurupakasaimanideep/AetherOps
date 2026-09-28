from typing import Dict, Any, Optional
from app.agent.incident_agent import IncidentAgent
from app.services.incident_service import IncidentService

class RootCauseService:
    def __init__(self):
        self.agent = IncidentAgent()
        self.incident_service = IncidentService()

    def analyze_incident(self, incident_id: str) -> Dict[str, Any]:
        incident = self.incident_service.get_incident(incident_id)
        if not incident:
            return {"error": f"Incident {incident_id} not found"}

        investigation = self.agent.investigate(incident)

        if investigation.get("root_cause"):
            self.incident_service.update_incident(incident_id, {
                "root_cause": investigation["root_cause"],
                "status": "INVESTIGATING"
            })

        return investigation
