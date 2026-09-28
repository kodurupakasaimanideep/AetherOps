from typing import List, Dict, Any, Optional
from app.hindsight.memory import HindsightMemoryEngine

class HindsightClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HindsightClient, cls).__new__(cls)
            cls._instance.engine = HindsightMemoryEngine()
        return cls._instance

    def query_similar_incidents(self, query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
        return self.engine.search_memories(query_text, top_k=top_k)

    def add_incident_memory(self, incident: Dict[str, Any]) -> str:
        return self.engine.add_memory(incident)

    def list_memories(self) -> List[Dict[str, Any]]:
        return self.engine.get_all_memories()
