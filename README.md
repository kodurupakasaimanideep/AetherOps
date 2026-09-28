# AetherOps AI ⚡
> **Autonomous Incident Intelligence & Organizational Memory Platform for Enterprise DevOps**

AetherOps AI turns production telemetry and runtime failures into searchable organizational knowledge. It combines real-time Azure observability, automated anomaly detection, multi-signal Incident DNA matching, pre-incident "What Changed?" analysis, interactive incident replay, and human-in-the-loop remediation.

---

## 🌟 Key Features

1. **Azure Monitoring & Observability Integration**
   - Seamless integration with Microsoft Azure Monitor, Application Insights, and Log Analytics.
   - Built-in safe **Demo Mode** fallback with realistic telemetry emulation when Azure credentials are not configured.

2. **Automatic Incident Detection Engine**
   - Continuously evaluates telemetry against multi-signal thresholds (HTTP 5xx rate, p99 latency degradation, CPU/Memory saturation, and connection pool depletion).
   - Automatically generates incidents (e.g., `INC-0284`), isolates affected microservices, correlates evidence, and initiates AI investigations.

3. **"What Changed?" Differential Analysis**
   - Performs automated pre-incident state differential comparison (Deployments, Configuration updates, Error rates, Latency, and Database connections).
   - Chronological change timeline with explicit classifications: `Observed Change`, `AI Observation`, and `AI Correlation`.

4. **Incident DNA & Multi-Signal Pattern Matching**
   - 12-vector structured fingerprint (Service, Environment, Severity, Error Type, HTTP Status, Dependency, Root Cause Category, Deployment Status, Symptoms, Impact, Time Pattern, Tags).
   - Multi-signal similarity ranking against historical incidents (e.g. 94% match with `INC-0192`).

5. **Incident Replay & Temporal Reconstruction**
   - Chronological step-by-step incident timeline player with `[Play]`, `[Pause]`, `[Previous]`, `[Next]`, and `[Restart]` controls.
   - Concludes with **"WHAT AETHEROPS LEARNED"** (Root Cause, Verified Solution, Prevention Guardrails).

6. **Knowledge Gap Detection & Continuous Learning**
   - Automatically flags novel operational failures where no historical solution exists (`KNOWLEDGE GAP DETECTED`).
   - Enables SREs to record novel resolutions, marking `NEW KNOWLEDGE CREATED` and indexing permanent solutions into Incident Memory.

7. **Human-in-the-Loop Operational Approval**
   - Enforces human sign-off on remediation actions (e.g. scaling connection pools, restarting pods) before execution, recording immutable audit logs.

8. **Enterprise Platform Settings & Security**
   - Monitoring connectors, AI reasoning models (Google Gemini 1.5, Azure OpenAI), detection rules, multi-channel notifications (Email, Teams, Webhook), Entra ID SSO, and immutable audit trails.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Backend Setup (Flask & SQLite)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the Flask backend server (runs on port 5000)
python app.py
```

### 3. Frontend Setup (Vite)
```bash
# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔒 Environment Variables

Copy `.env.example` to `.env` to configure live credentials:

```env
# Microsoft Azure Credentials (Optional - Demo Mode used if omitted)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_LOG_ANALYTICS_WORKSPACE_ID=your-workspace-id

# AI Service Configuration
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

---

## 🏛 Architecture

```
Company Microservices / AKS Cluster
               │
               ▼
Azure Monitor / Application Insights / Log Analytics
               │
               ▼
AetherOps AI Flask Backend (REST API Hub)
 ├── Incident Detection Engine (Multi-Signal Thresholds)
 ├── AI Root-Cause Analyzer ("What Changed?" Engine)
 ├── Incident DNA & Pattern Matcher (12-Vector Fingerprint)
 ├── Incident Replay Service (Temporal Reconstruction)
 └── Incident Memory & Knowledge Gap Service (SQLite / Vector Store)
               │
               ▼
AetherOps AI Dashboard & Copilot (Interactive Web UI)
```

---

## 📄 License
MIT License. Built for the Microsoft Hackathon.
