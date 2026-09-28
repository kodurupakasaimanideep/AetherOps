from typing import Dict, Any, List
from app.services.incident_service import IncidentService

class RecommendationService:
    def __init__(self):
        self.incident_service = IncidentService()

    def get_recommendations(self, incident_id: str) -> Dict[str, Any]:
        inc = self.incident_service.get_incident(incident_id)
        if not inc:
            return {"error": f"Incident {incident_id} not found"}

        service = inc.get("service", "")
        recommendations = [
            f"Review connection pooling settings for service '{service}'.",
            "Enable rate-limiting and circuit breaker pattern on upstream API endpoints.",
            "Schedule automated index maintenance and slow-query alerts in monitoring tool."
        ]

        return {
            "incident_id": incident_id,
            "recommended_runbook": "database-recovery.md" if "database" in service or "user" in service else "api-recovery.md",
            "recommendations": recommendations,
            "automated_fixes": [
                "Trigger DB connection pool scaling (+50 slots)",
                "Purge expired session cache keys"
            ]
        }
