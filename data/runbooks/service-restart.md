# Service Restart & Memory Leak Recovery Runbook

## Diagnostic Steps
1. Inspect container restart history and exit codes (`kubectl describe pod <pod_name>` or Docker logs). Exit code 137 indicates OOM killer.
2. Monitor memory allocation rate and cache key eviction metrics.

## Remediation Steps
1. Configure Redis memory eviction policy:
   ```config
   maxmemory-policy volatile-lru
   ```
2. Ensure explicit TTL on all cached keys (e.g. session tokens, user profiles).
3. Increase memory limits in deployment spec if workload legitimately grew.
