"""
AetherOps AI - Application Insights APM & Distributed Tracing Integration
Queries distributed request traces, downstream dependency maps, and uncaught exceptions.
"""

import time
from backend.integrations.azure_monitor import azure_monitor

class ApplicationInsightsIntegration:
    def __init__(self):
        self.monitor = azure_monitor

    def get_requests(self, limit=10):
        """Fetches distributed transaction traces across the microservice mesh."""
        return [
            {
                "trace_id": "tr-98f12a0149bc",
                "request_id": "req-09124",
                "service": "Payment API",
                "operation": "POST /api/v1/checkout/process",
                "duration_ms": 2840,
                "status_code": 503,
                "client_ip": "198.51.100.44",
                "result": "Failed",
                "span_hierarchy": [
                    {"step": "User Request", "status": "OK", "duration_ms": 12},
                    {"step": "API Gateway", "status": "OK", "duration_ms": 18},
                    {"step": "Payment Service", "status": "Degraded", "duration_ms": 2810},
                    {"step": "Database Pool", "status": "Failed (Timeout)", "duration_ms": 2500}
                ]
            },
            {
                "trace_id": "tr-98f12a0149bd",
                "request_id": "req-09125",
                "service": "Order Service",
                "operation": "POST /api/v1/orders/create",
                "duration_ms": 310,
                "status_code": 200,
                "client_ip": "198.51.100.82",
                "result": "Success",
                "span_hierarchy": [
                    {"step": "User Request", "status": "OK", "duration_ms": 8},
                    {"step": "API Gateway", "status": "OK", "duration_ms": 15},
                    {"step": "Order Service", "status": "OK", "duration_ms": 287}
                ]
            }
        ]

    def get_dependencies(self, service_name="Payment API"):
        """Returns dependency graph nodes and health states for the targeted service."""
        return [
            {"target": "PostgreSQL Primary Pool", "type": "SQL Database", "status": "Critical", "latency_ms": 2800, "call_count": 1420, "error_rate": 18.4},
            {"target": "Authentication Service", "type": "gRPC Service", "status": "Healthy", "latency_ms": 42, "call_count": 3400, "error_rate": 0.01},
            {"target": "Redis Session Cache", "type": "In-Memory Cache", "status": "Healthy", "latency_ms": 4, "call_count": 5100, "error_rate": 0.0},
            {"target": "Stripe/Adyen Outbound Gateway", "type": "HTTP External", "status": "Healthy", "latency_ms": 220, "call_count": 890, "error_rate": 0.2}
        ]

    def get_exceptions(self, service_name="Payment API"):
        """Returns structured stack traces and exception aggregates."""
        return [
            {
                "exception_type": "Npgsql.NpgsqlException",
                "message": "Connection pool acquisition timeout expired after 5000ms. All 50 connections in pool 'pg_primary_rw' are currently leased by active worker transactions.",
                "count": 47,
                "first_seen": "Today 08:31:14",
                "last_seen": "Today 08:34:02",
                "stack_trace": "at Npgsql.PoolingDataSource.GetConnectionAsync(CancellationToken cancellationToken)\n   at PaymentService.Data.TransactionRepository.BeginCheckoutSessionAsync(Guid cartId)\n   at PaymentService.Controllers.CheckoutController.ProcessPayment(PaymentRequest req)"
            }
        ]

app_insights = ApplicationInsightsIntegration()
