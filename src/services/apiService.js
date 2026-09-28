/**
 * AetherOps AI - Frontend API Service Layer
 * Connects the UI to the Python Flask backend on http://127.0.0.1:5000
 * Includes seamless fallback to local mock store if backend is not reachable.
 */

const API_BASE = "http://127.0.0.1:5000/api";

export class ApiService {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[ApiService] Backend fetch failed for ${endpoint}:`, err.message);
      return null;
    }
  }

  // 1. Azure Monitoring
  static async getAzureStatus() {
    const data = await this.request('/azure/status');
    if (data) return data;
    return {
      mode: "Demo Mode",
      provider: "AetherOps Enterprise Telemetry Emulator",
      notice: "Azure credentials not configured in environment. Operating in safe Demo Mode.",
      last_sync: "08:45 AM",
      logs_retrieved: 24892,
      errors_detected: 147,
      services_detected: 12,
      active_incidents: 6,
      authenticated: false
    };
  }

  static async getAzureMetrics(service = "payment-api") {
    const data = await this.request(`/azure/metrics?service=${encodeURIComponent(service)}`);
    if (data) return data;
    return {
      service,
      error_rate_pct: 8.7,
      error_rate_baseline: 0.4,
      http_503_count: 47,
      http_5xx_rate: "10.4 req/s",
      p99_latency_ms: 2800,
      baseline_latency_ms: 210,
      cpu_utilization_pct: 74.2,
      memory_utilization_pct: 82.5,
      db_connection_pool_used_pct: 96.0,
      db_connection_ceiling: 50,
      active_connections: 48
    };
  }

  // 2. Incident Detection Engine
  static async triggerIncidentDetection(payload = {}) {
    const data = await this.request('/incidents/detect', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) return data;
    return {
      evaluation: {
        abnormal_detected: true,
        anomalies: [
          { metric: "Error Rate", value: "8.7%", threshold: "5.0%", severity: "Critical" },
          { metric: "HTTP 503 Failures", value: "47 reqs/5min", threshold: "10", severity: "Critical" },
          { metric: "Database Pool Saturation", value: "96%", threshold: "90%", severity: "Critical" }
        ]
      },
      incident: {
        status: "success",
        incident_id: "INC-0284",
        title: "Payment API Database Connection Exhaustion",
        service: "Payment API",
        severity: "Critical",
        detected_at: "Today 08:34:00",
        http_503_count: 47,
        error_rate: "8.7%",
        historical_match: "INC-0192",
        similarity_score: 94,
        ai_investigation_state: "Running"
      }
    };
  }

  // 3. What Changed? Analysis
  static async getWhatChanged(incidentId = "INC-0284") {
    const data = await this.request(`/incidents/${incidentId}/what-changed`);
    if (data) return data;
    return {
      incident_id: incidentId,
      summary: "State differential comparison for 30 minutes prior to incident detection.",
      metrics_comparison: [
        { parameter: "Application Deployment", before: "v2.4.0", after: "v2.4.1", category: "Deployment", badge: "Observed Change", badge_type: "observed" },
        { parameter: "Database Connection Pool", before: "100 max", after: "50 max", category: "Configuration", badge: "Observed Change", badge_type: "observed" },
        { parameter: "Error Rate", before: "0.4%", after: "8.7%", category: "Telemetry", badge: "Observed Change", badge_type: "observed" },
        { parameter: "p99 Latency", before: "210 ms", after: "2.8 sec", category: "Telemetry", badge: "Observed Change", badge_type: "observed" },
        { parameter: "Database Connections Utilized", before: "63% (31/50)", after: "96% (48/50)", category: "Telemetry", badge: "Observed Change", badge_type: "observed" }
      ],
      timeline: [
        { time: "08:10", event: "Deployment started (Payment API v2.4.1)", classification: "Observed Change", type: "deployment" },
        { time: "08:18", event: "Configuration changed (PgBouncer max_connections: 100 -> 50)", classification: "Observed Change", type: "config" },
        { time: "08:25", event: "Database connections increased sharply", classification: "AI Observation", type: "metric" },
        { time: "08:31", event: "Error rate increased (HTTP 503 errors recorded)", classification: "AI Observation", type: "error" },
        { time: "08:34", event: "Incident INC-0284 detected by Autonomous Engine", classification: "AI Correlation", type: "alert" },
        { time: "08:36", event: "AI root-cause investigation started across traces", classification: "AI Correlation", type: "ai" }
      ],
      correlation_disclaimer: "AI Notice: Deployment occurred 18 minutes prior to incident detection. Correlation indicates temporal proximity; causation is substantiated by connection pool ceiling saturation telemetry."
    };
  }

  // 4. Incident Replay
  static async getIncidentReplay(incidentId = "INC-0284") {
    const data = await this.request(`/incidents/${incidentId}/replay`);
    if (data) return data;
    return {
      incident_id: incidentId,
      total_steps: 11,
      steps: [
        { id: 1, time_str: "10:05", phase: "Baseline Normal", title: "System Normal", description: "Payment API operating at 0.4% error rate and 210ms latency.", metric_snapshot: "Error: 0.4% | Latency: 210ms", state: "Normal" },
        { id: 2, time_str: "10:12", phase: "Deployment", title: "Deployment v2.4.1 Initiated", description: "Alex Mercer triggered automated canary rollout for Payment API v2.4.1.", metric_snapshot: "Build #1049 | Commit c8f102a", state: "Deployment" },
        { id: 3, time_str: "10:15", phase: "Config Drift", title: "Database Connections Increase", description: "PgBouncer connection utilization climbed sharply from 63% to 88%.", metric_snapshot: "Active Connections: 44/50", state: "Warning" },
        { id: 4, time_str: "10:17", phase: "Symptom Spike", title: "HTTP 503 Errors Start", description: "Ingress gateway recorded 47 HTTP 503 Service Unavailable responses.", metric_snapshot: "HTTP 503: 47 req/s", state: "Degraded" },
        { id: 5, time_str: "10:20", phase: "Detection", title: "Incident INC-0284 Detected", description: "Automatic Incident Detection Engine triggered Sev-1 Critical alert.", metric_snapshot: "Error Rate: 8.7% > 5.0% threshold", state: "Critical" },
        { id: 6, time_str: "10:23", phase: "AI Analysis", title: "AI Investigation Started", description: "Autonomous Copilot began multi-stage telemetry reasoning across traces.", metric_snapshot: "Stages: 8 active pipelines", state: "Investigating" },
        { id: 7, time_str: "10:25", phase: "Memory Search", title: "Historical Incident Found", description: "Incident Memory located INC-0192 with 94% DNA similarity score.", metric_snapshot: "Match: INC-0192 (Database Exhaustion)", state: "Investigating" },
        { id: 8, time_str: "10:28", phase: "Hypothesis", title: "Root-Cause Hypothesis Generated", description: "AI synthesized hypothesis: Connection pool ceiling constrained to 50.", metric_snapshot: "Confidence: 87%", state: "Hypothesis" },
        { id: 9, time_str: "10:35", phase: "Human Verification", title: "Engineer Verifies Solution", description: "SRE Lead Alex Chen inspected runbook and approved PgBouncer scaling.", metric_snapshot: "Runbook: RB-SCALE-POOL", state: "Remediating" },
        { id: 10, time_str: "10:40", phase: "Resolution", title: "Incident Resolved", description: "Database connection pool restored to 200. Error rate normalized to 0.1%.", metric_snapshot: "Error Rate: 0.1% | Latency: 195ms", state: "Resolved" },
        { id: 11, time_str: "10:41", phase: "Knowledge Update", title: "Knowledge Saved to Incident Memory", description: "Incident DNA and prevention guardrails indexed into organizational memory.", metric_snapshot: "Knowledge Base ID: KB-0284-PG", state: "Closed" }
      ],
      learned_summary: {
        title: "WHAT AETHEROPS LEARNED",
        root_cause: "PgBouncer max_connections pool was constrained to 50 during v2.4.1 canary rollout, leading to worker thread starvation during concurrency surges.",
        solution: "Scaled PgBouncer pool capacity to 200 connections and added connection lifecycle multiplexing.",
        prevention: "Enforced CI/CD deployment validation rules that reject Helm configurations where database pool size is less than p99 concurrent checkout workers.",
        related_incidents: ["INC-0192 (94% Match)", "INC-0174 (81% Match)"],
        knowledge_base_ref: "KB-0284-PG-EXHAUSTION"
      }
    };
  }

  // 5. Incident DNA
  static async getIncidentDna(incidentId = "INC-0284") {
    const data = await this.request(`/incidents/${incidentId}/dna`);
    if (data) return data.incident_dna;
    return {
      incident_id: incidentId,
      service: "Payment API",
      environment: "Production",
      severity: "Critical",
      error_type: "Connection Timeout",
      http_status: "HTTP 503",
      dependency: "PostgreSQL Database Pool",
      root_cause_category: "Database Connection Exhaustion",
      deployment_status: "Recent Deployment (v2.4.1)",
      symptoms: "High Latency, Database Timeout, 503 Errors, Connection Pool Saturation 96%",
      affected_users_impact: "Checkout Pipeline / Payment Gateway",
      time_pattern: "Post-deployment peak",
      tags: ["database", "payment", "production", "pgbouncer"]
    };
  }

  static async compareIncidentDna(incidentA = "INC-0284", incidentB = "INC-0192") {
    const data = await this.request(`/incidents/${incidentA}/dna/compare/${incidentB}`);
    if (data) return data;
    return {
      incident_a: incidentA,
      incident_b: incidentB,
      similarity_percentage: 94,
      similarity_note: "Application-generated comparison based on multi-dimensional telemetry vector distance.",
      comparison_vectors: [
        { attribute: "Service", val_a: "Payment API", val_b: "Payment API", match: true, status: "Match" },
        { attribute: "Environment", val_a: "Production", val_b: "Production", match: true, status: "Match" },
        { attribute: "Severity", val_a: "Critical", val_b: "Critical", match: true, status: "Match" },
        { attribute: "Error Type", val_a: "Connection Timeout", val_b: "Connection Timeout", match: true, status: "Match" },
        { attribute: "HTTP Status", val_a: "HTTP 503", val_b: "HTTP 503", match: true, status: "Match" },
        { attribute: "Dependency", val_a: "PostgreSQL Database Pool", val_b: "PostgreSQL Database Pool", match: true, status: "Match" },
        { attribute: "Root Cause Category", val_a: "Database Connection Exhaustion", val_b: "Database Connection Exhaustion", match: true, status: "Match" },
        { attribute: "Deployment Status", val_a: "Recent Deployment (v2.4.1)", val_b: "Configuration Adjustment", match: false, status: "Partial Match" },
        { attribute: "Symptoms", val_a: "High Latency, Timeout, Pool Saturation", val_b: "High Latency, Timeout, Pool Saturation", match: true, status: "Match" },
        { attribute: "Impact", val_a: "Checkout Pipeline", val_b: "Checkout Pipeline", match: true, status: "Match" }
      ]
    };
  }

  // 6. Knowledge Gaps
  static async getKnowledgeGaps() {
    const data = await this.request('/knowledge-gaps');
    if (data) return data;
    return {
      summary: {
        month: "September 2026",
        knowledge_gaps_detected: 14,
        knowledge_reused_count: 37,
        new_knowledge_created_count: 14,
        historical_solutions_reused: 37,
        organizational_learning_velocity: "+28% MoM"
      },
      active_gaps: [
        {
          gap_id: "GAP-014",
          incident_id: "INC-0291",
          service: "Auth Token Ingress",
          symptoms: "OAuth2 PKCE Token validation failure during cross-region key rotation",
          investigation_status: "Open",
          identified_at: "Today 07:15:00"
        }
      ],
      novel_incident_example: {
        gap_id: "GAP-014",
        incident_id: "INC-0291",
        service: "Auth Token Ingress",
        notice_header: "KNOWLEDGE GAP DETECTED",
        notice_body: "No similar historical solution was found. This incident appears to contain new operational knowledge.",
        symptoms: "OAuth2 PKCE Token validation failure during cross-region key rotation",
        investigation_status: "Investigation Record Open",
        action_label: "Create Investigation Record"
      }
    };
  }

  static async recordKnowledgeGap(gapId, payload) {
    const data = await this.request(`/knowledge-gaps/${gapId}/record`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) return data;
    return {
      status: "success",
      message: "NEW KNOWLEDGE CREATED. Successfully saved into Incident Memory.",
      knowledge_id: `KB-${payload.incident_id || 'INC-0291'}-NOVEL`
    };
  }

  // 7. Human-in-the-loop Approval
  static async approveRunbook(runbookId, payload = {}) {
    const data = await this.request(`/runbooks/${runbookId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) return data;
    return {
      status: "success",
      action: "Scaled PgBouncer Connection Pool to 200 & Recycled Pods",
      approved_by: payload.approver || "Alex Chen (Principal SRE)",
      executed_at: new Date().toISOString(),
      result: "Execution completed. 3 PgBouncer pods restarted with pool_size=200. Error rate dropping to 0.1%."
    };
  }

  // 8. Resolve Incident
  static async resolveIncident(incidentId, payload) {
    const data = await this.request(`/incidents/${incidentId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) return data;
    return {
      status: "success",
      message: `Knowledge saved successfully for ${incidentId}.`,
      knowledge_id: `KB-${incidentId}`,
      reused_in_future: true
    };
  }

  // 9. Dashboard Stats
  static async getDashboardStats() {
    const data = await this.request('/dashboard/stats');
    if (data) return data;
    return {
      active_incidents: 6,
      critical_incidents: 2,
      total_errors_24h: 147,
      services_at_risk: 2,
      recurring_incidents_rate: "12 incidents",
      avg_resolution_time_min: 32,
      ai_assisted_investigations: 84,
      knowledge_reuse_rate: "72.5%",
      azure_connection: {
        mode: "Demo Mode",
        last_sync: "08:45 AM",
        logs_retrieved: 24892,
        errors_detected: 147,
        services_detected: 12,
        active_incidents: 6
      }
    };
  }
}
