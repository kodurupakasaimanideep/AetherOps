# Database Recovery Runbook

## Diagnostic Steps
1. Check active database connections:
   ```sql
   SELECT count(*), state, query FROM pg_stat_activity GROUP BY state, query;
   ```
2. Identify unclosed connection sources or long-running queries (> 10 seconds):
   ```sql
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '10 seconds';
   ```

## Remediation Steps
1. Scale max_connections temporarily if database host has sufficient memory:
   ```sql
   ALTER SYSTEM SET max_connections = '200';
   SELECT pg_reload_conf();
   ```
2. Terminate idle unclosed connections:
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND state_change < now() - INTERVAL '5 minutes';
   ```
3. Restart application deployment to release leaked pool resources.
