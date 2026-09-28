import os
import glob
import json
from typing import List, Dict, Any, Optional

class IncidentService:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        self.data_dir = os.path.join(base_dir, "data", "incidents")

    def list_incidents(self) -> List[Dict[str, Any]]:
        incidents = []
        if os.path.exists(self.data_dir):
            files = glob.glob(os.path.join(self.data_dir, "*.json"))
            for f in sorted(files):
                try:
                    with open(f, 'r', encoding='utf-8') as fh:
                        incidents.append(json.load(fh))
                except Exception as e:
                    print(f"Error reading incident file {f}: {e}")
        return incidents

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        incidents = self.list_incidents()
        for inc in incidents:
            if inc.get("id", "").upper() == incident_id.upper():
                return inc
        return None

    def create_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        incidents = self.list_incidents()
        new_id = incident_data.get("id") or f"INC-{len(incidents)+1:03d}"
        incident_data["id"] = new_id
        if "created_at" not in incident_data:
            from datetime import datetime
            incident_data["created_at"] = datetime.utcnow().isoformat() + "Z"

        filepath = os.path.join(self.data_dir, f"{new_id.lower()}.json")
        os.makedirs(self.data_dir, exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as fh:
            json.dump(incident_data, fh, indent=2)

        return incident_data

    def update_incident(self, incident_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        inc = self.get_incident(incident_id)
        if not inc:
            return None

        for k, v in updates.items():
            if v is not None:
                inc[k] = v

        filepath = os.path.join(self.data_dir, f"{incident_id.lower()}.json")
        with open(filepath, 'w', encoding='utf-8') as fh:
            json.dump(inc, fh, indent=2)

        return inc
