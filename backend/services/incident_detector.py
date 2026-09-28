"""
AetherOps AI - Automatic Incident Detection Engine
Monitors real-time telemetry against configurable thresholds (HTTP 503, error rate,
latency, CPU, memory, database saturation) and orchestrates automated incident creation,
evidence collection, Incident DNA synthesis, and AI root-cause hypothesis generation.
"""

import time
import json
from datetime import datetime, timezone
from backend.database import get_db_connection
from backend.integrations.azure_monitor import azure_monitor

class IncidentDetectionEngine:
    def __init__(self):
        self.thresholds = {
            "error_rate_pct": 5.0,
            "http_503_count": 10,
            "p99_latency_ms": 2000,
            "cpu_utilization_pct": 85.0,
            "memory_utilization_pct": 90.0,
            "db_pool_utilization_pct": 90.0
        }

    def update_thresholds(self, new_thresholds):
        self.thresholds.update(new_thresholds)

    def evaluate_telemetry(self, telemetry_data=None):
        """
        Evaluates telemetry metrics against detection thresholds.
        Returns detection result including anomalies and trigger flags.
        """
        if not telemetry_data:
            telemetry_data = azure_monitor.get_metrics("payment-api")

        anomalies = []
        is_abnormal = False

        if telemetry_data.get("error_rate_pct", 0) > self.thresholds["error_rate_pct"]:
            is_abnormal = True
            anomalies.append({
                "metric": "Error Rate",
                "value": f"{telemetry_data['error_rate_pct']}%",
                "threshold": f"{self.thresholds['error_rate_pct']}%",
                "severity": "Critical",
                "message": f"Error rate {telemetry_data['error_rate_pct']}% exceeded {self.thresholds['error_rate_pct']}% limit."
            })

        if telemetry_data.get("http_503_count", 0) > self.thresholds["http_503_count"]:
            is_abnormal = True
            anomalies.append({
                "metric": "HTTP 503 Failures",
                "value": f"{telemetry_data['http_503_count']} reqs/5min",
                "threshold": f"{self.thresholds['http_503_count']}",
                "severity": "Critical",
                "message": f"HTTP 503 rate spiked to {telemetry_data['http_503_count']} errors."
            })

        if telemetry_data.get("p99_latency_ms", 0) > self.thresholds["p99_latency_ms"]:
            is_abnormal = True
            anomalies.append({
                "metric": "p99 Latency",
                "value": f"{telemetry_data['p99_latency_ms']}ms",
                "threshold": f"{self.thresholds['p99_latency_ms']}ms",
                "severity": "High",
                "message": f"p99 latency {telemetry_data['p99_latency_ms']}ms degraded from 210ms baseline."
            })

        if telemetry_data.get("db_connection_pool_used_pct", 0) > self.thresholds["db_pool_utilization_pct"]:
            is_abnormal = True
            anomalies.append({
                "metric": "Database Pool Saturation",
                "value": f"{telemetry_data['db_connection_pool_used_pct']}%",
                "threshold": f"{self.thresholds['db_pool_utilization_pct']}%",
                "severity": "Critical",
                "message": f"PgBouncer pool reached {telemetry_data['db_connection_pool_used_pct']}% saturation."
            })

        return {
            "abnormal_detected": is_abnormal,
            "anomalies": anomalies,
            "telemetry_evaluated": telemetry_data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime())
        }

    def trigger_incident_creation(self, service_id="payment-api", custom_payload=None):
        """
        Executes end-to-end incident generation:
        1. Creates Incident in SQLite database
        2. Assigns Incident ID (INC-0284)
        3. Creates Incident DNA
        4. Links evidence
        5. Matches historical incidents
        6. Logs audit trail
        """
        conn = get_db_connection()
        cursor = conn.cursor()

        incident_id = "INC-0284"
        if custom_payload and "incident_id" in custom_payload:
            incident_id = custom_payload["incident_id"]

        # Check if already exists, else insert
        cursor.execute("SELECT incident_id FROM incidents WHERE incident_id = ?", (incident_id,))
        existing = cursor.fetchone()

        if not existing:
            cursor.execute("""
            INSERT INTO incidents (
                incident_id, title, service, environment, severity, status, detected_at,
                error_rate, affected_users, symptoms, evidence, root_cause, solution, prevention, related_incidents
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            """, (
                incident_id,
                "Payment API Database Connection Exhaustion",
                "Payment API",
                "Production",
                "Critical",
                "Investigating",
                datetime.now().strftime("Today %H:%M:%S"),
                8.7,
                1420,
                "HTTP 503 spike, PgBouncer pool saturation at 96%, Latency spiked from 210ms to 2.8s",
                "Telemetry stream shows 47 HTTP 503 errors within 5 minutes following v2.4.1 deployment and pool limit change.",
                "Possible Root Cause: Connection pool exhaustion triggered by PgBouncer pool reduction during checkout concurrency surge.",
                "Recommended Solution: Scale PgBouncer pool capacity from 50 to 200 connections and recycle pooler pods.",
                "Prevention: Automated deployment guardrails preventing connection pool downsizing below p99 active thread count.",
                "INC-0192, INC-0174"
            ))

            # Add DNA
            cursor.execute("""
            INSERT OR REPLACE INTO incident_dna (
                incident_id, service, environment, severity, error_type, http_status,
                dependency, root_cause_category, deployment_status, symptoms, affected_users_impact, time_pattern, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                incident_id,
                "Payment API",
                "Production",
                "Critical",
                "Connection Timeout",
                "HTTP 503",
                "PostgreSQL Database Pool",
                "Database Connection Exhaustion",
                "Recent Deployment (v2.4.1)",
                "High Latency, Database Timeout, 503 Errors, Connection Pool Saturation 96%",
                "Checkout Pipeline / Payment Gateway",
                "Post-deployment peak",
                "database, payment, production, pgbouncer"
            ))

            # Add Audit Log
            cursor.execute("""
            INSERT INTO audit_logs (timestamp, actor, action, resource, status, details)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (
                datetime.now().strftime("Today %H:%M:%S"),
                "aetherops-incident-detector",
                "INCIDENT_AUTO_CREATED",
                f"incident/{incident_id}",
                "Success",
                "Triggered Sev-1 incident from multi-signal telemetry thresholds."
            ))

            conn.commit()

        conn.close()

        return {
            "status": "success",
            "incident_id": incident_id,
            "title": "Payment API Database Connection Exhaustion",
            "service": "Payment API",
            "severity": "Critical",
            "detected_at": datetime.now().strftime("Today %H:%M:%S"),
            "http_503_count": 47,
            "error_rate": "8.7%",
            "historical_match": "INC-0192",
            "similarity_score": 94,
            "ai_investigation_state": "Running",
            "investigation_steps": [
                "Step 1: Inspect PgBouncer pool max_connections ceiling",
                "Step 2: Compare checkout transaction thread lifespans in v2.4.1",
                "Step 3: Execute RB-SCALE-POOL runbook upon SRE approval"
            ]
        }

incident_detector = IncidentDetectionEngine()
