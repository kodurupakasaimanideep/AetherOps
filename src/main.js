import { INCIDENTS_DATA } from './data/incidentsData.js';
import { DashboardCharts } from './components/DashboardCharts.js';
import { toast } from './components/ToastManager.js';
import { ViewsRenderer } from './views/viewsRenderer.js';
import { ApiService } from './services/apiService.js';

// Hackathon Demo Live Incident Definition
const DEMO_INC_0284 = {
  id: "INC-0284",
  title: "Payment API Database Connection Exhaustion",
  service: "Payment API",
  serviceSubtitle: "Core Transaction Pipeline",
  region: "eastus2-aks",
  severity: "CRITICAL",
  sevClass: "critical",
  status: "Investigating",
  statusDotColor: "#ef4444",
  aiContextTag: "PgBouncer 96% Saturation",
  detectedTime: "Today 08:34:00",
  affectedUsers: "1,420 users",
  actions: ["inspect", "remediate"],
  metrics: {
    errorRate: "8.7%",
    p99Latency: "2,800ms",
    throughput: "3,400 req/s",
    cpuUtilization: "74.2%"
  },
  rootCause: {
    confidence: 87,
    headline: "Database Connection Pool Exhaustion (PgBouncer Saturated)",
    explanation: "PgBouncer max_connections pool was constrained to 50 during v2.4.1 canary rollout, leading to worker thread starvation during concurrency surges.",
    remediation: "Scale PgBouncer pool capacity to 200 connections via runbook RB-SCALE-POOL and recycle pooler pods."
  }
};

class IncidentRadarApp {
  constructor() {
    this.incidents = [DEMO_INC_0284, ...INCIDENTS_DATA];
    this.selectedIncident = this.incidents[0];
    this.currentTimeframe = "day";
    this.theme = "dark";
    this.searchQuery = "";
    this.currentView = "dashboard";
    this.azureStatus = null;
    this.replayInterval = null;

    this.viewsRenderer = new ViewsRenderer(this);
    this.init();
  }

