/**
 * Observability, Structured Logs, Distributed Traces & Dependencies Dataset
 * Schema-compatible with Azure Monitor / Application Insights & OpenTelemetry
 */

export const structuredLogsData = [
  {
    id: "log-101",
    timestamp: "08:42:01.104",
    timeFilter: "5m",
    service: "PaymentService",
    level: "ERROR",
    message: "Database timeout after 4500ms while executing query: 'SELECT * FROM accounts WHERE id = @id FOR UPDATE'",
    traceId: "trace-7f9a2b01c4d9",
    requestId: "req-9842a-alpha",
    pod: "payment-api-pod-8bf",
    rawPayload: {
      clientIp: "104.28.19.44",
      httpMethod: "POST",
      endpoint: "/api/v3/payments/charge",
      queryTimeMs: 4502,
      dbHost: "pg-master.internal.azure.net:5432"
    },
    relatedIncident: {
      id: "INC-9042",
      title: "Database Connection Pool Exhaustion & HTTP 503 Spike",
      severity: "Sev-1"
    },
    possibleCause: "Database connection pool saturated; queries queued beyond 4500ms timeout threshold.",
    historicalMatches: [
      { id: "INC-0192", match: "94% Similar", solution: "Increase pool ceiling & prune idle async handles" }
    ]
  },
  {
    id: "log-102",
    timestamp: "08:42:02.320",
    timeFilter: "5m",
    service: "PaymentService",
    level: "FATAL",
    message: "Connection pool exhausted. Max active connections ceiling (500/500) reached. 84 requests rejected in queue.",
    traceId: "trace-7f9a2b01c4d9",
    requestId: "req-9842a-alpha",
    pod: "payment-api-pod-8bf",
    rawPayload: {
      poolCurrent: 500,
      poolMax: 500,
      waitingQueue: 84,
      exception: "Npgsql.NpgsqlException: Socket pool buffer space exhausted"
    },
    relatedIncident: {
      id: "INC-9042",
      title: "Database Connection Pool Exhaustion",
      severity: "Sev-1"
    },
    possibleCause: "Missing connection.Dispose() in async retry loop leading to socket starvation.",
    historicalMatches: [
      { id: "INC-0192", match: "94% Similar", solution: "Deploy PgBouncer pooler" }
    ]
  },
  {
    id: "log-103",
    timestamp: "08:42:03.012",
    timeFilter: "5m",
    service: "PaymentService",
    level: "ERROR",
    message: "Payment request failed for order ORD-99214. Downstream database query aborted.",
    traceId: "trace-7f9a2b01c4d9",
    requestId: "req-9842a-alpha",
    pod: "payment-api-pod-9c2",
    rawPayload: {
      orderId: "ORD-99214",
      amount: "$149.99",
      status: "FAILED_CIRCUIT_OPEN"
    },
    relatedIncident: {
      id: "INC-9042",
      title: "Payment Processing Disruption",
      severity: "Sev-1"
    },
    possibleCause: "Cascading dependency failure following Database connection timeout.",
    historicalMatches: [
      { id: "INC-0174", match: "81% Similar", solution: "Add Circuit Breaker retry policy" }
    ]
  },
  {
    id: "log-104",
    timestamp: "08:42:04.180",
    timeFilter: "5m",
    service: "API Gateway",
    level: "ERROR",
    message: "HTTP 503 Service Unavailable returned to client on route /api/v3/payments/charge (Latency: 4892ms)",
    traceId: "trace-7f9a2b01c4d9",
    requestId: "req-9842a-alpha",
    pod: "ingress-envoy-mesh-4x",
    rawPayload: {
      httpStatus: 503,
      upstreamService: "payment-service:8080",
      totalLatencyMs: 4892,
      responseHeader: "x-failure-reason: upstream-timeout"
    },
    relatedIncident: {
      id: "INC-9042",
      title: "Checkout Degradation",
      severity: "Sev-1"
    },
    possibleCause: "Gateway timeout triggered after downstream PaymentService failed to respond within 4.5s.",
    historicalMatches: [
      { id: "INC-0192", match: "94% Similar", solution: "Enforce gateway circuit breaker" }
    ]
  },
  {
    id: "log-105",
    timestamp: "08:41:45.912",
    timeFilter: "15m",
    service: "Database",
    level: "WARN",
    message: "PostgreSQL slow query log: transaction lock wait time exceeded 1200ms on table 'accounts'",
    traceId: "trace-8e1c4a92f0b3",
    requestId: "req-6612b-beta",
    pod: "pg-primary-node-01",
    rawPayload: {
      lockType: "RowExclusiveLock",
      blockedPids: [1842, 1845, 1899],
      durationMs: 1240
    },
    relatedIncident: {
      id: "INC-9042",
      title: "Database Lock Contention",
      severity: "Sev-2"
    },
    possibleCause: "Unindexed subquery locking parent table during concurrent transactions.",
    historicalMatches: [
      { id: "INC-0098", match: "68% Similar", solution: "Add composite index on accounts table" }
    ]
  },
  {
    id: "log-106",
    timestamp: "08:40:12.440",
    timeFilter: "15m",
    service: "AuthService",
    level: "INFO",
    message: "JWT token validation succeeded for subject user_9941 (Key: RSA-256)",
    traceId: "trace-3a5d8f99e120",
    requestId: "req-3310c-gamma",
    pod: "auth-svc-pod-22a",
    rawPayload: {
      userId: "user_9941",
      tokenTtlRemaining: 3200,
      scope: ["read:profile", "write:payments"]
    },
    relatedIncident: null,
    possibleCause: "Normal healthy execution.",
    historicalMatches: []
  },
  {
    id: "log-107",
    timestamp: "08:38:55.109",
    timeFilter: "1h",
    service: "Redis",
    level: "INFO",
    message: "Cache HIT on key 'session:token:user_9941' (TTL: 840s)",
    traceId: "trace-3a5d8f99e120",
    requestId: "req-3310c-gamma",
    pod: "redis-cluster-shard-0",
    rawPayload: {
      cacheLatencyMs: 0.8,
      memoryUsage: "482MB / 2048MB"
    },
    relatedIncident: null,
    possibleCause: "Normal healthy execution.",
    historicalMatches: []
  },
  {
    id: "log-108",
    timestamp: "08:35:10.002",
    timeFilter: "1h",
    service: "Payment Gateway",
    level: "WARN",
    message: "Upstream PSP rate limiter warning: 82% of burst quota utilized on partner gateway.",
    traceId: "trace-1f2e3d4c5b6a",
    requestId: "req-1102d-delta",
    pod: "psp-proxy-pod-11b",
    rawPayload: {
      partner: "Stripe Enterprise",
      currentRps: 820,
      maxRps: 1000
    },
    relatedIncident: {
      id: "INC-0064",
      title: "Rate Limit Exceeded",
      severity: "Sev-3"
    },
    possibleCause: "Traffic burst from morning promotional campaign.",
    historicalMatches: [
      { id: "INC-0064", match: "89% Similar", solution: "Enable request queue batching" }
    ]
  }
];

