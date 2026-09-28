import { toast } from './ToastManager.js';

export class AiAnalysisEngine {
  constructor(containerId, onMitigate) {
    this.container = document.getElementById(containerId);
    this.onMitigate = onMitigate;
    this.isAnalyzing = false;
  }

  formatCode(text) {
    if (!text) return '';
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  render(incident, autoRunScan = false) {
    if (!this.container) return;

    if (autoRunScan) {
      this.runInteractiveScan(incident);
      return;
    }

    const rca = incident.rootCauseAnalysis;
    if (!rca) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">No AI Diagnosis Available</div>
          <div class="empty-desc">Click "Run AI Diagnostics" to inspect Azure Monitor logs and traces.</div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="ai-copilot-card card">
        <div class="ai-header-bar">
          <div class="ai-branding">
            <div class="ai-sparkle-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"/>
              </svg>
            </div>
            <div class="ai-title-wrap">
              <h3>Azure Incident Copilot RCA</h3>
              <span>Powered by Azure OpenAI GPT-4o & Sentinel AI</span>
            </div>
          </div>
          <div class="confidence-gauge">
            <span>Confidence:</span>
            <span class="confidence-val">${rca.confidence}%</span>
          </div>
        </div>

        <div class="ai-diagnosis-container">
          <div class="ai-reasoning-box">
            <div class="ai-headline">
              <span>🎯 ${this.formatCode(rca.headline)}</span>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.75rem;">
              <span class="ai-culprit-pill">Culprit: ${rca.culpritService}</span>
              <span class="ai-culprit-pill" style="color:#38bdf8; border-color:rgba(56,189,248,0.3); background:rgba(56,189,248,0.1);">${rca.culpritCommit}</span>
              <span class="ai-culprit-pill" style="color:#a78bfa; border-color:rgba(167,139,250,0.3); background:rgba(167,139,250,0.1);">${rca.driftType}</span>
            </div>
            <p class="ai-body-text">${this.formatCode(rca.aiExplanation)}</p>
          </div>

          <div class="remediation-box">
            <div class="remediation-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Verified Remediation Plan
            </div>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.4rem;">
              ${rca.recommendedAction}
            </p>
            <div class="remediation-script-preview">
              ${rca.remediationScript}
            </div>
          </div>

          <div class="ai-actions-row">
            <button class="btn btn-azure" id="btn-apply-remediation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Execute 1-Click Azure Remediation
            </button>
            <button class="btn btn-outline" id="btn-re-scan-ai">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Re-analyze Live Telemetry
            </button>
            <button class="btn btn-ghost" id="btn-copy-rca">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Summary for Microsoft Teams
            </button>
          </div>
        </div>
      </div>
    `;

    // Wire action buttons
    document.getElementById('btn-apply-remediation')?.addEventListener('click', () => {
      this.executeMitigation(incident);
    });

    document.getElementById('btn-re-scan-ai')?.addEventListener('click', () => {
      this.runInteractiveScan(incident);
    });

    document.getElementById('btn-copy-rca')?.addEventListener('click', () => {
      const summaryText = `[Azure Copilot RCA Incident ${incident.id}]\nRoot Cause: ${rca.headline}\nCulprit: ${rca.culpritService} (${rca.culpritCommit})\nConfidence: ${rca.confidence}%\nAction: ${rca.recommendedAction}`;
      navigator.clipboard?.writeText(summaryText);
      toast.show({
        title: "Copied to Clipboard",
        message: "Executive incident summary ready to paste into Microsoft Teams Incident Bridge.",
        type: "azure"
      });
    });
  }

  runInteractiveScan(incident) {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const steps = [
      "Ingesting 14,200 distributed trace spans from Azure Monitor...",
      "Querying Kusto (KQL) logs for exception spikes & socket errors...",
      "Computing topological anomaly vectors across AKS node pools...",
      "Evaluating Azure OpenAI GPT-4o semantic similarity against 120k runbooks...",
      "Root Cause isolated: Socket leak in CosmosClient Singleton (Confidence: 98.4%)"
    ];

    this.container.innerHTML = `
      <div class="ai-copilot-card card">
        <div class="ai-scan-animation-box">
          <div class="ai-sparkle-icon" style="width:36px; height:36px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"/>
            </svg>
          </div>
          <div class="scanner-wave"></div>
          <div class="scan-step-text" id="scan-step-label">Initiating Deep Copilot Neural Telemetry Scan...</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Correlating Azure Kubernetes Service, Cosmos DB, and Front Door telemetry</div>
        </div>
      </div>
    `;

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const lbl = document.getElementById('scan-step-label');
        if (lbl) lbl.textContent = steps[stepIdx];
        stepIdx++;
      } else {
        clearInterval(interval);
        this.isAnalyzing = false;
        toast.show({
          title: "AI Analysis Complete",
          message: `Root-cause identified for ${incident.id} with ${incident.confidenceScore}% confidence.`,
          type: "success"
        });
        this.render(incident, false);
      }
    }, 650);
  }

  executeMitigation(incident) {
    toast.show({
      title: "Executing Remediation",
      message: `Deploying hotfix patch and rolling node restart for ${incident.service}...`,
      type: "azure",
      duration: 3000
    });

    const btn = document.getElementById('btn-apply-remediation');
    if (btn) {
      btn.innerHTML = `<span class="status-dot" style="background:#fff; display:inline-block; margin-right:4px;"></span> Applying Hotfix Container...`;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';
    }

    setTimeout(() => {
      incident.status = "Mitigating";
      incident.metrics.errorRate = "1.8%";
      incident.metrics.p99Latency = "120 ms";
      
      toast.show({
        title: "Mitigation Successfully Applied",
        message: `HTTP 503 error rate dropped to 1.8%. Sockets returned to healthy baseline.`,
        type: "success",
        duration: 5000
      });

      if (this.onMitigate) {
        this.onMitigate(incident);
      }
    }, 2400);
  }
}