  async init() {
    this.setupTheme();
    this.switchView('dashboard');
    this.setupGlobalEventListeners();
    await this.syncWithBackend();
  }

  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    toast.show({
      title: "Theme Mode Changed",
      message: `Switched to ${this.theme === 'dark' ? 'Dark Cybernetic Mode' : 'Light Clean Mode'}`,
      type: "azure"
    });
  }

  async syncWithBackend() {
    try {
      this.azureStatus = await ApiService.getAzureStatus();
      const pill = document.getElementById('header-azure-status-pill');
      const text = document.getElementById('azure-status-text');
      
      if (pill && text && this.azureStatus) {
        if (this.azureStatus.mode === 'Connected') {
          pill.className = 'azure-status-pill';
          text.textContent = 'Azure Monitor: Connected';
        } else {
          pill.className = 'azure-status-pill demo';
          text.textContent = 'Azure Monitor: Demo Mode';
        }
      }
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  }

  switchView(viewId) {
    this.currentView = viewId;

    // Update sidebar active link
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-nav') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Render the view content inside .page-content
    const mainContainer = document.querySelector('.page-content');
    if (mainContainer) {
      this.viewsRenderer.renderView(viewId, mainContainer);
      this.setupViewDynamicListeners(viewId);
    }
  }

  renderKpiSparklines() {
    DashboardCharts.renderSparkline('spark-total', [18, 22, 25, 20, 28, 34, 38], '#00d2ff');
    DashboardCharts.renderSparkline('spark-open', [10, 11, 9, 13, 12, 14, 12], '#a855f7');
    DashboardCharts.renderSparkline('spark-crit', [8, 6, 7, 5, 6, 5, 4], '#ef4444');
    DashboardCharts.renderSparkline('spark-autoresolved', [140, 160, 175, 190, 210, 225, 232], '#10b981');
    DashboardCharts.renderSparkline('spark-clusters', [32, 30, 29, 31, 28, 28, 27], '#f97316');
    DashboardCharts.renderSparkline('spark-mttr', [58, 52, 48, 44, 42, 39, 38], '#00d2ff');
    DashboardCharts.renderSparkline('spark-ai-acc', [62, 65, 68, 71, 73, 75, 76.4], '#3b82f6');
    DashboardCharts.renderSparkline('spark-vectors', [120, 132, 140, 148, 155, 160, 164], '#a78bfa');
  }

  renderCharts() {
    DashboardCharts.renderIncidentsOverTime('incidents-over-time-chart', this.currentTimeframe);
    DashboardCharts.renderSeverityDonut('severity-donut-chart');
    DashboardCharts.renderMttrVelocity('mttr-velocity-chart');
    DashboardCharts.renderResolutionHealthDonut('resolution-health-donut');
  }

  renderTriageTable() {
    const tbody = document.getElementById('triage-table-body');
    if (!tbody) return;

    const filtered = this.incidents.filter(inc => {
      const q = this.searchQuery.toLowerCase();
      return inc.id.toLowerCase().includes(q) ||
             inc.title.toLowerCase().includes(q) ||
             inc.service.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">
            No matching incidents found for "${this.searchQuery}".
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(inc => {
      const isSelected = this.selectedIncident.id === inc.id;
      
      let actionButtons = '';
      if (inc.actions.includes('remediate')) {
        actionButtons += `<button class="btn-table-action btn-inspect" data-id="${inc.id}">Inspect</button>`;
        actionButtons += `<button class="btn-table-action btn-table-remediate" data-id="${inc.id}">Remediate ⚡</button>`;
      } else if (inc.actions.includes('postmortem')) {
        actionButtons += `<button class="btn-table-action btn-postmortem" data-id="${inc.id}">Post-Mortem</button>`;
      } else {
        actionButtons += `<button class="btn-table-action btn-inspect" data-id="${inc.id}">Inspect</button>`;
        actionButtons += `<button class="btn-table-action btn-logs" data-id="${inc.id}">Logs</button>`;
      }

      return `
        <tr class="${isSelected ? 'selected-row' : ''}" data-id="${inc.id}">
          <td class="inc-id-cell">${inc.id}</td>
          <td>
            <div class="inc-service-cell">
              <span class="service-title">${inc.title}</span>
              <span class="service-sub">${inc.serviceSubtitle || inc.service}</span>
            </div>
          </td>
          <td>
            <span class="sev-tag sev-tag-${inc.sevClass}">${inc.severity}</span>
          </td>
          <td>
            <div class="status-indicator">
              <span class="copilot-dot" style="background:${inc.statusDotColor}; width:6px; height:6px;"></span>
              <span>${inc.status}</span>
            </div>
          </td>
          <td>
            <span class="context-tag">${inc.aiContextTag}</span>
          </td>
          <td>
            <div class="action-btns-group">
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Row click
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        const id = row.getAttribute('data-id');
        const inc = this.incidents.find(i => i.id === id);
        if (inc) {
          this.selectedIncident = inc;
          this.renderTriageTable();
          this.renderAiInsights();
        }
      });
    });

    // Inspect
    tbody.querySelectorAll('.btn-inspect').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const inc = this.incidents.find(i => i.id === id);
        if (inc) this.openInspectModal(inc);
      });
    });

    // Remediate
    tbody.querySelectorAll('.btn-table-remediate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const inc = this.incidents.find(i => i.id === id);
        if (inc) this.executeRemediation(inc);
      });
    });

    // Post-mortem
    tbody.querySelectorAll('.btn-postmortem').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const inc = this.incidents.find(i => i.id === id);
        if (inc) this.openPostMortemModal(inc);
      });
    });

    // Logs
    tbody.querySelectorAll('.btn-logs').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const inc = this.incidents.find(i => i.id === id);
        if (inc) this.openLogsModal(inc);
      });
    });
  }

  renderAiInsights() {
    const inc = this.selectedIncident;
    const canaryText = document.getElementById('ai-canary-text');
    const vectorText = document.getElementById('ai-vector-text');
    const alertBanner = document.getElementById('ai-active-alert-banner');

    if (canaryText && inc) {
      canaryText.innerHTML = inc.canaryInfo || `Telemetry correlating across AKS nodes for ${inc.service} in ${inc.region}.`;
    }

    if (vectorText && inc) {
      vectorText.innerHTML = `Current incident <strong>${inc.id}</strong> matches historical incident <strong>INC-0192</strong> with 94% DNA fingerprint overlap. Recommended mitigation: scale PgBouncer connection ceiling via RB-SCALE-POOL.`;
    }

    if (alertBanner && inc) {
      alertBanner.innerHTML = `<strong>Active Incident (${inc.id})</strong>: ${inc.title}. Telemetry correlating across ${inc.service} in <code>${inc.region}</code>.`;
    }
  }

  async triggerLiveIncidentDetection() {
    toast.show({
      title: "Detection Engine Triggered",
      message: "Evaluating live telemetry across Azure Monitor & AKS pipelines...",
      type: "azure"
    });

    const result = await ApiService.triggerIncidentDetection();
    
    // Ensure INC-0284 is selected
    const inc = this.incidents.find(i => i.id === 'INC-0284') || DEMO_INC_0284;
    this.selectedIncident = inc;
    
    if (this.currentView === 'dashboard') {
      this.renderTriageTable();
      this.renderAiInsights();
    }

    toast.show({
      title: "🚨 Anomaly Detected: INC-0284",
      message: "Payment API Database Connection Exhaustion (Error rate 8.7%, HTTP 503 spike, Pool 96%)",
      type: "critical",
      duration: 6000
    });

    this.openInspectModal(this.selectedIncident);
  }

  showAzureStatusModal() {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    const status = this.azureStatus || {
      mode: "Demo Mode",
      provider: "AetherOps Enterprise Telemetry Emulator",
      notice: "Azure credentials not configured in environment. Operating in safe Demo Mode.",
      last_sync: "08:45 AM",
      logs_retrieved: 24892,
      errors_detected: 147,
      services_detected: 12,
      active_incidents: 6,
      authenticated: false
    };

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="azure-status-backdrop">
        <div class="modal-content-card" style="max-width: 600px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <div class="azure-status-dot" style="width:10px; height:10px; background:${status.mode === 'Connected' ? '#10b981' : '#f59e0b'};"></div>
              <h3 style="font-size:1.1rem; color:#fff; font-weight:700;">Azure Monitoring Integration</h3>
            </div>
            <button class="ctrl-btn" id="azure-modal-close">&times;</button>
          </div>

          <div class="security-notice-banner" style="margin-bottom:1rem; ${status.mode === 'Connected' ? 'border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.08); color:#a7f3d0;' : 'border-color:rgba(245,158,11,0.3); background:rgba(245,158,11,0.08); color:#fde68a;'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <strong>${status.mode === 'Connected' ? 'Microsoft Azure Connected' : 'Operating in Demo Mode'}:</strong> ${status.notice || 'Real-time telemetry streaming from Azure Log Analytics & App Insights.'}
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem; margin-bottom:1.25rem;">
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Integration Mode</div>
              <div style="font-size:0.95rem; font-weight:700; color:#fff;">${status.mode}</div>
            </div>
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Last Sync</div>
              <div style="font-size:0.95rem; font-weight:700; color:var(--accent-cyan); font-family:var(--font-mono);">${status.last_sync}</div>
            </div>
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Logs Retrieved</div>
              <div style="font-size:0.95rem; font-weight:700; color:#fff; font-family:var(--font-mono);">${status.logs_retrieved.toLocaleString()}</div>
            </div>
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Errors Detected</div>
              <div style="font-size:0.95rem; font-weight:700; color:#ef4444; font-family:var(--font-mono);">${status.errors_detected}</div>
            </div>
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Services Detected</div>
              <div style="font-size:0.95rem; font-weight:700; color:#fff; font-family:var(--font-mono);">${status.services_detected}</div>
            </div>
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid var(--border-card);">
              <div style="font-size:0.72rem; color:var(--text-muted);">Active Incidents</div>
              <div style="font-size:0.95rem; font-weight:700; color:#ef4444; font-family:var(--font-mono);">${status.active_incidents}</div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn-launch-copilot" id="azure-modal-done" style="width:auto; padding:0.4rem 1.1rem;">Close</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('azure-modal-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('azure-modal-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('azure-status-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'azure-status-backdrop') modalMount.innerHTML = '';
    });
  }

  executeRemediation(incident) {
    toast.show({
      title: "Executing Autonomous Remediation",
      message: `Scaling PgBouncer connection pool to 200 for ${incident.service}...`,
      type: "azure",
      duration: 3000
    });

    setTimeout(() => {
      incident.status = "Resolved";
      incident.statusDotColor = "#10b981";
      incident.metrics.errorRate = "0.01%";
      incident.metrics.p99Latency = "195ms";
      if (this.currentView === 'dashboard') {
        this.renderTriageTable();
        this.renderAiInsights();
      }
      toast.show({
        title: "Incident Resolved & Mitigated ⚡",
        message: `${incident.id} PgBouncer pool scaled to 200. Error rate dropped to 0.01%.`,
        type: "success",
        duration: 5000
      });
    }, 1800);
  }

  async openInspectModal(incident) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    // Fetch async data for tabs
    const whatChangedData = await ApiService.getWhatChanged(incident.id);
    const replayData = await ApiService.getIncidentReplay(incident.id);
    const dnaData = await ApiService.getIncidentDna(incident.id);
    const dnaComparison = await ApiService.compareIncidentDna(incident.id, 'INC-0192');

    let currentReplayIndex = 0;

    const renderModal = (activeTab = 'overview') => {
      modalMount.innerHTML = `
        <div class="modal-backdrop" id="app-modal-backdrop">
          <div class="modal-content-card" style="max-width: 920px; max-height: 90vh; display:flex; flex-direction:column; overflow:hidden;">
            <!-- Modal Top Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem; flex-shrink:0;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="sev-tag sev-tag-${incident.sevClass}">${incident.severity}</span>
                  <span style="font-family:var(--font-mono); font-weight:800; color:var(--accent-cyan); font-size:1.1rem;">${incident.id}</span>
                  <span class="status-indicator">
                    <span class="copilot-dot" style="background:${incident.statusDotColor}; width:6px; height:6px;"></span>
                    <span>${incident.status}</span>
                  </span>
                </div>
                <h2 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-top:4px;">${incident.title}</h2>
                <div style="font-size:0.75rem; color:var(--text-dim);">${incident.service} · Environment: Production · Detected: ${incident.detectedTime || 'Today 08:34:00'}</div>
              </div>
              <button class="ctrl-btn" id="modal-close-x" style="padding:4px 8px; font-size:1.1rem;">&times;</button>
            </div>

            <!-- Tab Navigation Bar -->
            <div class="settings-nav-bar" style="margin: 0.75rem 0; padding: 0.35rem 0.5rem; flex-shrink:0;">
              <button class="settings-nav-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📊 Overview</button>
              <button class="settings-nav-btn ${activeTab === 'ai-analysis' ? 'active' : ''}" data-tab="ai-analysis">🤖 AI Analysis</button>
              <button class="settings-nav-btn ${activeTab === 'what-changed' ? 'active' : ''}" data-tab="what-changed">🔍 What Changed?</button>
              <button class="settings-nav-btn ${activeTab === 'incident-dna' ? 'active' : ''}" data-tab="incident-dna">🧬 Incident DNA</button>
              <button class="settings-nav-btn ${activeTab === 'incident-replay' ? 'active' : ''}" data-tab="incident-replay">🎬 Incident Replay</button>
              <button class="settings-nav-btn ${activeTab === 'similar' ? 'active' : ''}" data-tab="similar">🔄 Similar Incidents</button>
              <button class="settings-nav-btn ${activeTab === 'runbook' ? 'active' : ''}" data-tab="runbook">⚡ Runbook & Approval</button>
              <button class="settings-nav-btn ${activeTab === 'resolution' ? 'active' : ''}" data-tab="resolution">💾 Save Knowledge</button>
            </div>

            <!-- Tab Body Area (Scrollable) -->
            <div style="overflow-y:auto; flex:1; padding-right:0.25rem;">
              ${this.renderTabContent(activeTab, incident, whatChangedData, replayData, dnaData, dnaComparison, currentReplayIndex)}
            </div>

            <!-- Modal Footer -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:0.75rem; margin-top:0.75rem; flex-shrink:0;">
              <div style="font-size:0.72rem; color:var(--text-muted);">
                AetherOps Incident Intelligence · Connected to Incident Memory & Azure Stream
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="ctrl-btn" id="modal-cancel-btn">Close</button>
                <button class="btn-launch-copilot" id="modal-remediate-btn" style="width:auto; padding:0.35rem 1rem;">
                  Quick Remediate ⚡
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Tab switching handlers
      modalMount.querySelectorAll('.settings-nav-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          renderModal(tab);
        });
      });

      // Close handlers
      document.getElementById('modal-close-x')?.addEventListener('click', () => {
        if (this.replayInterval) clearInterval(this.replayInterval);
        modalMount.innerHTML = '';
      });
      document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
        if (this.replayInterval) clearInterval(this.replayInterval);
        modalMount.innerHTML = '';
      });
      document.getElementById('app-modal-backdrop')?.addEventListener('click', (e) => {
        if (e.target.id === 'app-modal-backdrop') {
          if (this.replayInterval) clearInterval(this.replayInterval);
          modalMount.innerHTML = '';
        }
      });

      // Quick remediate
      document.getElementById('modal-remediate-btn')?.addEventListener('click', () => {
        modalMount.innerHTML = '';
        this.executeRemediation(incident);
      });

      // Replay player buttons
      if (activeTab === 'incident-replay') {
        const total = replayData.steps.length;
        
        document.getElementById('btn-replay-play')?.addEventListener('click', () => {
          if (this.replayInterval) clearInterval(this.replayInterval);
          this.replayInterval = setInterval(() => {
            if (currentReplayIndex < total - 1) {
              currentReplayIndex++;
              renderModal('incident-replay');
            } else {
              clearInterval(this.replayInterval);
            }
          }, 1200);
        });

        document.getElementById('btn-replay-pause')?.addEventListener('click', () => {
          if (this.replayInterval) clearInterval(this.replayInterval);
        });

        document.getElementById('btn-replay-prev')?.addEventListener('click', () => {
          if (currentReplayIndex > 0) {
            currentReplayIndex--;
            renderModal('incident-replay');
          }
        });

        document.getElementById('btn-replay-next')?.addEventListener('click', () => {
          if (currentReplayIndex < total - 1) {
            currentReplayIndex++;
            renderModal('incident-replay');
          }
        });

        document.getElementById('btn-replay-restart')?.addEventListener('click', () => {
          currentReplayIndex = 0;
          renderModal('incident-replay');
        });
      }

      // Human Approval button
      document.getElementById('btn-approve-runbook-action')?.addEventListener('click', async () => {
        const res = await ApiService.approveRunbook('RB-SCALE-POOL', { incident_id: incident.id });
        toast.show({
          title: "Runbook Approved & Executed",
          message: "PgBouncer pool scaled to 200. Error rate normalized to 0.01%.",
          type: "success"
        });
        incident.status = "Resolved";
        incident.statusDotColor = "#10b981";
        incident.metrics.errorRate = "0.01%";
        incident.metrics.p99Latency = "195ms";
        renderModal('runbook');
      });

      // Resolution form submission
      document.getElementById('btn-save-knowledge-record')?.addEventListener('click', async () => {
        const rootCause = document.getElementById('res-root-cause')?.value || incident.rootCause?.explanation;
        const solution = document.getElementById('res-solution')?.value || incident.rootCause?.remediation;
        const prevention = document.getElementById('res-prevention')?.value || "CI/CD deployment guardrails enforcing pool size >= p99 worker count.";

        await ApiService.resolveIncident(incident.id, { root_cause: rootCause, solution, prevention });
        
        toast.show({
          title: "NEW KNOWLEDGE CREATED 📚",
          message: `Incident ${incident.id} indexed into Incident Memory with verified solution.`,
          type: "success"
        });

        incident.status = "Resolved (Knowledge Saved)";
        incident.statusDotColor = "#10b981";
        renderModal('resolution');
      });
    };

    renderModal('overview');
  }

  renderTabContent(tab, incident, whatChanged, replay, dna, dnaComp, replayIdx) {
    if (tab === 'overview') {
      return `
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; margin-bottom:1rem;">
          <div class="metric-card">
            <span class="metric-label">Error Rate</span>
            <div class="metric-number" style="color:#ef4444; font-size:1.15rem;">${incident.metrics.errorRate}</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">P99 Latency</span>
            <div class="metric-number" style="color:#f97316; font-size:1.15rem;">${incident.metrics.p99Latency}</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">Throughput</span>
            <div class="metric-number" style="font-size:1.15rem;">${incident.metrics.throughput}</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">Node CPU</span>
            <div class="metric-number" style="font-size:1.15rem;">${incident.metrics.cpuUtilization}</div>
          </div>
        </div>

        <div style="background:var(--bg-card-inner); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; margin-bottom:1rem;">
          <div style="font-size:0.72rem; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; margin-bottom:4px;">
            🎯 Isolated Root Cause (${incident.rootCause?.confidence || 87}% Confidence)
          </div>
          <h4 style="font-size:0.95rem; color:#fff; margin-bottom:0.4rem;">${incident.rootCause?.headline}</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.45; margin-bottom:0.75rem;">${incident.rootCause?.explanation}</p>
          <div style="font-size:0.76rem; color:#34d399; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-sm); padding:0.55rem 0.75rem;">
            <strong>Recommended Remediation:</strong> ${incident.rootCause?.remediation}
          </div>
        </div>
      `;
    }

    if (tab === 'ai-analysis') {
      return `
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div style="background:var(--bg-card-inner); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-card);">
            <h4 style="font-size:0.88rem; color:#fff; margin-bottom:0.5rem;">AI Hypothesis Synthesis</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              <div style="background:rgba(239,68,68,0.08); border-left:3px solid #ef4444; padding:0.6rem 0.8rem; border-radius:4px;">
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.82rem; color:#fff;">
                  <span>1. Database connection pool exhaustion</span>
                  <span style="color:#ef4444;">Confidence: 87% (Likely Cause)</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">
                  Evidence: PgBouncer pool hit 96% utilization. Npgsql connection acquisition timeouts exceeded 5000ms.
                </div>
              </div>

              <div style="background:rgba(245,158,11,0.08); border-left:3px solid #f59e0b; padding:0.6rem 0.8rem; border-radius:4px;">
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.82rem; color:#fff;">
                  <span>2. Recent Helm configuration change</span>
                  <span style="color:#f59e0b;">Confidence: 61% (Supporting Evidence)</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">
                  Evidence: max_connections downsized from 100 to 50 at 08:18:22 prior to checkout surge.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'what-changed') {
      return `
        <div class="what-changed-container">
          <div class="security-notice-banner" style="margin-bottom:0.75rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>${whatChanged.correlation_disclaimer}</div>
          </div>

          <h4 style="font-size:0.88rem; color:#fff;">Pre-Incident State Differential (Before vs. After)</h4>
          <div class="what-changed-diff-grid">
            ${whatChanged.metrics_comparison.map(m => `
              <div class="diff-param-card">
                <div class="diff-param-header">
                  <span class="diff-param-name">${m.parameter}</span>
                  <span class="diff-badge-observed">${m.badge}</span>
                </div>
                <div class="diff-values-flow">
                  <span class="diff-val-before">${m.before}</span>
                  <span class="diff-arrow-icon">➔</span>
                  <span class="diff-val-after">${m.after}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <h4 style="font-size:0.88rem; color:#fff; margin-top:1rem;">Pre-Incident Timeline & Classification</h4>
          <div class="what-changed-timeline">
            ${whatChanged.timeline.map(t => `
              <div class="wc-timeline-item">
                <span class="wc-time-label">${t.time}</span>
                <span class="wc-event-desc">${t.event}</span>
                <span class="${t.classification === 'Observed Change' ? 'diff-badge-observed' : t.classification === 'AI Observation' ? 'diff-badge-ai-obs' : 'diff-badge-ai-corr'}">
                  ${t.classification}
                </span>
              </div>
            `).join('')}
          </div>

          <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
            <button class="btn-integ-action" onclick="window.app.switchView('logs')">View Logs</button>
            <button class="btn-integ-action" onclick="window.app.switchView('analytics')">View Metrics</button>
            <button class="btn-integ-action" onclick="window.app.switchView('mesh')">View Dependencies</button>
          </div>
        </div>
      `;
    }

    if (tab === 'incident-dna') {
      return `
        <div>
          <div class="security-notice-banner" style="margin-bottom:1rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div><strong>DNA Comparison:</strong> ${dnaComp.similarity_note}</div>
          </div>

          <h4 style="font-size:0.88rem; color:#fff; margin-bottom:0.75rem;">12-Vector Incident Fingerprint</h4>
          <div class="incident-dna-grid">
            <div class="dna-vector-card">
              <span class="dna-vector-label">Service</span>
              <span class="dna-vector-value">${dna.service}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Environment</span>
              <span class="dna-vector-value">${dna.environment}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Severity</span>
              <span class="dna-vector-value" style="color:#ef4444;">${dna.severity}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Error Type</span>
              <span class="dna-vector-value">${dna.error_type}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">HTTP Status</span>
              <span class="dna-vector-value" style="color:#ef4444;">${dna.http_status}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Dependency</span>
              <span class="dna-vector-value">${dna.dependency}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Root Cause Category</span>
              <span class="dna-vector-value">${dna.root_cause_category}</span>
            </div>
            <div class="dna-vector-card">
              <span class="dna-vector-label">Deployment Status</span>
              <span class="dna-vector-value">${dna.deployment_status}</span>
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <h4 style="font-size:0.88rem; color:#fff;">DNA Alignment vs Historical Match (${dnaComp.incident_b})</h4>
              <span class="badge-configured" style="font-size:0.75rem; padding:0.2rem 0.6rem;">${dnaComp.similarity_percentage}% DNA Similarity</span>
            </div>
            <table class="dna-comparison-table">
              <thead>
                <tr>
                  <th>Signal Attribute</th>
                  <th>${dnaComp.incident_a} (Current)</th>
                  <th>${dnaComp.incident_b} (Historical)</th>
                  <th>Alignment</th>
                </tr>
              </thead>
              <tbody>
                ${dnaComp.comparison_vectors.map(v => `
                  <tr>
                    <td style="font-weight:600; color:#fff;">${v.attribute}</td>
                    <td>${v.val_a}</td>
                    <td>${v.val_b}</td>
                    <td>
                      <span class="dna-match-tag ${v.match ? 'match' : 'partial'}">
                        ${v.match ? '✓ ' + v.status : '≈ ' + v.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'incident-replay') {
      const step = replay.steps[replayIdx] || replay.steps[0];
      const isLast = replayIdx === replay.steps.length - 1;

      return `
        <div class="incident-replay-container">
          <div class="replay-controls-bar">
            <div>
              <span style="font-size:0.8rem; color:var(--text-muted);">Step ${replayIdx + 1} of ${replay.steps.length}</span>
              <div style="font-weight:700; color:#fff; font-size:0.9rem;">${step.phase}</div>
            </div>
            <div class="replay-btn-group">
              <button class="replay-btn" id="btn-replay-prev">◀ Previous</button>
              <button class="replay-btn primary" id="btn-replay-play">▶ Play</button>
              <button class="replay-btn" id="btn-replay-pause">❚❚ Pause</button>
              <button class="replay-btn" id="btn-replay-next">Next ▶</button>
              <button class="replay-btn" id="btn-replay-restart">↺ Restart</button>
            </div>
          </div>

          <div class="replay-active-step-card">
            <div class="replay-step-top">
              <span style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:var(--accent-cyan);">${step.time_str}</span>
              <span class="sev-tag sev-tag-${step.state === 'Critical' ? 'critical' : step.state === 'Warning' ? 'high' : 'low'}">${step.state}</span>
            </div>
            <div class="replay-step-title">${step.title}</div>
            <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.45;">${step.description}</p>
            <div class="replay-metric-box">
              <span>Telemetry Snapshot:</span>
              <strong>${step.metric_snapshot}</strong>
            </div>
          </div>

          ${isLast ? `
            <div class="replay-learned-box">
              <div class="replay-learned-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/></svg>
                ${replay.learned_summary.title}
              </div>
              <div style="font-size:0.8rem; color:#e2e8f0; line-height:1.45; margin-bottom:0.5rem;">
                <strong>Root Cause:</strong> ${replay.learned_summary.root_cause}
              </div>
              <div style="font-size:0.8rem; color:#e2e8f0; line-height:1.45; margin-bottom:0.5rem;">
                <strong>Verified Solution:</strong> ${replay.learned_summary.solution}
              </div>
              <div style="font-size:0.8rem; color:#e2e8f0; line-height:1.45;">
                <strong>Prevention Guardrail:</strong> ${replay.learned_summary.prevention}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (tab === 'similar') {
      return `
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="background:var(--bg-card-inner); border:1px solid var(--border-card); padding:0.9rem; border-radius:var(--radius-sm); border-left:3px solid var(--accent-cyan);">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.85rem; color:#fff;">
              <span>INC-0192: Database Connection Pool Depletion</span>
              <span class="badge-configured">94% DNA Match</span>
            </div>
            <p style="font-size:0.76rem; color:var(--text-secondary); margin-top:4px;">
              Root cause: Connection pool exhaustion due to aggressive unpooled acquisition in checkout handler.
            </p>
            <div style="font-size:0.75rem; color:#34d399; margin-top:4px;">
              Reused Solution: Scaled PgBouncer pool capacity to 250 connections and applied connection multiplexing.
            </div>
          </div>

          <div style="background:var(--bg-card-inner); border:1px solid var(--border-card); padding:0.9rem; border-radius:var(--radius-sm); border-left:3px solid #a855f7;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.85rem; color:#fff;">
              <span>INC-0174: PostgreSQL Query Lock Starvation</span>
              <span style="color:#a855f7; font-weight:700; font-size:0.75rem;">81% Match</span>
            </div>
            <p style="font-size:0.76rem; color:var(--text-secondary); margin-top:4px;">
              Root cause: Unindexed foreign key scan blocked incoming connection workers.
            </p>
          </div>
        </div>
      `;
    }

    if (tab === 'runbook') {
      return `
        <div class="human-approval-card">
          <div class="approval-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            HUMAN-IN-THE-LOOP APPROVAL REQUIRED
          </div>
          <p style="font-size:0.8rem; color:#fde68a; margin-bottom:0.75rem;">
            AetherOps AI assists engineers and does not execute destructive actions without explicit verification.
          </p>

          <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-xs); padding:0.85rem; margin-bottom:0.75rem;">
            <div style="font-weight:700; color:#fff; font-size:0.85rem;">AI Recommendation: Scale PgBouncer Pool to 200 & Recycle Pods</div>
            <div style="font-size:0.76rem; color:var(--text-secondary); margin-top:4px;">
              <strong>Reason:</strong> Service is returning repeated 503 errors. 47 failures in 5 minutes.
            </div>
            <div style="font-size:0.76rem; color:var(--text-secondary); margin-top:2px;">
              <strong>Evidence:</strong> PgBouncer connection queue saturated at 48/50 leases.
            </div>
          </div>

          <div class="approval-btn-row">
            <button class="btn-approve" id="btn-approve-runbook-action">✓ Approve & Execute Remediation</button>
            <button class="btn-cancel-approval" onclick="window.app.switchView('runbooks')">Review Action Script</button>
          </div>
        </div>
      `;
    }

    if (tab === 'resolution') {
      return `
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div class="security-notice-banner" style="border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.08); color:#a7f3d0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <strong>Turn Incidents into Organizational Knowledge:</strong> Saving this resolution indexes root cause patterns and prevention rules into permanent Incident Memory.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Verified Root Cause</label>
            <input type="text" class="form-input" id="res-root-cause" value="Database connection pool exhaustion due to PgBouncer pool reduction during checkout traffic surge." />
          </div>

          <div class="form-group">
            <label class="form-label">Applied Solution</label>
            <input type="text" class="form-input" id="res-solution" value="Scaled PgBouncer pool capacity to 200 connections and recycled pooler pods." />
          </div>

          <div class="form-group">
            <label class="form-label">Future Prevention Guardrails</label>
            <input type="text" class="form-input" id="res-prevention" value="Enforced CI/CD deployment validation rules that reject Helm configurations where database pool size is less than p99 concurrent checkout workers." />
          </div>

          <button class="btn-launch-copilot" id="btn-save-knowledge-record" style="width:auto; padding:0.5rem 1.2rem; align-self:flex-start;">
            Save to Incident Memory 📚
          </button>
        </div>
      `;
    }

    return '';
  }

  openPostMortemModal(incident) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="app-modal-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; color:#fff;">📄 Incident Post-Mortem: ${incident.id}</h3>
            <button class="ctrl-btn" id="pm-close">&times;</button>
          </div>
          <div style="background:var(--bg-card-inner); padding:1rem; border-radius:var(--radius-md); font-family:var(--font-mono); font-size:0.75rem; line-height:1.5; color:#cbd5e1; margin-bottom:1rem; max-height:300px; overflow-y:auto;">
# Executive Incident Summary: ${incident.id}
- Service: ${incident.service} (${incident.region})
- Severity: ${incident.severity}
- Status: ${incident.status}
- MTTR: 18 minutes

## Root Cause
${incident.rootCause?.headline}
${incident.rootCause?.explanation}

## Action Items & Preventative Measures
1. [COMPLETED] Scaled PgBouncer connection pool ceiling to 200 connections.
2. [COMPLETED] Verified Npgsql timeout latency dropped from 2,800ms to 195ms.
3. [ACTION] Enforce CI/CD deployment validation check on Helm database connection pool sizes.
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="ctrl-btn" id="pm-copy">Copy to Clipboard</button>
            <button class="btn-launch-copilot" id="pm-done" style="width:auto; padding:0.35rem 1rem;">Close</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('pm-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('pm-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('pm-copy')?.addEventListener('click', () => {
      toast.show({
        title: "Copied Post-Mortem",
        message: "Formatted markdown summary copied to clipboard.",
        type: "success"
      });
    });
  }

  openLogsModal(incident) {
    this.switchView('logs');
    toast.show({
      title: `Logs Filtered: ${incident.id}`,
      message: `Streaming eBPF logs for ${incident.service}`,
      type: "azure"
    });
  }

  setupGlobalEventListeners() {
    // Left Sidebar Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const navTarget = item.getAttribute('data-nav');
        if (navTarget) {
          this.switchView(navTarget);
        }
      });
    });

    // Sidebar bottom Launch Copilot button
    document.getElementById('sidebar-launch-copilot-btn')?.addEventListener('click', () => {
      this.switchView('copilot');
    });

    // Theme toggle
    document.getElementById('header-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Azure Status pill in header
    document.getElementById('header-azure-status-pill')?.addEventListener('click', () => {
      this.showAzureStatusModal();
    });

    // Live Incident Critical button
    document.getElementById('header-live-incident-btn')?.addEventListener('click', () => {
      this.triggerLiveIncidentDetection();
    });

    // Global Search Bar
    const searchInput = document.getElementById('global-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      if (this.currentView === 'dashboard') {
        this.renderTriageTable();
      }
    });

    // Keyboard shortcut (Ctrl + K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput?.focus();
      }
    });
  }

  setupViewDynamicListeners(viewId) {
    if (viewId === 'dashboard') {
      // Time pills
      document.querySelectorAll('.panel-time-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.panel-time-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentTimeframe = pill.getAttribute('data-time');
          DashboardCharts.renderIncidentsOverTime('incidents-over-time-chart', this.currentTimeframe);
        });
      });

      // Date range dropdown
      document.getElementById('date-range-dropdown-btn')?.addEventListener('click', () => {
        toast.show({
          title: "Date Range Filter",
          message: "Viewing telemetry window: Last 30 Days (Oct 1 - Oct 30)",
          type: "azure"
        });
      });

      // Runbooks pill
      document.getElementById('pill-runbooks-count')?.addEventListener('click', () => {
        this.switchView('pattern');
      });

      // Export SRE report
      document.getElementById('btn-export-sre-report')?.addEventListener('click', () => {
        toast.show({
          title: "SRE Report Generated",
          message: "Exported 30-day incident summary & MTTR SLA report.",
          type: "success"
        });
      });

      // 1 Critical alert pill
      document.getElementById('btn-critical-p0-alert')?.addEventListener('click', () => {
        this.triggerLiveIncidentDetection();
      });

      // Apply vector fix button in AI Insights card
      document.getElementById('btn-apply-vector-fix')?.addEventListener('click', () => {
        this.executeRemediation(this.selectedIncident);
      });

      // View graph diff
      document.getElementById('btn-view-graph-diff')?.addEventListener('click', () => {
        this.switchView('graph');
      });

      // View All Incidents link
      document.getElementById('btn-view-all-incidents')?.addEventListener('click', () => {
        toast.show({
          title: "All 12 Incidents Tailed",
          message: "Streaming all P0 through P3 active tickets.",
          type: "azure"
        });
      });

      // Trigger Detection Engine Banner Button
      document.getElementById('btn-trigger-detection-engine')?.addEventListener('click', () => {
        this.triggerLiveIncidentDetection();
      });
    }
  }

  initFloatingCopilot() {
    const existing = document.getElementById('floating-copilot-root');
    if (existing) return;

    const root = document.createElement('div');
    root.id = 'floating-copilot-root';
    root.innerHTML = `
      <button class="floating-copilot-btn" id="floating-copilot-toggle-btn" title="Open AI SRE Assistant">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/>
        </svg>
      </button>

      <div class="floating-copilot-window" id="floating-copilot-window" style="display:none;">
        <div class="floating-copilot-header">
          <div class="floating-copilot-title">
            <span class="copilot-dot" style="background:#00d2ff;"></span>
            AetherOps Gemini AI Assistant
          </div>
          <button class="ctrl-btn" id="floating-copilot-close-btn" style="padding:2px 6px;">&times;</button>
        </div>

        <div class="floating-copilot-messages" id="floating-chat-stream">
          <div class="chat-msg msg-ai">
            <div class="chat-avatar ai-av">AI</div>
            <div class="chat-bubble">
              <strong>Hi Alex!</strong> I am your Gemini-powered SRE Copilot. Ask me to debug errors, explain company architecture, or generate Kubernetes commands.
            </div>
          </div>
        </div>

        <div class="quick-prompts-bar">
          <button class="quick-prompt-pill float-quick-pill" data-prompt="Why is Payment API failing?">Why is Payment API failing?</button>
          <button class="quick-prompt-pill float-quick-pill" data-prompt="Have we seen this problem before?">Have we seen this before?</button>
          <button class="quick-prompt-pill float-quick-pill" data-prompt="What changed before this incident?">What changed?</button>
        </div>

        <div class="floating-copilot-input-box">
          <input type="text" class="floating-copilot-input" id="floating-chat-input" placeholder="Ask AI anything..." />
          <button class="btn-launch-copilot" id="floating-send-btn" style="width:auto; padding:0.35rem 0.75rem;">Send ⚡</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    const toggleBtn = document.getElementById('floating-copilot-toggle-btn');
    const windowEl = document.getElementById('floating-copilot-window');
    const closeBtn = document.getElementById('floating-copilot-close-btn');
    const chatStream = document.getElementById('floating-chat-stream');
    const input = document.getElementById('floating-chat-input');
    const sendBtn = document.getElementById('floating-send-btn');

    toggleBtn?.addEventListener('click', () => {
      const isHidden = windowEl.style.display === 'none';
      windowEl.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) input?.focus();
    });

    closeBtn?.addEventListener('click', () => {
      windowEl.style.display = 'none';
    });

    const formatMarkdown = (text) => {
      if (!text) return '';
      return text
        .replace(/### (.*)/g, '<h4 style="color:#00d2ff; font-size:0.8rem; margin:4px 0;">$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br/>');
    };

    const handleFloatingSend = async (customPrompt = null) => {
      const text = (customPrompt || input.value).trim();
      if (!text) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg msg-user';
      userMsg.innerHTML = `<div class="chat-avatar user-av">AC</div><div class="chat-bubble">${text}</div>`;
      chatStream.appendChild(userMsg);
      if (!customPrompt) input.value = '';

      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg msg-ai';
      loadingMsg.id = 'float-loading';
      loadingMsg.innerHTML = `<div class="chat-avatar ai-av">AI</div><div class="chat-bubble" style="color:#00d2ff;"><div class="spinner-icon" style="display:inline-block; vertical-align:middle; margin-right:4px;"></div> Analyzing...</div>`;
      chatStream.appendChild(loadingMsg);
      chatStream.scrollTop = chatStream.scrollHeight;

      try {
        const { geminiChat } = await import('./services/geminiChatService.js');
        const reply = await geminiChat.sendMessage(text);
        const l = document.getElementById('float-loading');
        if (l) l.parentNode.removeChild(l);

        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg msg-ai';
        aiMsg.innerHTML = `<div class="chat-avatar ai-av">AI</div><div class="chat-bubble">${formatMarkdown(reply)}</div>`;
        chatStream.appendChild(aiMsg);
        chatStream.scrollTop = chatStream.scrollHeight;
      } catch (err) {
        const l = document.getElementById('float-loading');
        if (l) l.parentNode.removeChild(l);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg msg-ai';
        aiMsg.innerHTML = `<div class="chat-avatar ai-av">AI</div><div class="chat-bubble">Processed query and applied SRE diagnostic metrics.</div>`;
        chatStream.appendChild(aiMsg);
      }
    };

    sendBtn?.addEventListener('click', () => handleFloatingSend());
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleFloatingSend();
    });

    document.querySelectorAll('.float-quick-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const prompt = pill.getAttribute('data-prompt');
        handleFloatingSend(prompt);
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new IncidentRadarApp();
  window.app.initFloatingCopilot();
});
