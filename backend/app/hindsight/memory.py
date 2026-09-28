import os
import json
import glob
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.hindsight.config import MemoryConfig

class HindsightMemoryEngine:
    def __init__(self, data_dir: Optional[str] = None):
        if not data_dir:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            data_dir = os.path.join(base_dir, "data", "incidents")
        self.data_dir = data_dir
        self.memories: List[Dict[str, Any]] = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.load_memories()

    def load_memories(self):
        self.memories = []
        if os.path.exists(self.data_dir):
            files = glob.glob(os.path.join(self.data_dir, "*.json"))
            for filepath in files:
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.memories.append(data)
                except Exception as e:
                    print(f"Error loading memory file {filepath}: {e}")

    def add_memory(self, incident_data: Dict[str, Any]) -> str:
        incident_id = incident_data.get("id", f"INC-{len(self.memories)+100:03d}")
        incident_data["id"] = incident_id
        filepath = os.path.join(self.data_dir, f"{incident_id.lower()}.json")
        os.makedirs(self.data_dir, exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(incident_data, f, indent=2)

        self.load_memories()
        return incident_id

    def search_memories(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.memories:
            return []

        corpus = []
        for mem in self.memories:
            doc_text = f"{mem.get('title', '')} {mem.get('service', '')} {mem.get('summary', '')} {' '.join(mem.get('symptoms', []))} {' '.join(mem.get('tags', []))} {mem.get('root_cause', '')} {mem.get('resolution', '')}"
            corpus.append(doc_text)

        corpus.append(query)
        tfidf_matrix = self.vectorizer.fit_transform(corpus)

        query_vec = tfidf_matrix[-1]
        memory_vecs = tfidf_matrix[:-1]

        sim_scores = cosine_similarity(query_vec, memory_vecs)[0]

        results = []
        for idx, score in enumerate(sim_scores):
            if score >= MemoryConfig.SIMILARITY_THRESHOLD:
                mem_copy = dict(self.memories[idx])
                mem_copy["match_score"] = round(float(score) * 100, 1)
                results.append(mem_copy)

        results = sorted(results, key=lambda x: x["match_score"], reverse=True)
        return results[:top_k]

    def get_all_memories(self) -> List[Dict[str, Any]]:
        return self.memories
