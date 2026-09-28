/**
 * Enterprise Service Mesh & Dependency Topology Dataset
 * Defines the 9 core enterprise microservices, dependencies, health status, and blast radius matrices.
 */

export const enterpriseServices = [
  {
    id: "api-gateway",
    name: "API Gateway",
    type: "Ingress / Mesh Router",
    status: "Degraded",
    statusColor: "#f59e0b",
    errorRate: "12.4%",
    requestRate: "14,200 req/s",
    avgLatency: "1.4s",
    incidentCount: 8,
    activeIncidents: 1,
    lastDeployment: "v2.8.4 (2 hours ago)",
    topError: "HTTP 503 Service Unavailable (Upstream Timeout)",
    x: 450,
    y: 80,
    dependencies: [
      { name: "Authentication Service", status: "Healthy" },
      { name: "Payment Service", status: "Degraded" },
      { name: "Order Service", status: "Degraded" },
      { name: "User Service", status: "Healthy" }
    ],
    historicalIncidents: [
      { id: "INC-0174", title: "Gateway SNAT Port Starvation", date: "Aug 2026" },
      { id: "INC-0064", title: "Rate Limiter Throttle Cascade", date: "Jul 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Public API Endpoints", "Web App UI"],
      potentiallyAffected: ["Mobile App Clients", "Third-party Webhooks"],
      unaffected: ["Internal Background Cron Workers", "Analytics Pipeline"]
    }
  },
  {
    id: "user-service",
    name: "User Service",
    type: "Core Microservice",
    status: "Healthy",
    statusColor: "#10b981",
    errorRate: "0.02%",
    requestRate: "3,800 req/s",
    avgLatency: "28ms",
    incidentCount: 3,
    activeIncidents: 0,
    lastDeployment: "v1.9.1 (3 days ago)",
    topError: "None (Nominal)",
    x: 180,
    y: 220,
    dependencies: [
      { name: "Authentication Service", status: "Healthy" },
      { name: "Database", status: "Critical" },
      { name: "Redis", status: "Healthy" }
    ],
    historicalIncidents: [
      { id: "INC-0082", title: "User Profile Cache Miss Storm", date: "Jun 2026" }
    ],
    blastRadius: {
      directlyAffected: ["User Profiles", "Account Settings"],
      potentiallyAffected: ["Personalized Recommendations"],
      unaffected: ["Payment Processing", "Notification Delivery"]
    }
  },
  {
    id: "payment-service",
    name: "Payment Service",
    type: "Financial & Settlement",
    status: "Degraded",
    statusColor: "#f59e0b",
    errorRate: "8.4%",
    requestRate: "1,840 req/s",
    avgLatency: "2.8 seconds",
    incidentCount: 14,
    activeIncidents: 2,
    lastDeployment: "v3.4.1 (18 mins ago)",
    topError: "HTTP 503 (Socket Pool Exhaustion)",
    x: 450,
    y: 240,
    dependencies: [
      { name: "Database", status: "Critical" },
      { name: "Authentication Service", status: "Healthy" },
      { name: "Redis", status: "Healthy" },
      { name: "Message Queue", status: "Healthy" }
    ],
    historicalIncidents: [
      { id: "INC-0192", title: "Database Connection Pool Failure", date: "Sep 2026" },
      { id: "INC-0174", title: "Ephemeral Socket Pool Starvation", date: "Aug 2026" },
      { id: "INC-0110", title: "Stripe Webhook Gateway Timeout", date: "Jul 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Payment API", "Card Processing"],
      potentiallyAffected: ["Checkout Flow", "Order Service"],
      unaffected: ["Authentication Service", "Notification Service"]
    }
  },
  {
    id: "order-service",
    name: "Order Service",
    type: "Commerce & Fulfillment",
    status: "Degraded",
    statusColor: "#f59e0b",
    errorRate: "6.1%",
    requestRate: "2,400 req/s",
    avgLatency: "1.8s",
    incidentCount: 9,
    activeIncidents: 1,
    lastDeployment: "v2.3.0 (1 day ago)",
    topError: "HTTP 504 Gateway Timeout (Blocked on Payment)",
    x: 720,
    y: 220,
    dependencies: [
      { name: "Payment Service", status: "Degraded" },
      { name: "Database", status: "Critical" },
      { name: "Message Queue", status: "Healthy" }
    ],
    historicalIncidents: [
      { id: "INC-0132", title: "Inventory Worker Semaphore Lock", date: "Aug 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Order Placement", "Cart Checkout"],
      potentiallyAffected: ["Shipping Labels Generation"],
      unaffected: ["User Authentication", "Catalog Search"]
    }
  },
  {
    id: "auth-service",
    name: "Authentication Service",
    type: "Security & IAM",
    status: "Healthy",
    statusColor: "#10b981",
    errorRate: "0.01%",
    requestRate: "8,900 req/s",
    avgLatency: "18ms",
    incidentCount: 5,
    activeIncidents: 0,
    lastDeployment: "v2.9.0 (5 days ago)",
    topError: "None (Nominal)",
    x: 180,
    y: 380,
    dependencies: [
      { name: "Redis", status: "Healthy" },
      { name: "Database", status: "Critical" }
    ],
    historicalIncidents: [
      { id: "INC-0174", title: "Ephemeral Socket Pool Starvation", date: "Aug 2026" }
    ],
    blastRadius: {
      directlyAffected: ["SSO Login", "JWT Token Minting"],
      potentiallyAffected: ["All Downstream Authenticated Routes"],
      unaffected: ["Public Health Check Endpoints"]
    }
  },
  {
    id: "notification-service",
    name: "Notification Service",
    type: "Async Messaging",
    status: "Healthy",
    statusColor: "#10b981",
    errorRate: "0.05%",
    requestRate: "1,200 req/s",
    avgLatency: "45ms",
    incidentCount: 2,
    activeIncidents: 0,
    lastDeployment: "v1.4.2 (1 week ago)",
    topError: "None (Nominal)",
    x: 720,
    y: 380,
    dependencies: [
      { name: "Message Queue", status: "Healthy" },
      { name: "Redis", status: "Healthy" }
    ],
    historicalIncidents: [
      { id: "INC-0044", title: "SendGrid Webhook Backpressure", date: "May 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Email & SMS Dispatch", "Push Notifications"],
      potentiallyAffected: ["Order Confirmation Alerts"],
      unaffected: ["Core Payment Gateway", "User Authentication"]
    }
  },
  {
    id: "database",
    name: "Database (PostgreSQL)",
    type: "Data Persistence",
    status: "Critical",
    statusColor: "#ef4444",
    errorRate: "38.4%",
    requestRate: "12,800 QPS",
    avgLatency: "4.8s",
    incidentCount: 19,
    activeIncidents: 2,
    lastDeployment: "Hotfix db-patch-88 (2 hours ago)",
    topError: "Connection Pool Capped (500/500 Max Active)",
    x: 320,
    y: 520,
    dependencies: [],
    historicalIncidents: [
      { id: "INC-0192", title: "Database Connection Pool Exhaustion", date: "Sep 2026" },
      { id: "INC-0098", title: "Unindexed Lock Contention Spike", date: "Jul 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Payment Service", "Order Service", "User Service"],
      potentiallyAffected: ["API Gateway", "Checkout Flow"],
      unaffected: ["Static Asset CDN", "Redis Cached Reads"]
    }
  },
  {
    id: "redis",
    name: "Redis (Cache & Session)",
    type: "In-Memory Store",
    status: "Healthy",
    statusColor: "#10b981",
    errorRate: "0.00%",
    requestRate: "24,500 QPS",
    avgLatency: "1.2ms",
    incidentCount: 4,
    activeIncidents: 0,
    lastDeployment: "Cluster v7.2 (2 weeks ago)",
    topError: "None (Nominal)",
    x: 580,
    y: 520,
    dependencies: [],
    historicalIncidents: [
      { id: "INC-0098", title: "Redis OOM Key Eviction", date: "Jul 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Session Storage", "Rate Limiter Counters"],
      potentiallyAffected: ["Auth Token Validation Cache"],
      unaffected: ["Direct Database Reads"]
    }
  },
  {
    id: "message-queue",
    name: "Message Queue (Kafka)",
    type: "Distributed Log Buffer",
    status: "Healthy",
    statusColor: "#10b981",
    errorRate: "0.01%",
    requestRate: "18,900 msg/s",
    avgLatency: "8ms",
    incidentCount: 3,
    activeIncidents: 0,
    lastDeployment: "Broker v3.6.0 (1 month ago)",
    topError: "None (Nominal)",
    x: 750,
    y: 520,
    dependencies: [],
    historicalIncidents: [
      { id: "INC-0051", title: "Kafka Partition Rebalance Lag", date: "May 2026" }
    ],
    blastRadius: {
      directlyAffected: ["Async Order Processing", "Notification Queue"],
      potentiallyAffected: ["Audit Logging Pipeline"],
      unaffected: ["Synchronous Payment Authorization"]
    }
  }
];

export const topologyEdges = [
  { from: "api-gateway", to: "auth-service" },
  { from: "api-gateway", to: "user-service" },
  { from: "api-gateway", to: "payment-service" },
  { from: "api-gateway", to: "order-service" },
  { from: "user-service", to: "database" },
  { from: "user-service", to: "redis" },
  { from: "payment-service", to: "database" },
  { from: "payment-service", to: "redis" },
  { from: "payment-service", to: "message-queue" },
  { from: "payment-service", to: "auth-service" },
  { from: "order-service", to: "payment-service" },
  { from: "order-service", to: "database" },
  { from: "order-service", to: "message-queue" },
  { from: "auth-service", to: "redis" },
  { from: "auth-service", to: "database" },
  { from: "notification-service", to: "message-queue" },
  { from: "notification-service", to: "redis" }
];
