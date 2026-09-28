/**
 * Pattern Matching & Incident DNA Multi-Signal Dataset
 * Supports 12 distinct signal dimensions:
 * 1. Error messages
 * 2. HTTP status
 * 3. Service
 * 4. Dependencies
 * 5. Root cause
 * 6. Logs
 * 7. Deployment information
 * 8. Metrics
 * 9. Environment
 * 10. Incident symptoms
 * 11. Time patterns
 * 12. Tags
 */

export const incidentDNAPatterns = [
  {
    id: "INC-9042",
    title: "Database Connection Pool Exhaustion & HTTP 503 Spike",
    service: "Payment API",
    environment: "Production",
    severity: "Critical (Sev-1)",
    impact: "Checkout & Card Processing ($142k/hr estimated drift)",
    detectedTime: "Today at 09:42 UTC",
    // 12 Signals
    signals: {
      service: "Payment API (v3.4.1)",
      errorMessage: "NpgsqlException (10055): Socket pool buffer space exhausted",
      httpStatus: "HTTP 503 Service Unavailable",
      dependency: "PostgreSQL Master Cluster & PgBouncer Proxy",
      rootCause: "Connection pool saturation due to unclosed DB handles in async handler",
      logs: "System.Net.Sockets.SocketException: Ephemeral socket ceiling reached (64,512)",
      deployment: "Release v3.4.1 deployed 18 minutes prior to anomaly trigger",
      metrics: "Active Connection Count: 98.4%, Latency p99: 4,820ms, Error Rate: 18.4%",
      environment: "Production (Azure East US 2 - AKS Cluster Alpha)",
      symptoms: "Elevated HTTP 503 rates, transaction latency spike, checkout timeouts",
      timePattern: "Post-deployment traffic surge under peak commercial hours (Monday morning)",
      tags: ["database", "payment", "production", "connection-pool", "resilience", "sev-1"]
    },
    recurringAlert: {
      detected: true,
      title: "Recurring Pattern Detected across 4 Deployments",
      path: ["Payment API", "Database Timeout", "Connection Pool Saturation", "HTTP 503 Spike"],
      frequency: "Detected 3 times in the past 6 weeks post-major async middleware releases.",
      riskLevel: "High Risk of Cascading Failure",
      recommendation: "Deploy PgBouncer transaction-mode pooler and clamp client max-pool-size to 50 connections per pod."
    },
    matches: [
      {
        id: "INC-0192",
        title: "Database Connection Failure",
        similarity: 94,
        service: "Payment API",
        severity: "Sev-1",
        resolutionTime: "32 minutes",
        date: "Sep 14, 2026",
        rootCause: "Connection pool exhaustion due to missing connection.Dispose() in async retry loop.",
        solution: "Increased PostgreSQL connection ceiling to 500 & enabled automated idle-connection pruning in EF Core.",
        prevention: "Added Roslyn analyzer rule enforcing using statement on all DbConnection allocations.",
        matchedSignals: [
          { name: "Service", detail: "Exact Match: Payment API" },
          { name: "Error Pattern", detail: "NpgsqlException Socket Buffer Exhaustion" },
          { name: "HTTP Status", detail: "HTTP 503 Spike (>15% error rate)" },
          { name: "Dependency", detail: "PostgreSQL Master Cluster & PgBouncer" },
          { name: "Deployment Timing", detail: "Triggered within 20m of container rollout" },
          { name: "Incident Symptoms", detail: "Checkout failure & p99 latency > 4,500ms" },
          { name: "Logs Signature", detail: "Ephemeral socket pool ceiling warning" }
        ]
      },
      {
        id: "INC-0174",
        title: "Payment API Connection Starvation",
        similarity: 81,
        service: "Payment API",
        severity: "Sev-2",
        resolutionTime: "24 minutes",
        date: "Aug 29, 2026",
        rootCause: "TCP ephemeral socket exhaustion caused by HttpClient instantiation per-request.",
        solution: "Migrated HTTP client instantiations to IHttpClientFactory with connection lifetime pooling.",
        prevention: "Configured socket pooling lifetime limits in K8s ingress daemonset.",
        matchedSignals: [
          { name: "Service", detail: "Exact Match: Payment API" },
          { name: "Error Pattern", detail: "SocketException & TCP connection starvation" },
          { name: "Dependency", detail: "Shared Ingress Gateway & Downstream Services" },
          { name: "Symptoms", detail: "Intermittent connection dropouts under burst" },
          { name: "Time Pattern", detail: "Triggered during peak checkout traffic surge" }
        ]
      },
      {
        id: "INC-0132",
        title: "Auth Worker Semaphore Deadlock",
        similarity: 73,
        service: "Auth Service",
        severity: "Sev-2",
        resolutionTime: "28 minutes",
        date: "Aug 11, 2026",
        rootCause: "Deadlock on async semaphore during concurrent database token validation under load.",
        solution: "Added timeout to SemaphoreSlim.WaitAsync(TimeSpan.FromSeconds(2)) and circuit breaker.",
        prevention: "Implemented distributed token cache in Redis with TTL.",
        matchedSignals: [
          { name: "Error Pattern", detail: "Threadpool starvation and blocked async handles" },
          { name: "HTTP Status", detail: "HTTP 504 / 503 response code cascade" },
          { name: "Metrics", detail: "p99 latency spikes and queue buildup" },
          { name: "Root Cause", detail: "Async synchronization resource exhaustion" }
        ]
      }
    ],
    timeline: [
      {
        period: "Week 32 (Aug 11, 2026)",
        incidentId: "INC-0132",
        title: "Auth Worker Semaphore Deadlock",
        service: "Auth Service",
        severity: "Sev-2",
        resolutionTime: "28m",
        patternTag: "Semaphore & Thread Starvation",
        status: "Resolved"
      },
      {
        period: "Week 34 (Aug 29, 2026)",
        incidentId: "INC-0174",
        title: "Payment API Connection Starvation",
        service: "Payment API",
        severity: "Sev-2",
        resolutionTime: "24m",
        patternTag: "TCP Socket Exhaustion",
        status: "Resolved"
      },
      {
        period: "Week 37 (Sep 14, 2026)",
        incidentId: "INC-0192",
        title: "Database Connection Failure",
        service: "Payment API",
        severity: "Sev-1",
        resolutionTime: "32m",
        patternTag: "PgBouncer Pool Ceiling",
        status: "Resolved"
      },
      {
        period: "Today (Sep 28, 2026)",
        incidentId: "INC-9042",
        title: "Database Connection Pool Exhaustion",
        service: "Payment API",
        severity: "Sev-1",
        resolutionTime: "Investigating",
        patternTag: "Active Recurring Pattern",
        status: "Active"
      }
    ]
  },
  {
    id: "INC-0174",
    title: "Ephemeral Socket Pool Starvation & Ingress 502",
    service: "Auth Service",
    environment: "Production",
    severity: "Critical (Sev-1)",
    impact: "User Authentication & JWT Tokens ($85k/hr estimated drift)",
    detectedTime: "Aug 29, 2026",
    signals: {
      service: "Auth Service (v2.9.0)",
      errorMessage: "System.Net.Sockets.SocketException: Ephemeral socket pool reached max ceiling",
      httpStatus: "HTTP 502 Bad Gateway",
      dependency: "Identity Provider & Redis Cache",
      rootCause: "High concurrency socket leak from unpooled HttpClient instances",
      logs: "SocketException: Address already in use / out of ports",
      deployment: "Release v2.9.0 rolled out 40m prior to alert",
      metrics: "Port exhaustion 99.1%, Ingress dropped packets 22%",
      environment: "Production (Azure Central US)",
      symptoms: "Token generation failures, SSO login loops",
      timePattern: "Morning peak login traffic (Monday 08:00 UTC)",
      tags: ["auth", "sockets", "production", "http-client", "sev-1"]
    },
    recurringAlert: {
      detected: true,
      title: "Recurring Socket Exhaustion Cycle",
      path: ["Auth Service", "Identity Gateway", "Socket Starvation", "HTTP 502"],
      frequency: "Detected 2 times across Auth & API Gateway modules.",
      riskLevel: "Medium-High Risk",
      recommendation: "Enforce HttpClientFactory singleton instantiation across all microservices."
    },
    matches: [
      {
        id: "INC-9042",
        title: "Database Connection Pool Exhaustion",
        similarity: 88,
        service: "Payment API",
        severity: "Sev-1",
        resolutionTime: "32 minutes",
        date: "Today",
        rootCause: "Connection pool saturation due to unclosed DB handles in async handler.",
        solution: "Deploy PgBouncer transaction-mode pooler and increase client connection limits.",
        prevention: "Enforce connection pooling linting in CI/CD pipeline.",
        matchedSignals: [
          { name: "Error Pattern", detail: "Socket pool limit exceeded" },
          { name: "Deployment Timing", detail: "Triggered shortly after deployment" },
          { name: "Symptoms", detail: "High error rates and dropped ingress connections" },
          { name: "Logs Signature", detail: "SocketException: Max ceiling reached" }
        ]
      },
      {
        id: "INC-0192",
        title: "Database Connection Failure",
        similarity: 82,
        service: "Payment API",
        severity: "Sev-1",
        resolutionTime: "32 minutes",
        date: "Sep 14, 2026",
        rootCause: "Connection pool exhaustion due to missing connection.Dispose().",
        solution: "Increased PostgreSQL connection ceiling and enabled idle pruning.",
        prevention: "Added Roslyn analyzer rule enforcing using statement on all DbConnections.",
        matchedSignals: [
          { name: "Error Pattern", detail: "Resource saturation under load" },
          { name: "HTTP Status", detail: "Gateway error cascade" },
          { name: "Time Pattern", detail: "Peak commercial usage hours" }
        ]
      }
    ],
    timeline: [
      {
        period: "Week 30 (Jul 28, 2026)",
        incidentId: "INC-0064",
        title: "CDN Cache Purge Throttling",
        service: "Edge CDN",
        severity: "Sev-3",
        resolutionTime: "15m",
        patternTag: "Rate Limit Exceeded",
        status: "Resolved"
      },
      {
        period: "Week 34 (Aug 29, 2026)",
        incidentId: "INC-0174",
        title: "Ephemeral Socket Pool Starvation",
        service: "Auth Service",
        severity: "Sev-1",
        resolutionTime: "24m",
        patternTag: "TCP Socket Exhaustion",
        status: "Resolved"
      }
    ]
  }
];
