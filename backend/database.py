"""
AetherOps AI - Relational Database Layer (SQLite)
Manages all schema definitions, seed data, and query interfaces for:
- Incidents & Events
- Incident Evidence & DNA
- What Changed & Deployments
- Knowledge Gaps & Incident Memory
- Runbooks & Human Approval
- Observability & Audit Logs
"""

import sqlite3
import json
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "aetherops.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Services
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS services (
        service_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'Healthy',
        environment TEXT DEFAULT 'Production',
        error_rate REAL DEFAULT 0.0,
        latency_ms INTEGER DEFAULT 200,
        request_rate INTEGER DEFAULT 1200,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Service Dependencies
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS service_dependencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_service_id TEXT,
        target_service_id TEXT,
        dependency_type TEXT,
        health_status TEXT DEFAULT 'Healthy',
        FOREIGN KEY (source_service_id) REFERENCES services (service_id)
    )
    """)

    # 3. Incidents
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        incident_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        service TEXT NOT NULL,
        environment TEXT NOT NULL DEFAULT 'Production',
        severity TEXT NOT NULL DEFAULT 'Critical',
        status TEXT NOT NULL DEFAULT 'Investigating',
        detected_at TEXT NOT NULL,
        resolved_at TEXT,
        error_rate REAL DEFAULT 0.0,
        affected_users INTEGER DEFAULT 0,
        symptoms TEXT,
        evidence TEXT,
        root_cause TEXT,
        solution TEXT,
        prevention TEXT,
        related_incidents TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 4. Incident DNA
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_dna (
        incident_id TEXT PRIMARY KEY,
        service TEXT NOT NULL,
        environment TEXT NOT NULL,
        severity TEXT NOT NULL,
        error_type TEXT NOT NULL,
        http_status TEXT NOT NULL,
        dependency TEXT NOT NULL,
        root_cause_category TEXT NOT NULL,
        deployment_status TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        affected_users_impact TEXT NOT NULL,
        time_pattern TEXT,
        tags TEXT,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 5. Incident Evidence
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT NOT NULL,
        evidence_source TEXT NOT NULL,
        evidence_type TEXT NOT NULL,
        evidence_content TEXT NOT NULL,
        confidence_score REAL DEFAULT 0.85,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 6. Incident Events (Live Event Stream)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        stage_name TEXT NOT NULL,
        status TEXT NOT NULL,
        message TEXT NOT NULL,
        details TEXT,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 7. Incident Timeline (Replay & Reconstruction)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_timeline (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT NOT NULL,
        time_str TEXT NOT NULL,
        step_number INTEGER NOT NULL,
        phase TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        metric_snapshot TEXT,
        evidence_tag TEXT,
        state TEXT NOT NULL,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 8. Incident Matches (Historical Similarity)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT NOT NULL,
        matched_incident_id TEXT NOT NULL,
        similarity_score INTEGER NOT NULL,
        match_reasons TEXT NOT NULL,
        solution_reused BOOLEAN DEFAULT 0,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 9. Incident Resolutions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incident_resolutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT NOT NULL,
        resolved_by TEXT NOT NULL,
        root_cause TEXT NOT NULL,
        solution TEXT NOT NULL,
        prevention TEXT NOT NULL,
        resolution_time_minutes INTEGER NOT NULL,
        knowledge_saved BOOLEAN DEFAULT 1,
        resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 10. Deployments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deployments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id TEXT NOT NULL,
        version_before TEXT NOT NULL,
        version_after TEXT NOT NULL,
        deployed_by TEXT NOT NULL,
        deployed_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Success',
        commit_hash TEXT,
        changelog TEXT
    )
    """)

    # 11. Configuration Changes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS config_changes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id TEXT NOT NULL,
        parameter_name TEXT NOT NULL,
        value_before TEXT NOT NULL,
        value_after TEXT NOT NULL,
        changed_by TEXT NOT NULL,
        changed_at TEXT NOT NULL,
        impact_level TEXT DEFAULT 'High'
    )
    """)

    # 12. Telemetry (Metrics & Logs)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        unit TEXT,
        anomaly_detected BOOLEAN DEFAULT 0
    )
    """)

    # 13. Runbooks & Human Approval
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS runbooks (
        runbook_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        service TEXT NOT NULL,
        target_issue TEXT NOT NULL,
        action_name TEXT NOT NULL,
        reason TEXT NOT NULL,
        risk_level TEXT DEFAULT 'High',
        requires_approval BOOLEAN DEFAULT 1,
        steps TEXT NOT NULL,
        last_executed TEXT
    )
    """)

    # 14. Knowledge Gaps
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_gaps (
        gap_id TEXT PRIMARY KEY,
        incident_id TEXT NOT NULL,
        service TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        investigation_status TEXT DEFAULT 'Open',
        identified_at TEXT NOT NULL,
        resolved_at TEXT,
        created_knowledge_id TEXT,
        FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
    )
    """)

    # 15. Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT
    )
    """)

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM incidents")
    if cursor.fetchone()[0] > 0:
        return

    # Seed Services
    services_data = [
        ("payment-api", "Payment API", "Core Transaction", "Degraded", "Production", 8.7, 2800, 3400),
        ("database-cluster", "PostgreSQL Primary Pool", "Storage & DB", "Critical", "Production", 14.2, 3400, 1900),
        ("auth-service", "Authentication Service", "Identity", "Healthy", "Production", 0.02, 45, 5100),
        ("order-service", "Order Processor Service", "Commerce", "Healthy", "Production", 0.1, 110, 2200),
        ("ingress-gateway", "Azure Application Gateway", "Networking", "Healthy", "Production", 0.05, 30, 8900),
        ("redis-cache", "Redis Session Cluster", "Caching", "Healthy", "Production", 0.0, 4, 6200)
    ]
    cursor.executemany("""
    INSERT INTO services (service_id, name, category, status, environment, error_rate, latency_ms, request_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, services_data)

    # Seed Deployments
    cursor.execute("""
    INSERT INTO deployments (service_id, version_before, version_after, deployed_by, deployed_at, status, commit_hash, changelog)
    VALUES ('payment-api', 'v2.4.0', 'v2.4.1', 'alex.mercer@contoso.com', 'Today 08:12:00', 'Success', 'c8f102a', 'Optimized connection lifecycle and query multiplexing')
    """)

    # Seed Config Changes
    cursor.execute("""
    INSERT INTO config_changes (service_id, parameter_name, value_before, value_after, changed_by, changed_at, impact_level)
    VALUES ('database-cluster', 'max_connections_pool', '100', '50', 'ci-deploy-pipeline', 'Today 08:18:22', 'Critical')
    """)

    # Seed Incidents
    # INC-0284 (Current Live Incident for Microsoft Hackathon Demo)
    cursor.execute("""
    INSERT INTO incidents (
        incident_id, title, service, environment, severity, status, detected_at,
        error_rate, affected_users, symptoms, evidence, root_cause, solution, prevention, related_incidents
    ) VALUES (
        'INC-0284',
        'Payment API Database Connection Exhaustion',
        'Payment API',
        'Production',
        'Critical',
        'Investigating',
        'Today 08:34:00',
        8.7,
        1420,
        'HTTP 503 spike, PgBouncer pool saturation at 96%, Latency spiked from 210ms to 2.8s',
        'Telemetry stream shows 47 HTTP 503 errors within 5 minutes following v2.4.1 deployment and PgBouncer pool downsizing to 50.',
        'Possible Root Cause: Connection pool exhaustion triggered by pool size constraint change during high checkout concurrency.',
        'Recommended Solution: Scale PgBouncer connection ceiling from 50 to 200 connections and restart pooler pods.',
        'Prevention: Enforce automated deployment guardrails preventing connection pool reduction below p99 active thread count.',
        'INC-0192, INC-0174'
    )
    """)

    # INC-0192 (Historical Incident - 94% match)
    cursor.execute("""
    INSERT INTO incidents (
        incident_id, title, service, environment, severity, status, detected_at, resolved_at,
        error_rate, affected_users, symptoms, evidence, root_cause, solution, prevention, related_incidents
    ) VALUES (
        'INC-0192',
        'Database Connection Pool Depletion during Flash Sale',
        'Payment API',
        'Production',
        'Critical',
        'Resolved',
        '2026-08-14 14:10:00',
        '2026-08-14 14:42:00',
        11.4,
        2840,
        'HTTP 503 on checkout, Database timeout, Connection pool saturation at 100%',
        'Database active sessions hit 100 max limit. Connection acquisition timeout exceeded 5000ms threshold.',
        'Connection pool exhaustion due to aggressive unpooled connection acquisition in checkout handler.',
        'Scaled PgBouncer pool capacity to 250 connections and applied connection multiplexing.',
        'Implemented circuit breaker on database connections with exponential backoff.',
        'INC-0174'
    )
    """)

    # INC-0174 (Historical Incident - 81% match)
    cursor.execute("""
    INSERT INTO incidents (
        incident_id, title, service, environment, severity, status, detected_at, resolved_at,
        error_rate, affected_users, symptoms, evidence, root_cause, solution, prevention, related_incidents
    ) VALUES (
        'INC-0174',
        'PostgreSQL Query Lock & Thread Starvation',
        'Database Primary',
        'Production',
        'High',
        'Resolved',
        '2026-07-28 09:20:00',
        '2026-07-28 09:58:00',
        6.2,
        890,
        'High latency > 3.2s, thread starvation, lock escalation on transactions table',
        'Slow query lock on transaction indexing prevented connection recycling.',
        'Unindexed foreign key scan blocked incoming connection workers.',
        'Added concurrent B-Tree index on transaction_id and killed hanging session locks.',
        'Automated schema migration checks for missing foreign key indices in CI/CD.',
        'INC-0192'
    )
    """)

    # Seed Incident DNA
    cursor.execute("""
    INSERT INTO incident_dna (
        incident_id, service, environment, severity, error_type, http_status,
        dependency, root_cause_category, deployment_status, symptoms, affected_users_impact, time_pattern, tags
    ) VALUES (
        'INC-0284',
        'Payment API',
        'Production',
        'Critical',
        'Connection Timeout',
        'HTTP 503',
        'PostgreSQL Database Pool',
        'Database Connection Exhaustion',
        'Recent Deployment (v2.4.1)',
        'High Latency, Database Timeout, 503 Errors, Connection Pool Saturation 96%',
        'Checkout Pipeline / Payment Gateway',
        'Post-deployment peak',
        'database, payment, production, pgbouncer'
    )
    """)

    cursor.execute("""
    INSERT INTO incident_dna (
        incident_id, service, environment, severity, error_type, http_status,
        dependency, root_cause_category, deployment_status, symptoms, affected_users_impact, time_pattern, tags
    ) VALUES (
        'INC-0192',
        'Payment API',
        'Production',
        'Critical',
        'Connection Timeout',
        'HTTP 503',
        'PostgreSQL Database Pool',
        'Database Connection Exhaustion',
        'Configuration Adjustment',
        'High Latency, Database Timeout, 503 Errors, Connection Pool Saturation 100%',
        'Checkout Pipeline / Payment Gateway',
        'Traffic Surge',
        'database, payment, production, historical-match'
    )
    """)

    # Seed Incident Matches
    cursor.execute("""
    INSERT INTO incident_matches (incident_id, matched_incident_id, similarity_score, match_reasons, solution_reused)
    VALUES ('INC-0284', 'INC-0192', 94, 'Identical Service (Payment API), Same HTTP 503 Pattern, Database dependency saturation match, Similar connection exhaustion symptoms', 1)
    """)

    cursor.execute("""
    INSERT INTO incident_matches (incident_id, matched_incident_id, similarity_score, match_reasons, solution_reused)
    VALUES ('INC-0284', 'INC-0174', 81, 'Shared Database dependency, elevated p99 latency profile, matching timeout exception logs', 0)
    """)

    # Seed Incident Timeline (Replay sequence)
    timeline_steps = [
        ('INC-0284', '10:05', 1, 'Baseline Normal', 'System Normal', 'Payment API operating at 0.4% error rate and 210ms latency.', 'Error: 0.4% | Latency: 210ms', 'telemetry-nominal', 'Normal'),
        ('INC-0284', '10:12', 2, 'Deployment', 'Deployment v2.4.1 Initiated', 'Alex Mercer triggered automated canary rollout for Payment API v2.4.1.', 'Build #1049 | Commit c8f102a', 'deployment-change', 'Deployment'),
        ('INC-0284', '10:15', 3, 'Config Drift', 'Database Connections Increase', 'PgBouncer connection utilization climbed sharply from 63% to 88%.', 'Active Connections: 44/50', 'config-drift', 'Warning'),
        ('INC-0284', '10:17', 4, 'Symptom Spike', 'HTTP 503 Errors Start', 'Ingress gateway recorded 47 HTTP 503 Service Unavailable responses.', 'HTTP 503: 47 req/s', 'error-spike', 'Degraded'),
        ('INC-0284', '10:20', 5, 'Detection', 'Incident INC-0284 Detected', 'Automatic Incident Detection Engine triggered Sev-1 Critical alert.', 'Error Rate: 8.7% > 5.0% threshold', 'alert-triggered', 'Critical'),
        ('INC-0284', '10:23', 6, 'AI Analysis', 'AI Investigation Started', 'Autonomous Copilot began multi-stage telemetry reasoning across traces.', 'Stages: 8 active pipelines', 'ai-reasoning', 'Investigating'),
        ('INC-0284', '10:25', 7, 'Memory Search', 'Historical Incident Found', 'Incident Memory located INC-0192 with 94% DNA similarity score.', 'Match: INC-0192 (Database Exhaustion)', 'pattern-matched', 'Investigating'),
        ('INC-0284', '10:28', 8, 'Hypothesis', 'Root-Cause Hypothesis Generated', 'AI synthesized hypothesis: Connection pool ceiling constrained to 50.', 'Confidence: 87%', 'hypothesis-ready', 'Hypothesis'),
        ('INC-0284', '10:35', 9, 'Human Verification', 'Engineer Verifies Solution', 'SRE Lead Alex Chen inspected runbook and approved PgBouncer scaling.', 'Runbook: RB-SCALE-POOL', 'human-approval', 'Remediating'),
        ('INC-0284', '10:40', 10, 'Resolution', 'Incident Resolved', 'Database connection pool restored to 200. Error rate normalized to 0.1%.', 'Error Rate: 0.1% | Latency: 195ms', 'resolved-nominal', 'Resolved'),
        ('INC-0284', '10:41', 11, 'Knowledge Update', 'Knowledge Saved to Incident Memory', 'Incident DNA and prevention guardrails indexed into organizational memory.', 'Knowledge Base ID: KB-0284-PG', 'knowledge-saved', 'Closed')
    ]
    cursor.executemany("""
    INSERT INTO incident_timeline (incident_id, time_str, step_number, phase, title, description, metric_snapshot, evidence_tag, state)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, timeline_steps)

    # Seed Runbooks
    cursor.execute("""
    INSERT INTO runbooks (
        runbook_id, title, service, target_issue, action_name, reason, risk_level, requires_approval, steps, last_executed
    ) VALUES (
        'RB-SCALE-POOL',
        'Scale PgBouncer Connection Pool Ceiling',
        'Payment API',
        'Database connection saturation > 90%',
        'Scale PgBouncer Pool to 200 & Recycle Pods',
        'Service is returning repeated 503 errors. 47 failures in 5 minutes.',
        'Medium',
        1,
        '1. Verify database node CPU < 70% | 2. Patch PgBouncer configmap pool_size=200 | 3. Rolling restart of pgbouncer pods | 4. Validate connection latency < 100ms',
        'Today 08:38:00'
    )
    """)

    # Seed Knowledge Gaps
    cursor.execute("""
    INSERT INTO knowledge_gaps (gap_id, incident_id, service, symptoms, investigation_status, identified_at, created_knowledge_id)
    VALUES (
        'GAP-014',
        'INC-0291',
        'Auth Token Ingress',
        'OAuth2 PKCE Token validation failure during cross-region key rotation',
        'Open',
        'Today 07:15:00',
        NULL
    )
    """)

    # Seed Audit Logs
    cursor.execute("""
    INSERT INTO audit_logs (timestamp, actor, action, resource, status, details)
    VALUES ('Today 08:41:00', 'alex.chen@contoso.com', 'RUNBOOK_APPROVAL', 'runbook/RB-SCALE-POOL', 'Approved', 'Human-in-the-loop approved PgBouncer pool scaling for INC-0284')
    """)
    cursor.execute("""
    INSERT INTO audit_logs (timestamp, actor, action, resource, status, details)
    VALUES ('Today 08:34:10', 'aetherops-detector-engine', 'INCIDENT_DETECTED', 'incident/INC-0284', 'Triggered', 'Automatic anomaly detection: Error Rate 8.7% > 5.0% threshold')
    """)

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("AetherOps Database Initialized and Seeded Successfully.")