export const traceWaterfallData = {
  "trace-7f9a2b01c4d9": {
    traceId: "trace-7f9a2b01c4d9",
    requestId: "req-9842a-alpha",
    endpoint: "POST /api/v3/payments/charge",
    status: 503,
    statusText: "Service Unavailable",
    totalDurationMs: 4892,
    timestamp: "Today at 08:42:01 UTC",
    failingComponent: "Database (PostgreSQL Master Cluster)",
    flowPath: [
      { node: "User Request", status: "ok", latency: "0ms" },
      { node: "API Gateway", status: "ok", latency: "14ms" },
      { node: "Payment Service", status: "ok", latency: "42ms" },
      { node: "Database", status: "failing", latency: "4500ms" },
      { node: "Timeout / HTTP 503", status: "error", latency: "4892ms" }
    ],
    spans: [
      {
        spanId: "span-001",
        service: "User Client / Browser",
        operation: "POST /api/v3/payments/charge",
        durationMs: 4892,
        startOffsetMs: 0,
        status: "ERROR 503",
        hasError: true,
        details: "Client waited 4.89s before receiving 503 Service Unavailable."
      },
      {
        spanId: "span-002",
        service: "API Gateway (Envoy Ingress)",
        operation: "Route & Auth Verification",
        durationMs: 4878,
        startOffsetMs: 14,
        status: "ERROR 503",
        hasError: true,
        details: "Forwarded request to payment-service:8080. Upstream response timed out."
      },
      {
        spanId: "span-003",
        service: "Payment Service (ASP.NET v3.4.1)",
        operation: "ProcessChargeAsync",
        durationMs: 4820,
        startOffsetMs: 42,
        status: "ERROR 500",
        hasError: true,
        details: "Acquired connection handle from DbConnectionPool. Reached 4500ms timeout."
      },
      {
        spanId: "span-004",
        service: "Database (PostgreSQL Master)",
        operation: "Npgsql.DbCommand.ExecuteReaderAsync",
        durationMs: 4502,
        startOffsetMs: 120,
        status: "TIMEOUT / FAILED",
        hasError: true,
        isRootFailure: true,
        details: "FAILING COMPONENT: Socket pool exhausted (500/500 connections active). Lock timeout exceeded."
      }
    ]
  },
  "trace-8e1c4a92f0b3": {
    traceId: "trace-8e1c4a92f0b3",
    requestId: "req-6612b-beta",
    endpoint: "GET /api/v3/accounts/balance",
    status: 200,
    statusText: "OK (Slow)",
    totalDurationMs: 1420,
    timestamp: "Today at 08:41:45 UTC",
    failingComponent: "Database Row Lock (Recovered)",
    flowPath: [
      { node: "User Request", status: "ok", latency: "0ms" },
      { node: "API Gateway", status: "ok", latency: "10ms" },
      { node: "Account Service", status: "warn", latency: "1350ms" },
      { node: "Database", status: "warn", latency: "1240ms" },
      { node: "HTTP 200 (Degraded)", status: "ok", latency: "1420ms" }
    ],
    spans: [
      {
        spanId: "span-101",
        service: "API Gateway",
        operation: "GET /api/v3/accounts/balance",
        durationMs: 1420,
        startOffsetMs: 0,
        status: "HTTP 200",
        hasError: false,
        details: "Completed with high latency warning."
      },
      {
        spanId: "span-102",
        service: "Database (PostgreSQL)",
        operation: "SELECT balance FROM accounts",
        durationMs: 1240,
        startOffsetMs: 60,
        status: "SLOW (Row Lock)",
        hasError: false,
        details: "Waiting on RowExclusiveLock from concurrent transaction."
      }
    ]
  },
  "trace-3a5d8f99e120": {
    traceId: "trace-3a5d8f99e120",
    requestId: "req-3310c-gamma",
    endpoint: "POST /api/v1/auth/verify",
    status: 200,
    statusText: "OK",
    totalDurationMs: 38,
    timestamp: "Today at 08:40:12 UTC",
    failingComponent: "None (Healthy)",
    flowPath: [
      { node: "User Request", status: "ok", latency: "0ms" },
      { node: "API Gateway", status: "ok", latency: "4ms" },
      { node: "Auth Service", status: "ok", latency: "22ms" },
      { node: "Redis Cache", status: "ok", latency: "2ms" },
      { node: "HTTP 200 OK", status: "ok", latency: "38ms" }
    ],
    spans: [
      {
        spanId: "span-201",
        service: "Auth Service",
        operation: "ValidateJwtSession",
        durationMs: 22,
        startOffsetMs: 4,
        status: "OK",
        hasError: false,
        details: "Cache hit on Redis session token."
      }
    ]
  }
};

