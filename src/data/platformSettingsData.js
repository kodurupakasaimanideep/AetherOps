/**
 * Enterprise Platform Settings, Integrations & Audit Logs Dataset
 * Compliant with enterprise security standards: secrets are masked / reported as Configured / Not Configured
 */

export const platformSettingsData = {
  monitoringIntegrations: [
    {
      id: "azure-monitor",
      name: "Azure Monitor",
      type: "Metric Stream & Alerts",
      status: "Connected",
      statusColor: "#10b981",
      lastSync: "32 seconds ago",
      workspace: "contoso-prod-eus-mon",
      dataSources: "AKS Cluster Alpha, Host Metrics, Container Insights"
    },
    {
      id: "app-insights",
      name: "Application Insights",
      type: "APM & Distributed Traces",
      status: "Connected",
      statusColor: "#10b981",
      lastSync: "14 seconds ago",
      workspace: "appi-contoso-production-01",
      dataSources: "OpenTelemetry eBPF, ASP.NET Core Traces, Node.js Agents"
    },
    {
      id: "log-analytics",
      name: "Log Analytics",
      type: "KQL & Structured Logs",
      status: "Connected",
      statusColor: "#10b981",
      lastSync: "1 minute ago",
      workspace: "law-security-ops-eastus2",
      dataSources: "Kubelet Audit Logs, Nginx Ingress, PostgreSQL Slow Logs"
    }
  ],
  aiConfiguration: {
    provider: "Google Vertex & Gemini 1.5",
    model: "gemini-1.5-flash (Low-latency SRE Fine-tuned)",
    temperature: 0.3,
    maxResponseTokens: 2048,
    apiKeySource: "ENV_VAR (GEMINI_API_KEY)",
    apiKeyStatus: "Configured (Environment Encrypted)"
  },
  incidentRules: {
    errorRateThreshold: "5.0%",
    http5xxThreshold: "10 req/s",
    latencyThreshold: "2,000ms p99",
    cpuThreshold: "85%",
    memoryThreshold: "90%",
    recurringThreshold: "3 occurrences in 14 days"
  },
  notifications: {
    email: {
      enabled: true,
      recipients: "sre-oncall@contoso.com, devops-lead@contoso.com",
      severityFilter: "Sev-1 & Sev-2"
    },
    teams: {
      enabled: true,
      channel: "#incident-bridge-ops",
      webhookUrl: "https://contoso.webhook.office.com/webhookb2/********"
    },
    webhook: {
      enabled: true,
      endpoint: "https://api.opsgenie.com/v1/incidents/alerts",
      authHeader: "Bearer (Configured in Vault)"
    }
  },
  securitySettings: {
    authentication: "Microsoft Entra ID (Azure AD SSO)",
    mfaEnforced: true,
    sessionTimeout: "60 minutes",
    idleLock: "15 minutes",
    immutableAuditLogs: true,
    retentionDays: "365 days"
  },
  userRoles: [
    { name: "Saimanideep", email: "saimanideep@contoso.com", role: "SRE Principal Lead", status: "Active (MFA Verified)" },
    { name: "Alex Mercer", email: "alex.mercer@contoso.com", role: "DevOps Engineer", status: "Active (MFA Verified)" },
    { name: "Sarah Chen", email: "sarah.chen@contoso.com", role: "Cloud Architect", status: "Active" },
    { name: "David Kim", email: "david.kim@contoso.com", role: "Read-Only Operator", status: "Active" }
  ],
  apiConfiguration: [
    { name: "Azure Client Secret (SPN)", envVar: "AZURE_CLIENT_SECRET", status: "Configured", lastRotated: "18 days ago" },
    { name: "Gemini AI API Key", envVar: "GEMINI_API_KEY", status: "Configured", lastRotated: "5 days ago" },
    { name: "Microsoft Teams Webhook Secret", envVar: "TEAMS_WEBHOOK_KEY", status: "Configured", lastRotated: "30 days ago" },
    { name: "Datadog Telemetry Key", envVar: "DD_API_KEY", status: "Not Configured", lastRotated: "Never" },
    { name: "Slack Escalation Secret", envVar: "SLACK_BOT_TOKEN", status: "Not Configured", lastRotated: "Never" }
  ],
  auditLogs: [
    { timestamp: "Today 10:24:12", user: "saimanideep@contoso.com", action: "DEPLOY_HOTFIX", resource: "deployment/payment-gateway-v3", status: "Success" },
    { timestamp: "Today 10:18:05", user: "alex.mercer@contoso.com", action: "SCALE_POOL", resource: "PgBouncer Connection Ceiling (500)", status: "Success" },
    { timestamp: "Today 09:54:20", user: "system-sentinel", action: "AUTO_ISOLATE", resource: "pod/payment-api-pod-8bf", status: "Audited" },
    { timestamp: "Today 09:30:11", user: "sarah.chen@contoso.com", action: "UPDATE_CONFIG", resource: "IncidentRule.LatencyThreshold", status: "Success" },
    { timestamp: "Yesterday 18:42:00", user: "david.kim@contoso.com", action: "TRIGGER_TEST", resource: "Azure Monitor Integration Probe", status: "Success" },
    { timestamp: "Yesterday 14:15:33", user: "unknown-client", action: "AUTH_ATTEMPT", resource: "API Gateway Auth Ingress", status: "Blocked (Invalid MFA)" }
  ]
};
