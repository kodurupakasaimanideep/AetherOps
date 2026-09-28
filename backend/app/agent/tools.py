import os
import glob
from typing import List, Dict, Any, Optional

class AgentTools:
    @staticmethod
    def inspect_logs(service_name: Optional[str] = None) -> str:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        logs_dir = os.path.join(base_dir, "data", "logs")
        log_files = glob.glob(os.path.join(logs_dir, "*.log"))

        combined_logs = []
        for lf in log_files:
            fname = os.path.basename(lf)
            try:
                with open(lf, 'r', encoding='utf-8') as f:
                    combined_logs.append(f"--- File: {fname} ---\n" + f.read())
            except Exception as e:
                combined_logs.append(f"Error reading {fname}: {e}")

        return "\n\n".join(combined_logs) if combined_logs else "No log files found."

    @staticmethod
    def search_runbooks(query: str) -> List[Dict[str, str]]:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        runbooks_dir = os.path.join(base_dir, "data", "runbooks")
        files = glob.glob(os.path.join(runbooks_dir, "*.md"))

        results = []
        q_words = [w.lower() for w in query.split() if len(w) > 3]
        for f in files:
            fname = os.path.basename(f)
            try:
                with open(f, 'r', encoding='utf-8') as fh:
                    content = fh.read()
                    content_lower = content.lower()
                    if any(w in content_lower for w in q_words) or any(w in fname.lower() for w in q_words) or not q_words:
                        results.append({
                            "runbook_name": fname,
                            "content": content
                        })
            except Exception as e:
                pass
        return results
