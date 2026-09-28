export const INCIDENTS_DATA = [
  {
    id: "INC-9042",
    title: "Payment Gateway 504 Timeout & Thread Exhaustion",
    serviceSubtitle: "Payment API (US-E) · 14m ago",
    service: "Payment Gateway API",
    region: "US-East-1",
    severity: "CRITICAL",
    sevClass: "critical",
    status: "Investigating",
    statusDotColor: "#ef4444",
    aiContextTag: "🔗 96% match (INC-8192)",
    actions: ["inspect", "remediate"],
    canaryInfo: "Payment API has triggered 3 recurring timeout anomalies this week immediately following canary deployment build v3.4.12b.",
    metrics: {
      errorRate: "42.8%",
      p99Latency: "4,820 ms",
      throughput: "1,420 rps",
      cpuUtilization: "89.2%",
      memoryUsage: "94.6%"
    },
    rootCause: {
      headline: "Socket Leak in CosmosClient Singleton instantiation inside ASP.NET Core Middleware",
      culpritService: "checkout-service-v4",
      culpritCommit: "commit #a8f9c1d ('feat: add dynamic tenant header routing')",
      confidence: 98.4,
      explanation: "Azure Monitor telemetry correlates a 12x spike in TIME_WAIT TCP sockets starting 14 minutes after deployment of release v4.12.0. The connection factory re-instantiated CosmosClient per request rather than maintaining a singleton pool, saturating the host ephemeral port limit (64,512).",
      remediation: "Apply hotfix HF-9042-1 to inject ICosmosClientFactory as Singleton and restart AKS node deployment rollouts."
    },
    causalNodes: [
      { id: "client", label: "Front Door Edge", type: "entry", status: "degraded", latency: "4.8s", errors: "42.8%" },
      { id: "apigw", label: "API Mesh Gateway", type: "gateway", status: "degraded", latency: "4.7s", errors: "41.5%" },
      { id: "aks", label: "Payment Gateway API", type: "service", status: "critical", latency: "4.6s", errors: "94.2%", isCulprit: true },
      { id: "auth", label: "User Auth Service", type: "service", status: "healthy", latency: "45ms", errors: "0.01%" },
      { id: "cosmos", label: "Primary PostgreSQL / DB", type: "database", status: "throttled", latency: "3,200ms", errors: "38.2%" },
      { id: "redis", label: "Azure Redis Cache", type: "cache", status: "healthy", latency: "2.1ms", errors: "0%" }
    ],
    causalEdges: [
      { from: "client", to: "apigw", isCriticalPath: true },
      { from: "apigw", to: "aks", isCriticalPath: true },
      { from: "aks", to: "cosmos", isCriticalPath: true },
      { from: "aks", to: "redis" },
      { from: "apigw", to: "auth" }
    ]
  },
  {
    id: "INC-8719",
    title: "PostgreSQL Connection Pool Depletion (Max Limit)",
    serviceSubtitle: "Postgres Primary (USE) · 32m ago",
    service: "Primary PostgreSQL",
    region: "US-East-1",
    severity: "CRITICAL",
    sevClass: "critical",
    status: "Resolving",
    statusDotColor: "#f97316",
    aiContextTag: "⚙ Pool scaled +128",
    actions: ["inspect", "logs"],
    canaryInfo: "Active connection count reached 10,240 pool ceiling during peak transaction processing.",
    metrics: {
      errorRate: "28.4%",
      p99Latency: "3,120 ms",
      throughput: "2,840 rps",
      cpuUtilization: "94.1%",
      memoryUsage: "88.2%"
    },
    rootCause: {
      headline: "Unclosed async database connections in transaction rollback handler",
      culpritService: "postgres-pool-scaler",
      culpritCommit: "commit #5c12e9b ('fix: nested transaction rollback')",
      confidence: 94.2,
      explanation: "Database connection leak identified during exception handler execution in repository pattern layer.",
      remediation: "Scale connection pool dynamically by +128 connections and execute safe pod recycling."
    },
    causalNodes: [
      { id: "client", label: "Client Ingress", type: "entry", status: "degraded", latency: "3.2s", errors: "28.4%" },
      { id: "apigw", label: "API Gateway", type: "gateway", status: "healthy", latency: "22ms", errors: "0.1%" },
      { id: "aks", label: "Order Engine", type: "service", status: "degraded", latency: "2.8s", errors: "28.0%" },
      { id: "cosmos", label: "Primary PostgreSQL", type: "database", status: "critical", latency: "3.1s", errors: "89.2%", isCulprit: true }
    ],
    causalEdges: [
      { from: "client", to: "apigw" },
      { from: "apigw", to: "aks", isCriticalPath: true },
      { from: "aks", to: "cosmos", isCriticalPath: true }
    ]
  },
  {
    id: "INC-7620",
    title: "High CPU Spikes on Auth Worker Nodes & HPA",
    serviceSubtitle: "Auth Pod Cluster · 1h ago",
    service: "User Auth Service",
    region: "US-East-1",
    severity: "HIGH",
    sevClass: "high",
    status: "Triage Queued",
    statusDotColor: "#eab308",
    aiContextTag: "🛡 RC Cycle tag",
    actions: ["inspect", "logs"],
    canaryInfo: "Autoscaler throttled at 40 max replicas due to Kubernetes cluster quota limit.",
    metrics: {
      errorRate: "8.6%",
      p99Latency: "1,240 ms",
      throughput: "4,120 rps",
      cpuUtilization: "98.4%",
      memoryUsage: "62.0%"
    },
    rootCause: {
      headline: "BCrypt hashing work factor increase (12 -> 16) causing compute spike",
      culpritService: "user-auth-service",
      culpritCommit: "commit #99f01ab ('sec: update password hash salt cost')",
      confidence: 96.8,
      explanation: "Security update inadvertently increased CPU cost per authentication request by 16x.",
      remediation: "Revert work factor to 12 and offload argon2 verification to dedicated GPU workers."
    },
    causalNodes: [
      { id: "client", label: "Mobile Users", type: "entry", status: "healthy", latency: "40ms", errors: "0%" },
      { id: "apigw", label: "API Gateway", type: "gateway", status: "healthy", latency: "18ms", errors: "0%" },
      { id: "aks", label: "User Auth Service", type: "service", status: "critical", latency: "1.2s", errors: "8.6%", isCulprit: true }
    ],
    causalEdges: [
      { from: "client", to: "apigw" },
      { from: "apigw", to: "aks", isCriticalPath: true }
    ]
  },
  {
    id: "INC-6540",
    title: "Deployment Rollback Triggered on Order Pipeline",
    serviceSubtitle: "Canary v3.4.12 · 2h ago",
    service: "Order Processing",
    region: "US-East-1",
    severity: "MEDIUM",
    sevClass: "medium",
    status: "Auto-mitigated",
    statusDotColor: "#3b82f6",
    aiContextTag: "⚡ Rollout Rollback",
    actions: ["postmortem"],
    canaryInfo: "Automated canary analysis detected 4.2% latency drift on revision v3.4.12.",
    metrics: {
      errorRate: "0.2%",
      p99Latency: "180 ms",
      throughput: "3,200 rps",
      cpuUtilization: "41.2%",
      memoryUsage: "52.8%"
    },
    rootCause: {
      headline: "Missing database column index on order_history table",
      culpritService: "order-service-v3.4.12",
      culpritCommit: "commit #88a12bc ('db: migration add customer_status')",
      confidence: 99.2,
      explanation: "Full table scan triggered on unindexed column during batch order retrieval.",
      remediation: "Added concurrent B-Tree index on (customer_id, status) and promoted canary."
    },
    causalNodes: [
      { id: "client", label: "Checkout", type: "entry", status: "healthy", latency: "35ms", errors: "0%" },
      { id: "aks", label: "Order Processing", type: "service", status: "healthy", latency: "180ms", errors: "0.2%" }
    ],
    causalEdges: [
      { from: "client", to: "aks" }
    ]
  },
  {
    id: "INC-5190",
    title: "Redis Memory Eviction Storm in Session Cache",
    serviceSubtitle: "Cache Cluster 02 · 5h ago",
    service: "Azure Redis Cache",
    region: "US-East-1",
    severity: "LOW",
    sevClass: "low",
    status: "Resolved",
    statusDotColor: "#10b981",
    aiContextTag: "⏱ TTL policy fix",
    actions: ["inspect", "logs"],
    canaryInfo: "Volatile-lru eviction policy dropped 14,000 active user session keys.",
    metrics: {
      errorRate: "0.01%",
      p99Latency: "4.2 ms",
      throughput: "18,400 rps",
      cpuUtilization: "28.4%",
      memoryUsage: "48.2%"
    },
    rootCause: {
      headline: "Missing sliding expiry TTL on anonymous user basket objects",
      culpritService: "session-cache-manager",
      culpritCommit: "commit #77c89ff ('feat: persistent anonymous cart')",
      confidence: 97.4,
      explanation: "Anonymous cart tokens lacked 7-day expiration policy, causing Redis memory ceiling breach.",
      remediation: "Configured allkeys-lfu eviction with mandatory 48-hour TTL on guest sessions."
    },
    causalNodes: [
      { id: "client", label: "Web Visitors", type: "entry", status: "healthy", latency: "12ms", errors: "0%" },
      { id: "aks", label: "Cache Cluster 02", type: "service", status: "healthy", latency: "4.2ms", errors: "0%" }
    ],
    causalEdges: [
      { from: "client", to: "aks" }
    ]
  }
];
