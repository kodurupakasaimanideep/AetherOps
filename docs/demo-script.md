# OpsMind Demo Script

## Demo Overview
Demonstrates how OpsMind investigates `INC-004` (Inventory Analytics Query CPU Saturation) using Hindsight Incident Memory, Log inspection, and Runbook matching.

1. **Overview Dashboard**:
   - Show active incident `INC-004` (Severity: HIGH, Service: inventory-service).
2. **AI Agent Root Cause Investigation**:
   - Click "Investigate Incident".
   - The agent inspects `database_failure.log`, queries Hindsight Memory (discovering `INC-001` PostgreSQL pool exhaustion), and searches runbook `database-recovery.md`.
3. **Review Recommendation & Resolution**:
   - Review root cause analysis and step-by-step remediation guide.
   - Execute recommendation and mark incident as RESOLVED.
