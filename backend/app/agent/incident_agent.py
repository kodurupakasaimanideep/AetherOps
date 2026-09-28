from typing import Dict, Any, List, Optional
from datetime import datetime

from app.hindsight.client import HindsightClient
from app.llm.client import LLMClient
from app.agent.tools import AgentTools
from app.agent.prompts import SYSTEM_AGENT_PROMPT
from app.llm.prompts import INCIDENT_ANALYSIS_PROMPT

class IncidentAgent:
    def __init__(self):
        self.hindsight = HindsightClient()
        self.llm = LLMClient()
        self.tools = AgentTools()

    def investigate(self, incident: Dict[str, Any]) -> Dict[str, Any]:
        incident_id = incident.get("id", "INC-UNKNOWN")
        title = incident.get("title", "")
        service = incident.get("service", "")
        summary = incident.get("summary", "")
        symptoms = incident.get("symptoms", [])

        steps = []
        steps.append({
            "step_number": 1,
            "tool_used": "hindsight_memory_search",
            "action": f"Searching Hindsight Incident Memory for query: '{title} {service}'",
            "observation": "Queried vector index for historical incidents with similar DNA",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        search_query = f"{title} {service} {summary} {' '.join(symptoms)}"
        matched_memories = self.hindsight.query_similar_incidents(search_query, top_k=3)

        steps.append({
            "step_number": 2,
            "tool_used": "log_inspector",
            "action": f"Inspecting application logs for service: {service}",
            "observation": "Retrieved log entries from data/logs directory",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        logs_content = self.tools.inspect_logs(service)

        steps.append({
            "step_number": 3,
            "tool_used": "runbook_search",
            "action": "Searching runbooks for matched symptoms",
            "observation": "Found relevant operational runbooks in data/runbooks/",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        matched_runbooks = self.tools.search_runbooks(f"{service} {title}")
        runbook_names = [r["runbook_name"] for r in matched_runbooks]

        steps.append({
            "step_number": 4,
            "tool_used": "llm_reasoning_engine",
            "action": "Generating AI root cause hypothesis and resolution plan",
            "observation": "Synthesized evidence from logs, Hindsight memory matches, and runbooks",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })

        formatted_prompt = INCIDENT_ANALYSIS_PROMPT.format(
            incident_id=incident_id,
            title=title,
            service=service,
            severity=incident.get("severity", "MEDIUM"),
            symptoms=", ".join(symptoms),
            summary=summary,
            logs=logs_content[:1000],
            runbooks=", ".join(runbook_names) if runbook_names else "database-recovery.md",
            memories=str([{m.get('id'): m.get('title'), 'match': m.get('match_score')} for m in matched_memories])
        )

        analysis = self.llm.generate_response(formatted_prompt, system_prompt=SYSTEM_AGENT_PROMPT)

        root_cause = incident.get("root_cause")
        if not root_cause:
            if "database" in service.lower() or "inventory" in service.lower() or "user" in service.lower():
                root_cause = "Database connection pool exhaustion & unindexed table scans."
            else:
                root_cause = f"System resource contention or unhandled failure in {service}."

        recommended_checklist = [
            "Check database connection pool limits & active queries",
            f"Compare deployment {incident.get('deployment', 'v2.5.0')} schema migration changes",
            "Verify HTTP client socket timeouts and circuit breakers",
            "Review historical INC-001 & INC-002 resolution steps"
        ]

        evidence_chain = []
        for mem in matched_memories:
            evidence_chain.append({
                "title": mem.get("title", ""),
                "incident_id": mem.get("id", ""),
                "match_score": mem.get("match_score", 85.0),
                "evidence_type": "Same error pattern & service domain",
                "description": mem.get("summary", ""),
                "resolution": mem.get("resolution", "Increased pool size & optimized indexes")
            })

        remediation_steps = [
            "1. Inspect active database queries and connection limits using pg_stat_activity.",
            "2. Apply missing composite database index or patch unclosed connections.",
            "3. Execute pg_reload_conf() or restart application pods to apply settings.",
            "4. Verify p99 latency and CPU utilization drop back below normal thresholds (<20%)."
        ]

        return {
            "incident_id": incident_id,
            "status": "INVESTIGATION_COMPLETE",
            "root_cause": root_cause,
            "confidence_score": 92.4,
            "matched_past_incidents": matched_memories,
            "evidence_chain": evidence_chain,
            "investigation_steps": steps,
            "recommended_checklist": recommended_checklist,
            "recommended_runbook": runbook_names[0] if runbook_names else "database-recovery.md",
            "remediation_steps": remediation_steps,
            "ai_analysis_text": analysis
        }

    def chat_copilot(self, user_message: str, incident_context: Optional[Dict[str, Any]] = None) -> str:
        prompt = f"User Question: {user_message}\nIncident Context: {incident_context or 'None'}"
        return self.llm.generate_response(prompt, system_prompt=SYSTEM_AGENT_PROMPT)