export const serviceDependenciesData = {
  parentService: "Payment API",
  version: "v3.4.1",
  status: "CRITICAL",
  uptime: "99.12%",
  nodes: [
    {
      id: "dep-db",
      name: "Database (PostgreSQL Master)",
      type: "Database / Relational",
      status: "CRITICAL",
      latencyP99: "4,820ms",
      errorRate: "38.4%",
      activeConnections: "500 / 500 (100% Capped)",
      throughput: "1,420 QPS",
      isFailing: true,
      failureSummary: "Connection pool exhaustion. Socket buffer maxed out.",
      filterKey: "Database"
    },
    {
      id: "dep-auth",
      name: "Authentication (Auth Service)",
      type: "Internal Microservice",
      status: "HEALTHY",
      latencyP99: "42ms",
      errorRate: "0.01%",
      activeConnections: "48 / 200",
      throughput: "3,100 QPS",
      isFailing: false,
      failureSummary: "Nominal latency. RSA key verification healthy.",
      filterKey: "AuthService"
    },
    {
      id: "dep-psp",
      name: "Payment Gateway (Stripe Proxy)",
      type: "External Partner API",
      status: "DEGRADED",
      latencyP99: "890ms",
      errorRate: "4.2%",
      activeConnections: "120 / 150",
      throughput: "820 RPS",
      isFailing: false,
      failureSummary: "High burst rate approaching 82% of partner quota.",
      filterKey: "Payment Gateway"
    },
    {
      id: "dep-redis",
      name: "Redis (Session & Idempotency Cache)",
      type: "In-Memory Cache Cluster",
      status: "HEALTHY",
      latencyP99: "1.4ms",
      errorRate: "0.00%",
      activeConnections: "24 / 100",
      throughput: "8,900 QPS",
      isFailing: false,
      failureSummary: "98.9% Cache Hit Ratio. Memory headroom 76%.",
      filterKey: "Redis"
    }
  ]
};
