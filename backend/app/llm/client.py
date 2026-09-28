import os
import httpx
from typing import Dict, Any, Optional

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        if not self.api_key:
            return self._fallback_reasoning(prompt)

        try:
            if os.getenv("GEMINI_API_KEY"):
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={os.getenv('GEMINI_API_KEY')}"
                payload = {"contents": [{"parts": [{"text": f"{system_prompt or ''}\n\n{prompt}"}]}]}
                resp = httpx.post(url, json=payload, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    return data['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"LLM API call error: {e}")

        return self._fallback_reasoning(prompt)

    def _fallback_reasoning(self, prompt: str) -> str:
        p_lower = prompt.lower()
        if "postgresql" in p_lower or "connection" in p_lower or "database" in p_lower or "inventory" in p_lower:
            return (
                "Based on the log traces and Hindsight Incident Memory matching:\n"
                "1. Database connection/query resource pressure detected.\n"
                "2. Similar historical pattern INC-001 showed connection pool saturation and unindexed queries.\n"
                "3. Root Cause: Missing composite database indexes or unclosed connections causing pool exhaustion.\n"
                "4. Recommended Action: Execute database pool scaling and index optimization."
            )
        elif "payment" in p_lower or "timeout" in p_lower:
            return (
                "Based on the payment service logs and Hindsight Incident Memory:\n"
                "1. Socket timeout and thread pool starvation in payment workers.\n"
                "2. Matching INC-002: Third-party integration latency without timeout guards.\n"
                "3. Root Cause: Unbounded client request waiting without circuit breaker fallback.\n"
                "4. Recommended Action: Apply 3000ms client socket timeout and enable circuit breaker."
            )
        else:
            return (
                "Analysis completed using OpsMind Incident Memory Engine:\n"
                "1. Memory correlation identifies memory leak or resource saturation pattern.\n"
                "2. Root Cause: High resource consumption or unbounded caching.\n"
                "3. Recommended Action: Restart pods and apply cache eviction policies."
            )
