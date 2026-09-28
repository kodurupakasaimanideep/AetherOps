from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.incident import Incident, IncidentCreate, IncidentUpdate, TeachAIRequest
from app.services.incident_service import IncidentService
from app.hindsight.client import HindsightClient

router = APIRouter(prefix="/incidents", tags=["Incidents"])
incident_service = IncidentService()
hindsight = HindsightClient()

@router.get("", response_model=List[Incident])
def get_incidents():
    return incident_service.list_incidents()

@router.get("/{incident_id}", response_model=Incident)
def get_incident(incident_id: str):
    inc = incident_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.post("", response_model=Incident)
def create_incident(incident: IncidentCreate):
    return incident_service.create_incident(incident.dict())

@router.patch("/{incident_id}", response_model=Incident)
def update_incident(incident_id: str, updates: IncidentUpdate):
    inc = incident_service.update_incident(incident_id, updates.dict(exclude_unset=True))
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.post("/{incident_id}/teach-ai")
def teach_ai(incident_id: str, payload: TeachAIRequest):
    inc = incident_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    from datetime import datetime
    updated = incident_service.update_incident(incident_id, {
        "root_cause": payload.actual_root_cause,
        "resolution": payload.fix_description,
        "status": "RESOLVED",
        "resolved_at": datetime.utcnow().isoformat() + "Z"
    })

    # Save memory into Hindsight
    hindsight.add_incident_memory(updated)
    return {"message": "Memory saved to organizational knowledge!", "incident": updated}
