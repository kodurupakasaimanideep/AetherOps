# OpsMind Architecture

OpsMind is an AI DevOps Incident Memory and Root-Cause Agent platform designed to capture operational knowledge, analyze active production incidents, search runbooks, and perform automated root-cause analysis using the Hindsight Incident Memory Engine.

## Component Overview

```
                          ┌───────────────────────────┐
                          │   OpsMind Web UI (React)  │
                          └─────────────┬─────────────┘
                                        │ REST API
                                        ▼
                          ┌───────────────────────────┐
                          │    FastAPI API Gateway    │
                          └─────────────┬─────────────┘
                                        │
      ┌─────────────────────────────────┼─────────────────────────────────┐
      │                                 │                                 │
      ▼                                 ▼                                 ▼
┌───────────┐                 ┌───────────────────┐             ┌───────────────────┐
│ Incidents │                 │  Hindsight Memory │             │   Incident Agent  │
│ Service   │                 │      Engine       │             │   (LLM + Tools)   │
└─────┬─────┘                 └─────────┬─────────┘             └─────────┬─────────┘
      │                                 │                                 │
      ▼                                 ▼                                 ▼
┌───────────┐                 ┌───────────────────┐             ┌───────────────────┐
│  Data/    │                 │ TF-IDF / Vector   │             │ Log Analysis &    │
│ Incidents │                 │ Incident Memory   │             │ Runbook Tools     │
└───────────┘                 └─────────┴─────────┘             └───────────────────┘
```

## Key Modules

- **Hindsight Incident Memory**: Vector & TF-IDF similarity matcher that stores 12-dimensional vector representations of past incidents, symptoms, root causes, and verified fixes.
- **Incident Agent**: Autonomous agent capable of inspecting log files, searching runbooks, querying Hindsight memory, and proposing step-by-step remediation plans.
- **REST API (`/api/v1`)**:
  - `/incidents`: Retrieve and manage incidents.
  - `/agent/investigate`: Run AI agent root-cause investigations.
  - `/memory`: Search and query historical organizational memories.
