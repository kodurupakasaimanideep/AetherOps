# API & Microservice Timeout Recovery Runbook

## Diagnostic Steps
1. Check endpoint HTTP status rates and latency distribution across microservices.
2. Inspect worker thread/goroutine saturation on upstream and downstream payment gateways.
3. Verify external integration latency and connection timeouts.

## Remediation Steps
1. Enforce strict socket timeouts (e.g., 3000ms max connect and read timeouts).
2. Enable Circuit Breaker pattern to fail fast when downstream external APIs degrade.
3. Restart hanging worker pods or scale deployment replicas temporarily to absorb traffic burst.
