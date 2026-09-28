/**
 * Enterprise Telemetry & SRE Analytics Dataset
 * Provides realistic time-series metrics, knowledge reuse stats, and operational trends
 */

export const telemetryAnalyticsData = {
  timeFilters: ["1 Hour", "24 Hours", "7 Days", "30 Days", "90 Days"],
  services: [
    "All Services",
    "Payment API",
    "API Gateway",
    "Database (PostgreSQL)",
    "Auth Service",
    "Order Service",
    "Redis",
    "Notification Service"
  ],
  metricsByRange: {
    "1 Hour": {
      errorTrends: { value: "12.8%", delta: "+24% vs last hr", isNegative: true },
      requestTrends: { value: "14.2k rps", delta: "+18% surge", isNegative: false },
      latency: { value: "2.8s p99", delta: "+17% slower", isNegative: true },
      cpu: { value: "78.4%", delta: "+8% spike", isNegative: true },
      memory: { value: "84.2%", delta: "Near ceiling", isNegative: true },
      serviceHealth: { value: "7/9 Healthy", delta: "2 Degraded", isNegative: true },
      incidentFreq: { value: "2 Active", delta: "Sev-1 Ongoing", isNegative: true },
      rootCauses: { value: "Connection Pool", delta: "Top pattern", isNegative: true },
      resolutionTime: { value: "28 mins", delta: "-34% with AI", isNegative: false },
      knowledgeReuse: { value: "68%", delta: "12 matches applied", isNegative: false }
    },
    "24 Hours": {
      errorTrends: { value: "4.2%", delta: "+8.1% vs yesterday", isNegative: true },
      requestTrends: { value: "18.9M", delta: "+14.2% daily", isNegative: false },
      latency: { value: "420ms p99", delta: "+45ms drift", isNegative: true },
      cpu: { value: "62.1%", delta: "Nominal load", isNegative: false },
      memory: { value: "71.4%", delta: "Healthy headroom", isNegative: false },
      serviceHealth: { value: "8/9 Healthy", delta: "1 Critical", isNegative: true },
      incidentFreq: { value: "4 Incidents", delta: "2 Sev-1, 2 Sev-2", isNegative: true },
      rootCauses: { value: "Socket & Lock", delta: "65% of outages", isNegative: true },
      resolutionTime: { value: "24.5 mins", delta: "-42% vs avg", isNegative: false },
      knowledgeReuse: { value: "62%", delta: "28 runbooks used", isNegative: false }
    },
    "7 Days": {
      errorTrends: { value: "2.1%", delta: "-1.4% week-over-week", isNegative: false },
      requestTrends: { value: "128M reqs", delta: "+9.4% growth", isNegative: false },
      latency: { value: "180ms p99", delta: "Within SLA target", isNegative: false },
      cpu: { value: "54.8%", delta: "Autoscaled", isNegative: false },
      memory: { value: "66.2%", delta: "Stable", isNegative: false },
      serviceHealth: { value: "99.4% SLA", delta: "Met commitment", isNegative: false },
      incidentFreq: { value: "18 Incidents", delta: "-22% frequency", isNegative: false },
      rootCauses: { value: "DB & Deployments", delta: "Leading cause", isNegative: true },
      resolutionTime: { value: "21.2 mins", delta: "5.4m faster", isNegative: false },
      knowledgeReuse: { value: "71%", delta: "44 matches", isNegative: false }
    },
    "30 Days": {
      errorTrends: { value: "1.8%", delta: "-3.2% MoM", isNegative: false },
      requestTrends: { value: "540M reqs", delta: "+28% YoY", isNegative: false },
      latency: { value: "145ms p99", delta: "Optimal", isNegative: false },
      cpu: { value: "48.2%", delta: "Nominal", isNegative: false },
      memory: { value: "62.0%", delta: "Nominal", isNegative: false },
      serviceHealth: { value: "99.92% SLA", delta: "99.9% Target", isNegative: false },
      incidentFreq: { value: "84 Incidents", delta: "Total logged", isNegative: false },
      rootCauses: { value: "Connection Pools", delta: "34% of total", isNegative: true },
      resolutionTime: { value: "18.4 mins", delta: "-46% MTTR drop", isNegative: false },
      knowledgeReuse: { value: "60.7%", delta: "37 reused", isNegative: false }
    },
    "90 Days": {
      errorTrends: { value: "1.4%", delta: "-6.8% quarterly", isNegative: false },
      requestTrends: { value: "1.62B reqs", delta: "+44% growth", isNegative: false },
      latency: { value: "120ms p99", delta: "Healthy baseline", isNegative: false },
      cpu: { value: "46.1%", delta: "Multi-cluster", isNegative: false },
      memory: { value: "59.4%", delta: "Healthy", isNegative: false },
      serviceHealth: { value: "99.95% SLA", delta: "Four nines", isNegative: false },
      incidentFreq: { value: "248 Incidents", delta: "Quarterly archive", isNegative: false },
      rootCauses: { value: "Config & Pool", delta: "Top recurring", isNegative: true },
      resolutionTime: { value: "19.8 mins", delta: "-52% historical", isNegative: false },
      knowledgeReuse: { value: "58%", delta: "142 reused", isNegative: false }
    }
  },
  knowledgeReuseStats: {
    incidentsMonth: 84,
    historicalMatches: 51,
    solutionsReused: 37,
    newKnowledgeCreated: 14,
    reusabilityRate: "60.7%"
  },
  recurringProblems: [
    { title: "Database Connection Issues", count: 12, tag: "Database Pool", risk: "High" },
    { title: "Deployment Configuration", count: 9, tag: "CI/CD Rollout", risk: "Medium" },
    { title: "Authentication & Socket Leaks", count: 7, tag: "Auth / Identity", risk: "Medium" },
    { title: "CDN & Rate Limiting Purge", count: 4, tag: "Edge Network", risk: "Low" }
  ],
  operationalTrends: [
    { text: "Payment API error rate increased 24% following release v3.4.1 rollout.", type: "alert" },
    { text: "Database latency increased 17% due to active connection pool ceiling saturation.", type: "alert" },
    { text: "Auth Service P99 latency improved 12% post-Redis token cache deployment.", type: "success" },
    { text: "Ingress throughput surged 31% during peak commercial marketing campaign.", type: "info" },
    { text: "Automated AI Incident Memory reduced mean time to root cause diagnosis by 64%.", type: "success" }
  ],
  chartData: {
    errorsByHour: [
      { time: "00:00", errors: 12 }, { time: "02:00", errors: 8 }, { time: "04:00", errors: 14 },
      { time: "06:00", errors: 19 }, { time: "08:00", errors: 88 }, { time: "09:00", errors: 142 },
      { time: "10:00", errors: 96 }, { time: "12:00", errors: 42 }, { time: "14:00", errors: 28 },
      { time: "16:00", errors: 31 }, { time: "18:00", errors: 24 }, { time: "20:00", errors: 18 }
    ],
    incidentsByService: [
      { service: "Payment API", count: 28, color: "#ef4444" },
      { service: "Database", count: 22, color: "#f59e0b" },
      { service: "API Gateway", count: 16, color: "#3b82f6" },
      { service: "Order Service", count: 10, color: "#a855f7" },
      { service: "Auth Service", count: 8, color: "#10b981" }
    ],
    incidentsBySeverity: [
      { label: "Sev-1 Critical", count: 18, pct: 21, color: "#ef4444" },
      { label: "Sev-2 High", count: 32, pct: 38, color: "#f59e0b" },
      { label: "Sev-3 Medium", count: 24, pct: 29, color: "#3b82f6" },
      { label: "Sev-4 Low", count: 10, pct: 12, color: "#10b981" }
    ],
    rootCausesBreakdown: [
      { cause: "Connection Pool Exhaustion", pct: 34 },
      { cause: "Deployment Config Drift", pct: 26 },
      { cause: "Async Semaphore Deadlock", pct: 18 },
      { cause: "Memory Leak / OOM", pct: 14 },
      { cause: "Rate Limit Exceeded", pct: 8 }
    ],
    mttrTrend: [
      { week: "Wk 30", mttr: 38 },
      { week: "Wk 32", mttr: 34 },
      { week: "Wk 34", mttr: 28 },
      { week: "Wk 36", mttr: 22 },
      { week: "Wk 38", mttr: 18.4 }
    ],
    aiAssistedResolution: {
      aiAssisted: 72,
      manualOnly: 28,
      avgSpeedup: "4.2x Faster"
    }
  }
};
