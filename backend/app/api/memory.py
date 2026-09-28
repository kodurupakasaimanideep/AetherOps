from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.hindsight.client import HindsightClient

router = APIRouter(prefix="/memory", tags=["Hindsight Memory"])
hindsight = HindsightClient()

class MemorySearchRequest(BaseModel):
    query: str
    top_k: int = 3

@router.get("")
def list_memories():
    return hindsight.list_memories()

@router.post("/search")
def search_memories(req: MemorySearchRequest):
    return hindsight.query_similar_incidents(req.query, top_k=req.top_k)
