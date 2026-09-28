import { INCIDENTS_DATA } from '../data/incidentsData.js';
import { DashboardCharts } from '../components/DashboardCharts.js';
import { toast } from '../components/ToastManager.js';
import { platformSettingsData } from '../data/platformSettingsData.js';

export class ViewsRenderer {
  constructor(app) {
    this.app = app;
  }

  renderView(viewId, container) {
    if (!container) return;

    switch (viewId) {
      case 'rca':
        this.renderRcaView(container);
        break;
      case 'graph':
        this.renderGraphView(container);
        break;
      case 'pattern':
        this.renderPatternView(container);
        break;
      case 'logs':
        this.renderLogsView(container);
        break;
      case 'mesh':
        this.renderMeshView(container);
        break;
      case 'copilot':
        this.renderCopilotView(container);
        break;
      case 'runbooks':
        this.renderRunbooksView(container);
        break;
      case 'analytics':
        this.renderAnalyticsView(container);
        break;
      case 'settings':
        this.renderSettingsView(container);
        break;
      case 'dashboard':
      default:
        this.renderDashboardView(container);
        break;
    }
  }

  renderDashboardView(container) {
    // Restores default dashboard layout
    container.innerHTML = `
      <!-- Dashboard Heading & Control Row -->
      <div class="dashboard-heading-row">
        <div class="dashboard-title-wrap">
          <h1>
            Incident Intelligence & Root-Cause Radar
            <span class="cluster-tag">CLUSTER: AKS-01</span>
          </h1>
          <p class="dashboard-subtitle">
            Autonomous investigation, contextual incident memory and real-time remediation orchestration
          </p>
        </div>

        <div class="dashboard-header-controls">
          <button class="ctrl-btn" id="date-range-dropdown-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Last 30 Days ▾
          </button>
          <div class="header-pill" style="color:var(--text-dim); cursor:pointer;" id="pill-runbooks-count">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            155k Runbooks (AI vectors)
          </div>
          <button class="ctrl-btn btn-export" id="btn-export-sre-report">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export SRE Report
          </button>
          <button class="ctrl-btn btn-critical-alert" id="btn-critical-p0-alert">
            <span class="status-dot" style="background:#ef4444; width:6px; height:6px; display:inline-block;"></span>
            1 Critical (P0/P1)
          </button>
        </div>
      </div>

      <!-- 8 KPI Metric Sparkline Cards -->
      <section class="metric-cards-grid">
        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Total Incidents</span>
            <span class="metric-delta-tag delta-up">▲ 12%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number">248</div>
            <div class="metric-sparkline" id="spark-total"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Open Incidents</span>
            <span class="metric-delta-tag delta-up">▲ 2%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number">12</div>
            <div class="metric-sparkline" id="spark-open"></div>
          </div>
        </div>

        <div class="metric-card card-highlight-red">
          <div class="metric-card-top">
            <span class="metric-label" style="color:#f87171;">Critical P0/P1</span>
            <span class="metric-delta-tag delta-red">▼ 18%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number" style="color:#ef4444;">4</div>
            <div class="metric-sparkline" id="spark-crit"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Auto-Resolved</span>
            <span class="metric-delta-tag delta-up">▲ 38%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number" style="color:#10b981;">232</div>
            <div class="metric-sparkline" id="spark-autoresolved"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Recurring Clusters</span>
            <span class="metric-delta-tag delta-down">▼ 5%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number">27</div>
            <div class="metric-sparkline" id="spark-clusters"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">MTTR Average</span>
            <span class="metric-delta-tag delta-down">▼ 34%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number" style="color:#00d2ff;">38<span style="font-size:0.85rem; font-weight:600;">m</span></div>
            <div class="metric-sparkline" id="spark-mttr"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">AI Accuracy</span>
            <span class="metric-delta-tag delta-up">▲ 20%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number" style="color:#38bdf8;">76.4<span style="font-size:0.85rem; font-weight:600;">%</span></div>
            <div class="metric-sparkline" id="spark-ai-acc"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Memory Vectors</span>
            <span class="metric-delta-tag delta-up">▲ 11%</span>
          </div>
          <div class="metric-card-bottom">
            <div class="metric-number" style="color:#a78bfa;">164</div>
            <div class="metric-sparkline" id="spark-vectors"></div>
          </div>
        </div>
      </section>

      <!-- Middle Row: 3 Panels -->
      <section class="middle-panels-grid">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>Incidents Over Time</h3>
              <span>Sev-1 - Sev-3 incident surge vector</span>
            </div>
            <div class="panel-pills-group">
              <button class="panel-time-pill active" data-time="day">Day</button>
              <button class="panel-time-pill" data-time="week">Week</button>
              <button class="panel-time-pill" data-time="month">Month</button>
            </div>
          </div>
          <div class="chart-container-wrap" id="incidents-over-time-chart"></div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>By Severity</h3>
              <span>Active classification</span>
            </div>
          </div>
          <div class="donut-wrap">
            <div class="donut-svg-box">
              <div id="severity-donut-chart" style="width:100%; height:100%;"></div>
              <div class="donut-center-text">
                <span class="donut-center-val">248</span>
                <span class="donut-center-lbl">TOTAL</span>
              </div>
            </div>
            <div class="donut-legend-grid">
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#ef4444;"></span> Critical</div>
                <span class="legend-val">4 (2%)</span>
              </div>
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#f97316;"></span> High</div>
                <span class="legend-val">12 (5%)</span>
              </div>
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#3b82f6;"></span> Med</div>
                <span class="legend-val">62 (25%)</span>
              </div>
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#00d2ff;"></span> Low</div>
                <span class="legend-val">170 (68%)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>Service Hotspots</h3>
              <span>Microservice volume distribution</span>
            </div>
          </div>
          <div class="hotspot-list">
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">Payment Gateway API</span>
                <span class="hotspot-count" style="color:#ef4444;">72 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 82%; background: linear-gradient(90deg, #f97316, #ef4444);"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">Primary PostgreSQL</span>
                <span class="hotspot-count" style="color:#a855f7;">48 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 58%; background: #a855f7;"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">User Auth Service</span>
                <span class="hotspot-count" style="color:#00d2ff;">39 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 46%; background: #00d2ff;"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">Order Processing</span>
                <span class="hotspot-count" style="color:#10b981;">31 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 36%; background: #10b981;"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">API Mesh Gateway</span>
                <span class="hotspot-count">24 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 28%; background: #6366f1;"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">Inventory Engine</span>
                <span class="hotspot-count">18 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 22%; background: #64748b;"></div>
              </div>
            </div>
            <div class="hotspot-item">
              <div class="hotspot-meta">
                <span class="hotspot-name">Notification Hub</span>
                <span class="hotspot-count">16 inc</span>
              </div>
              <div class="hotspot-bar-track">
                <div class="hotspot-bar-fill" style="width: 19%; background: #0284c7;"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Center Section: Live Table & AI Insights -->
      <section class="stream-insights-grid">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3 style="display:flex; align-items:center; gap:0.4rem;">
                <span class="copilot-dot" style="background:#00d2ff; width:7px; height:7px;"></span>
                Live Incident Triage Stream
              </h3>
              <span>Streaming telemetry from eBPF agents & AKS mesh</span>
            </div>
            <div class="header-pill" style="color:#f87171; border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.1);">
              <strong>[P1] (12)</strong> P0/P1 Critical Investigating 3pcs
            </div>
          </div>

          <div class="table-wrap">
            <table class="triage-table" id="triage-stream-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Service & Anomaly</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>AI Context</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="triage-table-body"></tbody>
            </table>
          </div>

          <div class="table-footer-status">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="copilot-dot" style="background:#10b981; width:5px; height:5px;"></span>
              WebSocket Live Tracing - Latency 7ms
            </div>
            <div style="color:var(--accent-cyan); font-weight:600; cursor:pointer;" id="btn-view-all-incidents">
              Showing 5 of 12 active &nbsp; View All &gt;
            </div>
          </div>
        </div>

        <div class="panel-card ai-insights-panel" id="autonomous-ai-insights-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3 style="color:#fff; display:flex; align-items:center; gap:0.4rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#00d2ff"><path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/></svg>
                Autonomous AI Insights
              </h3>
              <span style="color:var(--accent-cyan);">AetherOps Memory Kernel v2.4</span>
            </div>
            <span class="header-pill" style="font-size:0.62rem; color:#34d399; border-color:rgba(16,185,129,0.3);">
              Real-Time Synced
            </span>
          </div>

          <div class="ai-alert-banner" id="ai-active-alert-banner">
            <strong>2 Active Incidents</strong> correlate directly to Postgres DB connection pool saturation in <code>us-east-1</code>. Lock contention observed in <code>pg_stat_activity</code>.
          </div>

          <div class="ai-section-block">
            <div class="ai-section-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              Canary Rollout Drift
            </div>
            <p class="ai-section-text" id="ai-canary-text">
              Payment API has triggered 3 recurring timeout anomalies this week immediately following canary deployment build <code>v3.4.12b</code>.
            </p>
          </div>

          <div class="ai-section-block">
            <div class="ai-section-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Vector Memory Match (96% Match)
            </div>
            <p class="ai-section-text" id="ai-vector-text">
              Current incident matches historical incident <strong>INC-8120</strong> with 96% semantic vector overlap. Recommended mitigation: auto-trigger connection pool scale-up script.
            </p>
            <div class="ai-action-pills-row">
              <button class="btn-ai-pill btn-ai-pill-primary" id="btn-apply-vector-fix">Apply Vector Fix</button>
              <button class="btn-ai-pill btn-ai-pill-secondary" id="btn-view-graph-diff">View Graph Diff</button>
            </div>
          </div>

          <div class="ai-section-block" style="margin-bottom: 0.3rem;">
            <div class="ai-section-tag" style="color:#10b981;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              Autonomous Efficiency
            </div>
            <p class="ai-section-text">
              Average incident resolution time decreased by <strong>38%</strong> over the past 30 days due to autonomous recovery runbook executions.
            </p>
          </div>

          <div class="ai-insights-footer">
            <div>Auto-Triage Model: <strong>GPT-4o Pro</strong></div>
            <div style="color:var(--accent-cyan); font-weight:600;">Fine-tuned Agent</div>
          </div>
        </div>
      </section>

      <!-- Bottom Row: 3 Panels -->
      <section class="bottom-panels-grid">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>Root Cause Taxonomy</h3>
              <span>Classified by 62 post-mortems</span>
            </div>
          </div>
          <div class="taxonomy-list">
            <div class="taxonomy-item">
              <div class="taxonomy-meta">
                <span class="taxonomy-name">Database Connection Pool</span>
                <span class="taxonomy-val" style="color:#00d2ff;">48 (35%)</span>
              </div>
              <div class="taxonomy-track">
                <div class="taxonomy-fill" style="width: 35%; background: #00d2ff;"></div>
              </div>
            </div>
            <div class="taxonomy-item">
              <div class="taxonomy-meta">
                <span class="taxonomy-name">Deployment / Bad Config</span>
                <span class="taxonomy-val" style="color:#3b82f6;">32 (23%)</span>
              </div>
              <div class="taxonomy-track">
                <div class="taxonomy-fill" style="width: 23%; background: #3b82f6;"></div>
              </div>
            </div>
            <div class="taxonomy-item">
              <div class="taxonomy-meta">
                <span class="taxonomy-name">High CPU & Thread Starvation</span>
                <span class="taxonomy-val" style="color:#a855f7;">26 (19%)</span>
              </div>
              <div class="taxonomy-track">
                <div class="taxonomy-fill" style="width: 19%; background: #a855f7;"></div>
              </div>
            </div>
            <div class="taxonomy-item">
              <div class="taxonomy-meta">
                <span class="taxonomy-name">Memory Leaks / OOM</span>
                <span class="taxonomy-val" style="color:#f97316;">18 (13%)</span>
              </div>
              <div class="taxonomy-track">
                <div class="taxonomy-fill" style="width: 13%; background: #f97316;"></div>
              </div>
            </div>
            <div class="taxonomy-item">
              <div class="taxonomy-meta">
                <span class="taxonomy-name">Network Timeout & Latency</span>
                <span class="taxonomy-val" style="color:#ef4444;">14 (10%)</span>
              </div>
              <div class="taxonomy-track">
                <div class="taxonomy-fill" style="width: 10%; background: #ef4444;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>MTTR Velocity Trend</h3>
              <span>4-Week progression (Faster is better)</span>
            </div>
            <span class="header-pill" style="color:#34d399; font-size:0.65rem; border-color:rgba(16,185,129,0.3);">
              ↓ 46% Overall
            </span>
          </div>
          <div class="mttr-velocity-svg-wrap" id="mttr-velocity-chart"></div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title-block">
              <h3>Resolution Health</h3>
              <span>Closed vs In-Flight stats</span>
            </div>
          </div>
          <div class="donut-wrap" style="padding-top: 0.2rem;">
            <div class="donut-svg-box" style="width: 100px; height: 100px;">
              <div id="resolution-health-donut" style="width:100%; height:100%;"></div>
              <div class="donut-center-text">
                <span class="donut-center-val" style="font-size:1.05rem; color:#10b981;">94%</span>
                <span class="donut-center-lbl" style="font-size:0.55rem;">SLA HEALTH</span>
              </div>
            </div>
            <div class="donut-legend-grid" style="font-size:0.68rem; margin-top:-0.2rem;">
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#10b981;"></span> Auto-Cured</div>
                <span class="legend-val">232</span>
              </div>
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#3b82f6;"></span> Sync</div>
                <span class="legend-val">12</span>
              </div>
              <div class="legend-row">
                <div class="legend-dot-label"><span class="legend-dot" style="background:#ef4444;"></span> Sev Escal</div>
                <span class="legend-val">4</span>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; width:100%; font-size:0.65rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:0.4rem;">
              <span>SLA Compliance: <strong>99.4%</strong></span>
              <span style="color:var(--accent-cyan); font-weight:600;">SRE Policies 🛡️</span>
            </div>
          </div>
        </div>
      </section>
    `;

    this.app.renderKpiSparklines();
    this.app.renderCharts();
    this.app.renderTriageTable();
    this.app.renderAiInsights();
  }

  renderRcaView(container) {
    const inc = this.app.selectedIncident || INCIDENTS_DATA[0];
    
    // Check if stages are in progress or completed
    const stages = [
      { id: 1, name: "Collecting telemetry", status: "completed" },
      { id: 2, name: "Analyzing errors", status: "completed" },
      { id: 3, name: "Checking dependencies", status: "completed" },
      { id: 4, name: "Checking recent deployments", status: "completed" },
      { id: 5, name: "Checking metrics", status: "completed" },
      { id: 6, name: "Searching Incident Memory", status: "completed" },
      { id: 7, name: "Comparing historical incidents", status: "completed" },
      { id: 8, name: "Generating root-cause hypotheses", status: "completed" }
    ];

    container.innerHTML = `
      <div class="view-container rca-workspace">
        <!-- Top Workspace Bar & Incident Selector -->
        <div class="view-header">
          <div class="view-title-block">
            <h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00d2ff"><path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/></svg>
              AI Root-Cause Investigation Workspace
            </h2>
            <p>Multi-stage diagnostic correlation across telemetry, eBPF distributed traces, and vector memory</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="scenario-selector" style="background:var(--bg-card); border:1px solid var(--border-card);">
              <span class="scenario-label" style="font-size:0.68rem; color:var(--text-muted);">INCIDENT:</span>
              <select class="scenario-select" id="rca-incident-select" style="font-size:0.75rem; font-weight:700;">
                ${INCIDENTS_DATA.map(i => `
                  <option value="${i.id}" ${i.id === inc.id ? 'selected' : ''}>${i.id}: ${i.title.substring(0, 32)}...</option>
                `).join('')}
              </select>
            </div>
            <button class="btn-launch-copilot" id="btn-re-run-investigation" style="width:auto; padding:0.35rem 0.85rem;">
              Re-Run AI Investigation ⚡
            </button>
          </div>
        </div>

        <!-- 1. INCIDENT OVERVIEW (OBSERVED DATA) -->
        <div class="panel-card">
          <div class="rca-section-title-wrap">
            <div class="rca-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Incident Overview
            </div>
            <span class="badge-category badge-observed-data">Observed Data</span>
          </div>

          <div class="overview-meta-grid">
            <div class="overview-meta-item">
              <span class="overview-meta-label">Incident ID</span>
              <span class="overview-meta-value" style="color:var(--accent-cyan);">${inc.id}</span>
            </div>
            <div class="overview-meta-item" style="grid-column: span 2;">
              <span class="overview-meta-label">Incident Title</span>
              <span class="overview-meta-value" style="font-size:0.78rem;">${inc.title}</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Service</span>
              <span class="overview-meta-value">${inc.service}</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Environment</span>
              <span class="overview-meta-value">${inc.region} (Prod)</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Severity</span>
              <span class="overview-meta-value" style="color:${inc.sevClass === 'critical' ? '#ef4444' : '#f97316'};">${inc.severity}</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Status</span>
              <span class="overview-meta-value" id="rca-incident-status-display" style="color:${inc.statusDotColor};">${inc.status}</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Detected Time</span>
              <span class="overview-meta-value" style="font-size:0.72rem;">09:32:15 UTC (14m ago)</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Affected Users</span>
              <span class="overview-meta-value" style="color:#38bdf8;">24,850 active</span>
            </div>
            <div class="overview-meta-item">
              <span class="overview-meta-label">Error Rate</span>
              <span class="overview-meta-value" id="rca-error-rate-display" style="color:#ef4444;">${inc.metrics.errorRate}</span>
            </div>
          </div>
        </div>

        <!-- 2. AI INVESTIGATION TIMELINE (8 STAGES) -->
        <div class="panel-card">
          <div class="rca-section-title-wrap">
            <div class="rca-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              AI Investigation Timeline (8 Stages)
            </div>
            <span class="badge-category badge-ai-analysis">AI Analysis Pipeline</span>
          </div>

          <div class="investigation-stepper-box">
            <div class="stages-grid" id="rca-stages-grid">
              ${stages.map(s => `
                <div class="stage-step-card stage-step-${s.id}">
                  <span class="stage-step-name">
                    <span class="stage-num-badge">${s.id}</span>
                    ${s.name}
                  </span>
                  <span class="stage-status-badge stage-status-${s.status}">
                    ${s.status === 'completed' ? '✓ Completed' : s.status === 'running' ? '<div class="spinner-icon"></div> Running' : 'Pending'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3. DETECTED SYMPTOMS & 4. POSSIBLE ROOT CAUSES -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
          <!-- DETECTED SYMPTOMS (Observed Data) -->
          <div class="panel-card">
            <div class="rca-section-title-wrap">
              <div class="rca-section-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Detected Symptoms
              </div>
              <span class="badge-category badge-observed-data">Observed Data</span>
            </div>

            <div class="symptoms-grid">
              <div class="symptom-chip">
                <span class="symptom-icon">⚠️</span>
                <div>HTTP 503 increased <span style="font-size:0.68rem; color:#ef4444;">(+42.8% surge)</span></div>
              </div>
              <div class="symptom-chip">
                <span class="symptom-icon">⏱️</span>
                <div>Database timeout increased <span style="font-size:0.68rem; color:#f97316;">(>4,500ms latency)</span></div>
              </div>
              <div class="symptom-chip">
                <span class="symptom-icon">📈</span>
                <div>P99 Latency increased <span style="font-size:0.68rem; color:#ef4444;">(45ms → 4,820ms)</span></div>
              </div>
              <div class="symptom-chip">
                <span class="symptom-icon">🔒</span>
                <div>Connection pool reached 96% <span style="font-size:0.68rem; color:#a855f7;">(10,240 sockets capped)</span></div>
              </div>
            </div>
          </div>

          <!-- POSSIBLE ROOT CAUSES (AI Analysis) -->
          <div class="panel-card">
            <div class="rca-section-title-wrap">
              <div class="rca-section-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Possible Root Causes
              </div>
              <span class="badge-category badge-ai-analysis">AI Probabilistic Analysis</span>
            </div>

            <div style="font-size:0.68rem; color:var(--text-muted); margin-bottom:0.5rem; font-style:italic;">
              Note: The AI presents causal hypotheses probabilistically based on telemetry signals — these are not guaranteed facts.
            </div>

            <div class="hypotheses-list">
              <!-- Hypothesis 1 -->
              <div class="hypothesis-card">
                <div class="hypothesis-header">
                  <span class="hypothesis-title">1. Database connection pool exhaustion & socket leak</span>
                  <span class="hypothesis-confidence">Confidence: 87%</span>
                </div>
                <div class="hypothesis-bar-track">
                  <div class="hypothesis-bar-fill" style="width: 87%; background:linear-gradient(90deg, #6366f1, #a855f7);"></div>
                </div>
              </div>

              <!-- Hypothesis 2 -->
              <div class="hypothesis-card">
                <div class="hypothesis-header">
                  <span class="hypothesis-title">2. Recent configuration change in ASP.NET DI middleware</span>
                  <span class="hypothesis-confidence" style="color:#a855f7;">Confidence: 61%</span>
                </div>
                <div class="hypothesis-bar-track">
                  <div class="hypothesis-bar-fill" style="width: 61%; background:linear-gradient(90deg, #3b82f6, #6366f1);"></div>
                </div>
              </div>

              <!-- Hypothesis 3 -->
              <div class="hypothesis-card">
                <div class="hypothesis-header">
                  <span class="hypothesis-title">3. Downstream PostgreSQL gateway network timeout</span>
                  <span class="hypothesis-confidence" style="color:#94a3b8;">Confidence: 32%</span>
                </div>
                <div class="hypothesis-bar-track">
                  <div class="hypothesis-bar-fill" style="width: 32%; background:#64748b;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. SUPPORTING EVIDENCE (Observed Data with Explicit Sources) -->
        <div class="panel-card">
          <div class="rca-section-title-wrap">
            <div class="rca-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              Supporting Evidence
            </div>
            <span class="badge-category badge-observed-data">Observed Data</span>
          </div>

          <div class="evidence-grid">
            <div class="evidence-card">
              <span class="evidence-source-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                Database telemetry
              </span>
              <div class="evidence-content">47 timeout errors recorded in <code>pg_stat_activity</code> within 60 seconds</div>
            </div>

            <div class="evidence-card">
              <span class="evidence-source-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                Application telemetry
              </span>
              <div class="evidence-content">503 Service Unavailable errors increased by 42.8% on payment-api workers</div>
            </div>

            <div class="evidence-card">
              <span class="evidence-source-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Deployment telemetry
              </span>
              <div class="evidence-content">Canary deployment build <code>v3.4.12b</code> occurred 18 minutes before incident</div>
            </div>

            <div class="evidence-card">
              <span class="evidence-source-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                Incident Memory
              </span>
              <div class="evidence-content"><strong>INC-8120</strong> has similar symptoms with 96% vector similarity match</div>
            </div>
          </div>
        </div>

        <!-- 6. RECOMMENDED INVESTIGATION & 7. RECOMMENDED ACTION -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
          <!-- RECOMMENDED INVESTIGATION (AI Recommendation) -->
          <div class="panel-card">
            <div class="rca-section-title-wrap">
              <div class="rca-section-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                Recommended Investigation
              </div>
              <span class="badge-category badge-ai-recommendation">AI Recommendation</span>
            </div>

            <div class="investigation-steps-list">
              <div class="investigation-step-item">
                <span class="step-check-icon">✓</span>
                <span>1. Check active database connections via pg_stat_activity</span>
              </div>
              <div class="investigation-step-item">
                <span class="step-check-icon">✓</span>
                <span>2. Compare connection pool configuration against singleton lifecycle</span>
              </div>
              <div class="investigation-step-item">
                <span class="step-check-icon">✓</span>
                <span>3. Inspect recent deployment commit #a8f9c1d for unclosed client instances</span>
              </div>
              <div class="investigation-step-item">
                <span class="step-check-icon">✓</span>
                <span>4. Check database timeout and socket buffer allocation logs</span>
              </div>
              <div class="investigation-step-item">
                <span class="step-check-icon">✓</span>
                <span>5. Compare with historical incident INC-8120 resolution notes</span>
              </div>
            </div>
          </div>

          <!-- RECOMMENDED ACTION (Human Verification Required) -->
          <div class="panel-card">
            <div class="rca-section-title-wrap">
              <div class="rca-section-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                Recommended Action
              </div>
              <span class="badge-category badge-ai-recommendation">Requires Human Verification</span>
            </div>

            <div class="action-box-wrap">
              <p class="action-notice-text">
                <strong>AI Recommendation:</strong> Apply hotfix <code>HF-9042-1</code> to inject <code>ICosmosClientFactory</code> as Singleton and perform rolling restart of AKS checkout pods.
              </p>
              <div style="font-size:0.72rem; color:#fbbf24; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); border-radius:4px; padding:0.45rem 0.65rem;">
                ⚠️ <strong>Human Verification Required:</strong> The AI model presents root causes as prioritized probabilistic hypotheses. Always review supporting evidence before approving automated remediation.
              </div>

              <!-- Action Buttons Toolbar -->
              <div class="action-buttons-toolbar">
                <button class="btn-rca-action" id="btn-rca-view-evidence">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  View Evidence
                </button>
                <button class="btn-rca-action" id="btn-rca-view-similar">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle></svg>
                  View Similar Incidents
                </button>
                <button class="btn-rca-action" id="btn-rca-view-timeline">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  View Incident Timeline
                </button>
                <button class="btn-rca-action btn-rca-primary" id="btn-rca-approve-investigation">
                  ✓ Approve Investigation
                </button>
                <button class="btn-rca-action btn-rca-resolve" id="btn-rca-resolve-incident">
                  ⚡ Resolve Incident
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 1. Incident switcher dropdown in RCA
    document.getElementById('rca-incident-select')?.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const targetInc = INCIDENTS_DATA.find(i => i.id === selectedId);
      if (targetInc) {
        this.app.selectedIncident = targetInc;
        this.renderRcaView(container);
        toast.show({
          title: `Selected ${targetInc.id}`,
          message: `Loaded AI investigation workspace for ${targetInc.title}`,
          type: "azure"
        });
      }
    });

    // 2. Re-Run AI Investigation Animation (cycling 8 stages)
    document.getElementById('btn-re-run-investigation')?.addEventListener('click', () => {
      this.runInvestigationSequence();
    });

    // 3. View Evidence Modal
    document.getElementById('btn-rca-view-evidence')?.addEventListener('click', () => {
      this.openRcaEvidenceModal(inc);
    });

    // 4. View Similar Incidents Modal
    document.getElementById('btn-rca-view-similar')?.addEventListener('click', () => {
      this.openRcaSimilarModal(inc);
    });

    // 5. View Incident Timeline Modal
    document.getElementById('btn-rca-view-timeline')?.addEventListener('click', () => {
      this.openRcaTimelineModal(inc);
    });

    // 6. Approve Investigation
    document.getElementById('btn-rca-approve-investigation')?.addEventListener('click', () => {
      toast.show({
        title: "Investigation Approved",
        message: `Engineer Alex Chen confirmed hypotheses and supporting evidence for ${inc.id}.`,
        type: "success"
      });
    });

    // 7. Resolve Incident
    document.getElementById('btn-rca-resolve-incident')?.addEventListener('click', () => {
      inc.status = "Resolved";
      inc.statusDotColor = "#10b981";
      inc.metrics.errorRate = "0.01%";

      const statusEl = document.getElementById('rca-incident-status-display');
      if (statusEl) {
        statusEl.textContent = "Resolved";
        statusEl.style.color = "#10b981";
      }

      const errEl = document.getElementById('rca-error-rate-display');
      if (errEl) {
        errEl.textContent = "0.01%";
        errEl.style.color = "#10b981";
      }

      toast.show({
        title: "Incident Resolved",
        message: `${inc.id} hotfix verified. Sockets returned to baseline and error rate cleared.`,
        type: "success",
        duration: 5000
      });
    });
  }

  runInvestigationSequence() {
    const stageNames = [
      "Collecting telemetry",
      "Analyzing errors",
      "Checking dependencies",
      "Checking recent deployments",
      "Checking metrics",
      "Searching Incident Memory",
      "Comparing historical incidents",
      "Generating root-cause hypotheses"
    ];

    const stagesGrid = document.getElementById('rca-stages-grid');
    if (!stagesGrid) return;

    // Reset all to pending
    stagesGrid.innerHTML = stageNames.map((name, idx) => `
      <div class="stage-step-card stage-step-${idx + 1}">
        <span class="stage-step-name">
          <span class="stage-num-badge">${idx + 1}</span>
          ${name}
        </span>
        <span class="stage-status-badge stage-status-pending" id="stage-badge-${idx + 1}">Pending</span>
      </div>
    `).join('');

    let current = 0;
    const interval = setInterval(() => {
      if (current < stageNames.length) {
        // Set current to running
        const badge = document.getElementById(`stage-badge-${current + 1}`);
        if (badge) {
          badge.className = 'stage-status-badge stage-status-running';
          badge.innerHTML = '<div class="spinner-icon"></div> Running';
        }

        // Set previous to completed
        if (current > 0) {
          const prevBadge = document.getElementById(`stage-badge-${current}`);
          if (prevBadge) {
            prevBadge.className = 'stage-status-badge stage-status-completed';
            prevBadge.innerHTML = '✓ Completed';
          }
        }
        current++;
      } else {
        // Complete last stage
        const lastBadge = document.getElementById(`stage-badge-${stageNames.length}`);
        if (lastBadge) {
          lastBadge.className = 'stage-status-badge stage-status-completed';
          lastBadge.innerHTML = '✓ Completed';
        }
        clearInterval(interval);

        toast.show({
          title: "Investigation Complete",
          message: "All 8 telemetry and vector memory stages evaluated.",
          type: "success"
        });
      }
    }, 450);
  }

  openRcaEvidenceModal(inc) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="evidence-modal-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; color:#fff; display:flex; align-items:center; gap:0.5rem;">
              <span class="badge-category badge-observed-data">Observed Data</span>
              Telemetry Evidence Log: ${inc.id}
            </h3>
            <button class="ctrl-btn" id="evidence-modal-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem; max-height:360px; overflow-y:auto;">
            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-sm); border-left:3px solid var(--accent-cyan);">
              <strong style="color:var(--accent-cyan); font-size:0.75rem;">[Source: Database Telemetry]</strong>
              <div style="font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; margin-top:3px;">
                SELECT pid, query_start, state, query FROM pg_stat_activity WHERE state != 'idle';<br/>
                -> Result: 47 queries in state 'waiting for connection socket' (>4500ms). Max connections 10,240 reached.
              </div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-sm); border-left:3px solid #38bdf8;">
              <strong style="color:#38bdf8; font-size:0.75rem;">[Source: Application Telemetry]</strong>
              <div style="font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; margin-top:3px;">
                HTTP /api/v2/checkout/process -> Response 503 Service Unavailable (42.8% error rate across 18 pods).
              </div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.75rem; border-radius:var(--radius-sm); border-left:3px solid #a855f7;">
              <strong style="color:#a855f7; font-size:0.75rem;">[Source: Deployment Telemetry]</strong>
              <div style="font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; margin-top:3px;">
                Git commit #a8f9c1d: 'feat: add dynamic tenant header routing' deployed 18m ago via GitHub Actions pipeline.
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-launch-copilot" id="evidence-modal-done" style="width:auto; padding:0.35rem 1rem;">Close Evidence</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('evidence-modal-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('evidence-modal-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('evidence-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'evidence-modal-backdrop') modalMount.innerHTML = '';
    });
  }

  openRcaSimilarModal(inc) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="similar-modal-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; color:#fff;">Historical Vector Matches for ${inc.id}</h3>
            <button class="ctrl-btn" id="similar-modal-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;">
            <div style="background:var(--bg-card-inner); border:1px solid var(--border-card); padding:0.75rem; border-radius:var(--radius-sm); border-left:3px solid #00d2ff;">
              <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.8rem;">
                <span style="color:var(--accent-cyan);">INC-8120: Connection Pool Exhaustion on Redis / Postgres</span>
                <span class="badge-category badge-ai-analysis">96% Semantic Match</span>
              </div>
              <p style="font-size:0.74rem; color:var(--text-dim); margin:4px 0;">Resolved 3 months ago · MTTR 18 mins</p>
              <div style="font-size:0.74rem; color:#34d399;"><strong>Applied Fix:</strong> Injected Singleton DI factory lifecycle.</div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-launch-copilot" id="similar-modal-done" style="width:auto; padding:0.35rem 1rem;">Done</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('similar-modal-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('similar-modal-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('similar-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'similar-modal-backdrop') modalMount.innerHTML = '';
    });
  }

  openRcaTimelineModal(inc) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="timeline-modal-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; color:#fff;">Chronological Incident Timeline: ${inc.id}</h3>
            <button class="ctrl-btn" id="timeline-modal-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; max-height:320px; overflow-y:auto; font-size:0.75rem;">
            <div style="padding:0.4rem 0.6rem; background:var(--bg-card-inner); border-radius:4px; border-left:3px solid #3b82f6;">
              <strong style="color:#93c5fd;">08:28:00 UTC</strong> — Canary deployment build v3.4.12b promoted to 25% traffic
            </div>
            <div style="padding:0.4rem 0.6rem; background:var(--bg-card-inner); border-radius:4px; border-left:3px solid #fb923c;">
              <strong style="color:#fdba74;">08:35:12 UTC</strong> — Ephemeral socket exhaustion alert (80% threshold crossed)
            </div>
            <div style="padding:0.4rem 0.6rem; background:var(--bg-card-inner); border-radius:4px; border-left:3px solid #ef4444;">
              <strong style="color:#fca5a5;">08:42:15 UTC</strong> — Sev-1 declared: HTTP 503 error rate reached 42.8%
            </div>
            <div style="padding:0.4rem 0.6rem; background:var(--bg-card-inner); border-radius:4px; border-left:3px solid #a855f7;">
              <strong style="color:#d8b4fe;">08:44:30 UTC</strong> — AI Root-Cause Investigation completed (87% confidence on connection pool leak)
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-launch-copilot" id="timeline-modal-done" style="width:auto; padding:0.35rem 1rem;">Done</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('timeline-modal-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('timeline-modal-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('timeline-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'timeline-modal-backdrop') modalMount.innerHTML = '';
    });
  }

  renderGraphView(container) {
    // Import memory data
    import('../data/incidentMemoryData.js').then(({ INCIDENT_MEMORY_DATA }) => {
      this.initIncidentMemoryWorkspace(container, INCIDENT_MEMORY_DATA);
    });
  }

  initIncidentMemoryWorkspace(container, memoryData) {
    let currentMemories = [...memoryData];
    let selectedService = "all";
    let selectedSeverity = "all";
    let selectedEnv = "all";
    let selectedTag = "all";
    let searchQuery = "";
    let highlightedIncidentId = "INC-0192";

    const render = () => {
      // Filter memories
      let filtered = currentMemories.filter(item => {
        const q = searchQuery.toLowerCase();
        const matchesQuery = !q ||
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.symptoms.toLowerCase().includes(q) ||
          item.errorPattern.toLowerCase().includes(q) ||
          item.rootCause.toLowerCase().includes(q) ||
          item.solution.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q));

        const matchesService = selectedService === 'all' || item.service === selectedService;
        const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;
        const matchesEnv = selectedEnv === 'all' || item.environment.includes(selectedEnv);
        const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);

        return matchesQuery && matchesService && matchesSeverity && matchesEnv && matchesTag;
      });

      container.innerHTML = `
        <div class="view-container memory-repo-container">
          <!-- Top Header -->
          <div class="view-header">
            <div class="view-title-block">
              <h2>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                DevOps Incident Memory & Knowledge Graph
              </h2>
              <p>Searchable organizational memory capturing symptoms, root causes, proven solutions, and dependency graphs</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-launch-copilot" id="btn-create-knowledge-top" style="width:auto; padding:0.35rem 0.85rem;">
                + Add to Incident Memory 💾
              </button>
            </div>
          </div>

          <!-- Interactive Visual Incident Knowledge Graph -->
          <div class="panel-card">
            <div class="rca-section-title-wrap">
              <div class="rca-section-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Incident Knowledge Graph (Relationships & Causal Chains)
              </div>
              <span class="badge-category badge-ai-analysis">Interactive Topological Memory</span>
            </div>

            <div class="knowledge-graph-box">
              <div class="kg-legend-bar">
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#00d2ff;"></span> Incidents</span>
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#a855f7;"></span> Services</span>
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#ef4444;"></span> Errors</span>
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#f59e0b;"></span> Root Causes</span>
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#10b981;"></span> Solutions</span>
                <span class="kg-legend-chip"><span class="legend-dot" style="background:#64748b;"></span> Dependencies</span>
              </div>

              <svg viewBox="0 0 740 340" style="width:100%; height:100%;">
                <!-- Connected Relationships Flow: INC-0192 -> Payment API -> Database Timeout -> Connection Pool Exhaustion -> HTTP 503 -> Solution: Increase Pool -->
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0,210,255,0.6)" />
                  </marker>
                </defs>

                <!-- Edges -->
                <line x1="90" y1="170" x2="210" y2="100" stroke="#00d2ff" stroke-width="2" marker-end="url(#arrow)" />
                <line x1="90" y1="170" x2="210" y2="240" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
                <line x1="210" y1="100" x2="350" y2="70" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)" />
                <line x1="350" y1="70" x2="490" y2="100" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
                <line x1="350" y1="70" x2="350" y2="180" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)" />
                <line x1="490" y1="100" x2="630" y2="100" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)" />
                <line x1="210" y1="100" x2="210" y2="20" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 3" />

                <!-- Flowing Packet Animation -->
                <circle r="4" fill="#00d2ff">
                  <animateMotion path="M 90 170 L 210 100 L 350 70 L 490 100 L 630 100" dur="2.5s" repeatCount="indefinite" />
                </circle>

                <!-- Node 1: INC-0192 (Incident) -->
                <g class="kg-node" data-type="incident" data-id="INC-0192" style="cursor:pointer;">
                  <rect x="20" y="145" width="130" height="50" rx="8" fill="#070c17" stroke="#00d2ff" stroke-width="2" />
                  <text x="85" y="168" fill="#00d2ff" font-size="11" font-weight="800" text-anchor="middle">INC-0192</text>
                  <text x="85" y="184" fill="#cbd5e1" font-size="8.5" text-anchor="middle">DB Conn Failure</text>
                </g>

                <!-- Node 2: Payment API (Service) -->
                <g class="kg-node" data-type="service" data-name="Payment Gateway API" style="cursor:pointer;">
                  <rect x="150" y="75" width="125" height="48" rx="8" fill="#070c17" stroke="#a855f7" stroke-width="2" />
                  <text x="212" y="98" fill="#c084fc" font-size="10.5" font-weight="700" text-anchor="middle">Payment API</text>
                  <text x="212" y="113" fill="#8b9bb4" font-size="8" text-anchor="middle">Service Mesh</text>
                </g>

                <!-- Node 3: Database Timeout (Error) -->
                <g class="kg-node" data-type="error" data-name="Database Timeout (>4500ms)" style="cursor:pointer;">
                  <rect x="290" y="45" width="125" height="48" rx="8" fill="#070c17" stroke="#ef4444" stroke-width="2" />
                  <text x="352" y="68" fill="#f87171" font-size="10" font-weight="700" text-anchor="middle">Database Timeout</text>
                  <text x="352" y="83" fill="#8b9bb4" font-size="8" text-anchor="middle">>4,500ms query latency</text>
                </g>

                <!-- Node 4: HTTP 503 (Error) -->
                <g class="kg-node" data-type="error" data-name="HTTP 503 Surge" style="cursor:pointer;">
                  <rect x="290" y="155" width="125" height="48" rx="8" fill="#070c17" stroke="#ef4444" stroke-width="1.5" />
                  <text x="352" y="178" fill="#f87171" font-size="10" font-weight="700" text-anchor="middle">HTTP 503 Error</text>
                  <text x="352" y="193" fill="#8b9bb4" font-size="8" text-anchor="middle">Checkout API 42.8%</text>
                </g>

                <!-- Node 5: Connection Pool Exhaustion (Root Cause) -->
                <g class="kg-node" data-type="rootcause" data-name="Connection Pool Exhaustion" style="cursor:pointer;">
                  <rect x="430" y="75" width="130" height="48" rx="8" fill="#070c17" stroke="#f59e0b" stroke-width="2" />
                  <text x="495" y="98" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Pool Exhaustion</text>
                  <text x="495" y="113" fill="#8b9bb4" font-size="8" text-anchor="middle">10,240 Sockets Max</text>
                </g>

                <!-- Node 6: Solution: Increase Pool (Solution) -->
                <g class="kg-node" data-type="solution" data-name="Increase Connection Pool +128" style="cursor:pointer;">
                  <rect x="575" y="75" width="145" height="48" rx="8" fill="#070c17" stroke="#10b981" stroke-width="2.5" />
                  <text x="647" y="98" fill="#34d399" font-size="10" font-weight="800" text-anchor="middle">Solution: Increase Pool</text>
                  <text x="647" y="113" fill="#cbd5e1" font-size="8" text-anchor="middle">+128 Sockets & Singleton DI</text>
                </g>

                <!-- Node 7: Dependency PgBouncer (Dependency) -->
                <g class="kg-node" data-type="dependency" data-name="PgBouncer Connection Pooler" style="cursor:pointer;">
                  <rect x="155" y="3" width="115" height="36" rx="6" fill="#070c17" stroke="#64748b" stroke-width="1.5" />
                  <text x="212" y="24" fill="#94a3b8" font-size="9" text-anchor="middle">PgBouncer Pooler</text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Knowledge Gap Detection Card -->
          <div class="knowledge-gap-card">
            <div class="gap-header">
              <div class="gap-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                KNOWLEDGE GAP DETECTED
              </div>
              <span class="badge-not-configured" style="background:rgba(239,68,68,0.2);">Novel Operational Failure</span>
            </div>
            <p style="font-size:0.82rem; color:#fca5a5; margin-bottom:0.75rem;">
              No similar historical solution was found. This incident appears to contain new operational knowledge.
            </p>
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <strong style="color:#fff; font-size:0.85rem;">INC-0291 · Auth Token Ingress</strong>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">Symptoms: OAuth2 PKCE Token validation failure during cross-region key rotation</div>
              </div>
              <button class="btn-integ-action" id="btn-create-investigation-record" style="background:linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color:#fff; border:none; font-weight:600; padding:0.4rem 0.9rem;">
                + Create Investigation Record
              </button>
            </div>
            
            <!-- Continuous Learning Analytics -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-top:1rem;">
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.6rem; border-radius:4px; text-align:center;">
                <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Knowledge Gaps</div>
                <div style="font-size:1.15rem; font-weight:800; color:#ef4444; font-family:var(--font-mono);">14</div>
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.6rem; border-radius:4px; text-align:center;">
                <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Knowledge Reused</div>
                <div style="font-size:1.15rem; font-weight:800; color:#10b981; font-family:var(--font-mono);">37</div>
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.6rem; border-radius:4px; text-align:center;">
                <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">New Knowledge</div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--accent-cyan); font-family:var(--font-mono);">14</div>
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.6rem; border-radius:4px; text-align:center;">
                <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Historical Solutions</div>
                <div style="font-size:1.15rem; font-weight:800; color:#a855f7; font-family:var(--font-mono);">37</div>
              </div>
            </div>
          </div>

          <!-- Similar Incidents Radar Comparison -->
          <div class="similar-radar-panel">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.8rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#a855f7"><path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/></svg>
                Current Incident Context Similarity Radar
              </span>
              <span class="header-pill" style="color:var(--accent-cyan);">Active: INC-9042</span>
            </div>

            <div class="similar-scores-grid">
              <div class="similar-score-card btn-focus-incident" data-id="INC-0192">
                <div>
                  <strong style="color:var(--accent-cyan); font-size:0.8rem;">INC-0192</strong>
                  <div style="font-size:0.68rem; color:var(--text-dim);">Database Connection Failure</div>
                </div>
                <span class="header-pill" style="color:#00d2ff; font-weight:800;">94% similar</span>
              </div>

              <div class="similar-score-card btn-focus-incident" data-id="INC-0174">
                <div>
                  <strong style="color:#a855f7; font-size:0.8rem;">INC-0174</strong>
                  <div style="font-size:0.68rem; color:var(--text-dim);">PostgreSQL Deadlock</div>
                </div>
                <span class="header-pill" style="color:#a855f7; font-weight:800;">81% similar</span>
              </div>

              <div class="similar-score-card btn-focus-incident" data-id="INC-0132">
                <div>
                  <strong style="color:#f97316; font-size:0.8rem;">INC-0132</strong>
                  <div style="font-size:0.68rem; color:var(--text-dim);">Memory Leak & OOMCrash</div>
                </div>
                <span class="header-pill" style="color:#f97316; font-weight:800;">73% similar</span>
              </div>
            </div>
          </div>

          <!-- Search & Filter Controls Toolbar -->
          <div class="memory-filter-toolbar">
            <div style="display:flex; gap:0.5rem;">
              <div class="header-search" style="max-width:100%;">
                <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="memory-search-input" value="${searchQuery}" placeholder="Search knowledge base (e.g., 'database timeout', 'payment failure', 'HTTP 503', 'high CPU', 'deployment error')..." />
              </div>
            </div>

            <!-- Multi-Dimensional Filters -->
            <div class="filter-controls-row">
              <select class="form-select" id="filter-service">
                <option value="all">All Services</option>
                <option value="Payment Gateway API" ${selectedService === 'Payment Gateway API' ? 'selected' : ''}>Payment Gateway API</option>
                <option value="Primary PostgreSQL" ${selectedService === 'Primary PostgreSQL' ? 'selected' : ''}>Primary PostgreSQL</option>
                <option value="User Auth Service" ${selectedService === 'User Auth Service' ? 'selected' : ''}>User Auth Service</option>
                <option value="Azure Front Door" ${selectedService === 'Azure Front Door' ? 'selected' : ''}>Azure Front Door</option>
              </select>

              <select class="form-select" id="filter-severity">
                <option value="all">All Severities</option>
                <option value="CRITICAL" ${selectedSeverity === 'CRITICAL' ? 'selected' : ''}>CRITICAL (P0/P1)</option>
                <option value="HIGH" ${selectedSeverity === 'HIGH' ? 'selected' : ''}>HIGH (P2)</option>
                <option value="LOW" ${selectedSeverity === 'LOW' ? 'selected' : ''}>LOW (P3/P4)</option>
              </select>

              <select class="form-select" id="filter-env">
                <option value="all">All Environments</option>
                <option value="Production" ${selectedEnv === 'Production' ? 'selected' : ''}>Production</option>
                <option value="Canary" ${selectedEnv === 'Canary' ? 'selected' : ''}>Canary</option>
              </select>

              <select class="form-select" id="filter-rootcause">
                <option value="all">All Root Causes</option>
                <option value="pool">Connection Pool Exhaustion</option>
                <option value="memory">Memory Leak / OOM</option>
                <option value="deadlock">Deadlock</option>
                <option value="throttling">Rate Limit Throttling</option>
              </select>
            </div>

            <!-- Tag Pills -->
            <div class="memory-tag-pills-row">
              <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">TAGS:</span>
              <button class="memory-tag-pill ${selectedTag === 'all' ? 'active' : ''}" data-tag="all">All</button>
              <button class="memory-tag-pill ${selectedTag === 'database' ? 'active' : ''}" data-tag="database">database</button>
              <button class="memory-tag-pill ${selectedTag === 'payment' ? 'active' : ''}" data-tag="payment">payment</button>
              <button class="memory-tag-pill ${selectedTag === 'production' ? 'active' : ''}" data-tag="production">production</button>
              <button class="memory-tag-pill ${selectedTag === 'timeout' ? 'active' : ''}" data-tag="timeout">timeout</button>
              <button class="memory-tag-pill ${selectedTag === 'auth' ? 'active' : ''}" data-tag="auth">auth</button>
              <button class="memory-tag-pill ${selectedTag === 'memory' ? 'active' : ''}" data-tag="memory">memory</button>
              <button class="memory-tag-pill ${selectedTag === 'high CPU' ? 'active' : ''}" data-tag="high CPU">high CPU</button>
            </div>
          </div>

          <!-- Incidents Cards or Knowledge Gap State -->
          ${filtered.length === 0 ? `
            <div class="knowledge-gap-card">
              <div class="knowledge-gap-icon">📂</div>
              <div class="knowledge-gap-title">No Historical Solution Found (Knowledge Gap)</div>
              <p class="knowledge-gap-desc">
                No indexed runbook matches your search query "<strong>${searchQuery}</strong>". You can record and document this novel incident into organizational memory.
              </p>
              <button class="btn-launch-copilot" id="btn-create-knowledge-gap" style="width:auto; padding:0.45rem 1.2rem;">
                + Create New Knowledge
              </button>
            </div>
          ` : `
            <div class="incident-memory-grid">
              ${filtered.map(item => {
                const isHighlight = item.id === highlightedIncidentId;
                return `
                  <div class="memory-card ${isHighlight ? 'highlight-similar' : ''}" data-id="${item.id}">
                    <div>
                      <div class="memory-card-header">
                        <div>
                          <span class="memory-card-id">${item.id}</span>
                          <h3 class="memory-card-title">${item.title}</h3>
                        </div>
                        <span class="sev-tag sev-tag-${item.severity === 'CRITICAL' ? 'critical' : item.severity === 'HIGH' ? 'high' : 'low'}">${item.severity}</span>
                      </div>
                      
                      <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.5rem;">
                        ${item.service} · ${item.environment}
                      </div>

                      <div class="memory-detail-block">
                        <div>
                          <span class="memory-detail-label" style="color:#ef4444;">Root Cause:</span>
                          <div class="memory-detail-text">${item.rootCause}</div>
                        </div>
                        <div style="margin-top:4px;">
                          <span class="memory-detail-label" style="color:#10b981;">Solution:</span>
                          <div class="memory-detail-text" style="color:#34d399;">${item.solution}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div class="memory-meta-footer" style="margin-bottom:0.4rem;">
                        <span>Resolution: <strong>${item.resolutionTime}</strong></span>
                        <div class="memory-tags-list">
                          ${item.tags.map(t => `<span class="memory-tag-pill" style="padding:1px 5px; font-size:0.62rem;">${t}</span>`).join('')}
                        </div>
                      </div>

                      <div class="memory-card-actions">
                        <button class="btn-table-action btn-view-incident-memory" data-id="${item.id}">View Incident</button>
                        <button class="btn-table-action btn-view-solution-memory" data-id="${item.id}" style="color:#34d399; border-color:rgba(16,185,129,0.3);">View Solution</button>
                        <button class="btn-table-action btn-view-related-memory" data-id="${item.id}">View Related Incidents</button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      `;

      // Event Handlers for Knowledge Graph
      container.querySelectorAll('.kg-node').forEach(node => {
        node.addEventListener('click', () => {
          const type = node.getAttribute('data-type');
          const name = node.getAttribute('data-name') || node.getAttribute('data-id');
          toast.show({
            title: `Knowledge Graph Node: ${type.toUpperCase()}`,
            message: `Inspecting topological entity "${name}" in Incident Memory mesh.`,
            type: "azure"
          });
        });
      });

      // Search input
      const searchInput = container.querySelector('#memory-search-input');
      searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });

      // Filter dropdowns
      container.querySelector('#filter-service')?.addEventListener('change', (e) => {
        selectedService = e.target.value;
        render();
      });

      container.querySelector('#filter-severity')?.addEventListener('change', (e) => {
        selectedSeverity = e.target.value;
        render();
      });

      container.querySelector('#filter-env')?.addEventListener('change', (e) => {
        selectedEnv = e.target.value;
        render();
      });

      // Tag pills
      container.querySelectorAll('.memory-tag-pill[data-tag]').forEach(pill => {
        pill.addEventListener('click', () => {
          selectedTag = pill.getAttribute('data-tag');
          render();
        });
      });

      // Focus incident from similar radar
      container.querySelectorAll('.btn-focus-incident').forEach(btn => {
        btn.addEventListener('click', () => {
          highlightedIncidentId = btn.getAttribute('data-id');
          searchQuery = highlightedIncidentId;
          render();
        });
      });

      // View Incident button
      container.querySelectorAll('.btn-view-incident-memory').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = currentMemories.find(m => m.id === id);
          if (item) this.openIncidentMemoryDetailsModal(item);
        });
      });

      // View Solution button
      container.querySelectorAll('.btn-view-solution-memory').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = currentMemories.find(m => m.id === id);
          if (item) this.openSolutionModal(item);
        });
      });

      // View Related Incidents button
      container.querySelectorAll('.btn-view-related-memory').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = currentMemories.find(m => m.id === id);
          if (item) this.openRelatedIncidentsModal(item, currentMemories);
        });
      });

      // Create Knowledge buttons
      container.querySelector('#btn-create-investigation-record')?.addEventListener('click', () => {
        this.openCreateKnowledgeModal(currentMemories, () => render());
      });

      container.querySelector('#btn-create-knowledge-top')?.addEventListener('click', () => {
        this.openCreateKnowledgeModal(currentMemories, () => render());
      });

      container.querySelector('#btn-create-knowledge-gap')?.addEventListener('click', () => {
        this.openCreateKnowledgeModal(currentMemories, () => render());
      });
    };

    render();
  }

  openIncidentMemoryDetailsModal(item) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="mem-detail-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="sev-tag sev-tag-${item.severity === 'CRITICAL' ? 'critical' : item.severity === 'HIGH' ? 'high' : 'low'}">${item.severity}</span>
                <span style="font-family:var(--font-mono); font-weight:800; color:var(--accent-cyan); font-size:1.05rem;">${item.id}</span>
              </div>
              <h2 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-top:4px;">${item.title}</h2>
              <div style="font-size:0.72rem; color:var(--text-dim);">${item.service} · ${item.environment} · Resolved in ${item.resolutionTime}</div>
            </div>
            <button class="ctrl-btn" id="mem-detail-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem; font-size:0.76rem; line-height:1.45;">
            <div style="background:var(--bg-card-inner); padding:0.65rem; border-radius:var(--radius-sm); border-left:3px solid #00d2ff;">
              <strong style="color:var(--accent-cyan); display:block; margin-bottom:2px;">SYMPTOMS</strong>
              <div style="color:#e2e8f0;">${item.symptoms}</div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.65rem; border-radius:var(--radius-sm); border-left:3px solid #f97316;">
              <strong style="color:#fb923c; display:block; margin-bottom:2px;">ERROR PATTERN / LOGS</strong>
              <div style="font-family:var(--font-mono); font-size:0.72rem; color:#fed7aa;">${item.errorPattern}</div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.65rem; border-radius:var(--radius-sm); border-left:3px solid #ef4444;">
              <strong style="color:#f87171; display:block; margin-bottom:2px;">ISOLATED ROOT CAUSE</strong>
              <div style="color:#fecaca;">${item.rootCause}</div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.65rem; border-radius:var(--radius-sm); border-left:3px solid #10b981;">
              <strong style="color:#34d399; display:block; margin-bottom:2px;">VERIFIED SOLUTION</strong>
              <div style="color:#a7f3d0;">${item.solution}</div>
            </div>

            <div style="background:var(--bg-card-inner); padding:0.65rem; border-radius:var(--radius-sm); border-left:3px solid #a855f7;">
              <strong style="color:#c084fc; display:block; margin-bottom:2px;">PREVENTION & SRE SAFEGUARDS</strong>
              <div style="color:#e9d5ff;">${item.prevention}</div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:0.75rem;">
            <div style="font-size:0.7rem; color:var(--text-muted);">
              Indexed on ${item.createdDate}
            </div>
            <button class="btn-launch-copilot" id="mem-detail-done" style="width:auto; padding:0.35rem 1rem;">Close</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mem-detail-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('mem-detail-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('mem-detail-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'mem-detail-backdrop') modalMount.innerHTML = '';
    });
  }

  openSolutionModal(item) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="sol-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.05rem; color:#fff;">🛡️ Verified Solution Runbook: ${item.id}</h3>
            <button class="ctrl-btn" id="sol-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;">
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-sm); padding:0.75rem;">
              <strong style="color:#34d399; font-size:0.78rem;">Immediate Solution:</strong>
              <p style="font-size:0.76rem; color:#fff; margin-top:2px;">${item.solution}</p>
            </div>

            <div style="background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.3); border-radius:var(--radius-sm); padding:0.75rem;">
              <strong style="color:#c084fc; font-size:0.78rem;">Long-Term Prevention:</strong>
              <p style="font-size:0.76rem; color:#fff; margin-top:2px;">${item.prevention}</p>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn-launch-copilot" id="sol-apply" style="width:auto; padding:0.35rem 1rem;">Apply Runbook ⚡</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('sol-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('sol-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'sol-backdrop') modalMount.innerHTML = '';
    });
    document.getElementById('sol-apply')?.addEventListener('click', () => {
      modalMount.innerHTML = '';
      toast.show({
        title: `Applied Solution from ${item.id}`,
        message: "Automated remediation executed and verified.",
        type: "success"
      });
    });
  }

  openRelatedIncidentsModal(item, allMemories) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    const related = allMemories.filter(m => item.relatedIncidents?.includes(m.id));

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="rel-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.05rem; color:#fff;">🔗 Related Incidents to ${item.id}</h3>
            <button class="ctrl-btn" id="rel-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.65rem; margin-bottom:1rem;">
            ${related.map(r => `
              <div style="background:var(--bg-card-inner); border:1px solid var(--border-card); padding:0.75rem; border-radius:var(--radius-sm);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:var(--accent-cyan); font-size:0.82rem;">${r.id}: ${r.title}</strong>
                  <span class="header-pill" style="color:#00d2ff; font-weight:800;">${r.similarityScore}% Similar</span>
                </div>
                <div style="font-size:0.72rem; color:var(--text-dim); margin-top:2px;">Root Cause: ${r.rootCause}</div>
                <div style="font-size:0.72rem; color:#34d399; margin-top:2px;">Fix: ${r.solution}</div>
              </div>
            `).join('')}
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-launch-copilot" id="rel-done" style="width:auto; padding:0.35rem 1rem;">Done</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('rel-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('rel-done')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('rel-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'rel-backdrop') modalMount.innerHTML = '';
    });
  }

  openCreateKnowledgeModal(currentMemories, onSaveCallback) {
    const modalMount = document.getElementById('modal-mount');
    if (!modalMount) return;

    modalMount.innerHTML = `
      <div class="modal-backdrop" id="create-kn-backdrop">
        <div class="modal-content-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; color:#fff;">💾 Save to Organizational Incident Memory</h3>
            <button class="ctrl-btn" id="create-kn-close">&times;</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label">Incident ID & Title</label>
              <div style="display:grid; grid-template-columns:120px 1fr; gap:0.5rem;">
                <input type="text" class="form-input" id="new-kn-id" value="INC-${Math.floor(1000 + Math.random() * 9000)}" />
                <input type="text" class="form-input" id="new-kn-title" placeholder="e.g. Memory Leak in Redis Session Cache" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
              <div class="form-group">
                <label class="form-label">Service</label>
                <input type="text" class="form-input" id="new-kn-service" value="Payment Gateway API" />
              </div>
              <div class="form-group">
                <label class="form-label">Severity</label>
                <select class="form-select" id="new-kn-severity">
                  <option value="CRITICAL">CRITICAL (Sev-1)</option>
                  <option value="HIGH">HIGH (Sev-2)</option>
                  <option value="MEDIUM">MEDIUM (Sev-3)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Observed Symptoms & Error Pattern</label>
              <input type="text" class="form-input" id="new-kn-symptoms" placeholder="e.g. HTTP 504 surge and socket timeouts" />
            </div>

            <div class="form-group">
              <label class="form-label">Isolated Root Cause</label>
              <textarea class="form-input" id="new-kn-rootcause" rows="2" placeholder="e.g. Ephemeral port exhaustion caused by non-singleton client lifecycle"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Verified Solution</label>
              <textarea class="form-input" id="new-kn-solution" rows="2" placeholder="e.g. Inject singleton DI factory and rolling pod restart"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Long-Term Prevention & Safeguards</label>
              <input type="text" class="form-input" id="new-kn-prevention" placeholder="e.g. Added CI/CD liveness socket analyzer gate" />
            </div>

            <div class="form-group">
              <label class="form-label">Tags (comma separated)</label>
              <input type="text" class="form-input" id="new-kn-tags" value="database, payment, production" />
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="ctrl-btn" id="create-kn-cancel">Cancel</button>
            <button class="btn-launch-copilot" id="create-kn-save" style="width:auto; padding:0.35rem 1.2rem;">
              Save to Incident Memory 💾
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('create-kn-close')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('create-kn-cancel')?.addEventListener('click', () => { modalMount.innerHTML = ''; });
    document.getElementById('create-kn-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'create-kn-backdrop') modalMount.innerHTML = '';
    });

    document.getElementById('create-kn-save')?.addEventListener('click', () => {
      const id = document.getElementById('new-kn-id')?.value || "INC-9999";
      const title = document.getElementById('new-kn-title')?.value || "Custom Incident";
      const service = document.getElementById('new-kn-service')?.value || "Payment Gateway API";
      const severity = document.getElementById('new-kn-severity')?.value || "CRITICAL";
      const symptoms = document.getElementById('new-kn-symptoms')?.value || "Observed latency spike";
      const rootCause = document.getElementById('new-kn-rootcause')?.value || "Configuration drift";
      const solution = document.getElementById('new-kn-solution')?.value || "Applied hotfix patch";
      const prevention = document.getElementById('new-kn-prevention')?.value || "Added proactive alerts";
      const tags = (document.getElementById('new-kn-tags')?.value || "production").split(',').map(t => t.trim());

      const newRecord = {
        id,
        title,
        service,
        environment: "Production (US-East-1)",
        symptoms,
        errorPattern: "Kubelet telemetry alert / socket exception",
        rootCause,
        solution,
        prevention,
        resolutionTime: "15 minutes",
        severity,
        tags,
        createdDate: new Date().toISOString(),
        resolvedDate: new Date().toISOString(),
        similarityScore: 90,
        relatedIncidents: ["INC-0192"]
      };

      currentMemories.unshift(newRecord);
      modalMount.innerHTML = '';
      toast.show({
        title: `Saved ${id} to Incident Memory`,
        message: "Indexed into organizational vector repository.",
        type: "success"
      });

      if (onSaveCallback) onSaveCallback();
    });
  }

  renderPatternView(container) {
    import('../data/patternMatchingData.js').then(({ incidentDNAPatterns }) => {
      this.initPatternMatchingWorkspace(container, incidentDNAPatterns);
    }).catch(err => {
      console.error("Error loading patternMatchingData:", err);
      container.innerHTML = `<div class="p-4 text-red-500">Failed to load Pattern Matching dataset.</div>`;
    });
  }

  initPatternMatchingWorkspace(container, dataset) {
    let currentIncidentIndex = 0;

    const render = () => {
      const activeData = dataset[currentIncidentIndex] || dataset[0];
      const sigs = activeData.signals;
      const rec = activeData.recurringAlert;

      container.innerHTML = `
        <div class="view-container pattern-workspace-container">
          <!-- View Header & Purpose Banner -->
          <div class="view-header">
            <div class="view-title-block">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                Pattern Matching Engine: “Have We Seen This Problem Before?”
              </h2>
              <p>Multi-signal vector comparison across 12 telemetry dimensions to detect historical recurrence and prevent duplicate post-mortems</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
              <span class="heuristic-disclaimer-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Demo Heuristic Engine: Composite 12-Signal Vector Scoring
              </span>
              <div class="filter-group-item" style="margin:0;">
                <select id="pattern-incident-select" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.75rem; background:var(--bg-card); font-weight:700;">
                  ${dataset.map((inc, idx) => `
                    <option value="${idx}" ${idx === currentIncidentIndex ? 'selected' : ''}>Active Target: ${inc.id} (${inc.service})</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- RECURRING PATTERN DETECTED ALERT -->
          ${rec && rec.detected ? `
            <div class="recurring-pattern-alert">
              <div class="recurring-alert-top">
                <div class="recurring-alert-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <span>${rec.title}</span>
                </div>
                <span style="font-size:0.72rem; font-weight:700; color:#ef4444; background:rgba(239,68,68,0.15); padding:0.2rem 0.55rem; border-radius:9999px; border:1px solid rgba(239,68,68,0.3);">
                  ${rec.riskLevel}
                </span>
              </div>

              <!-- Pattern Sequence Flow -->
              <div class="recurring-chain-flow">
                <span style="font-size:0.72rem; color:var(--text-dim); margin-right:0.4rem; font-weight:700;">DETECTED PATTERN:</span>
                ${rec.path.map((step, sIdx) => `
                  <span class="recurring-node-pill">${step}</span>
                  ${sIdx < rec.path.length - 1 ? '<span class="recurring-arrow">➔</span>' : ''}
                `).join('')}
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; font-size:0.76rem;">
                <span style="color:var(--text-dim);"><strong style="color:var(--text-main);">Frequency:</strong> ${rec.frequency}</span>
                <span style="color:#6ee7b7;"><strong style="color:#fff;">Recommended Action:</strong> ${rec.recommendation}</span>
              </div>
            </div>
          ` : ''}

          <!-- INCIDENT DNA SIGNATURE PANEL (12 SIGNALS) -->
          <div class="dna-header-card">
            <div class="dna-header-top">
              <div class="dna-title-wrap">
                <div class="dna-badge-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <div>
                  <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0; display:flex; align-items:center; gap:0.5rem;">
                    INCIDENT DNA SIGNATURE — <span style="color:var(--accent-cyan); font-family:var(--font-mono);">${activeData.id}</span>
                  </h3>
                  <p style="font-size:0.72rem; color:var(--text-dim); margin:2px 0 0 0;">
                    ${activeData.title} • Detected ${activeData.detectedTime}
                  </p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.4rem;">
                <span class="header-pill" style="color:#ef4444; font-weight:700;">${activeData.severity}</span>
                <span class="header-pill" style="color:var(--accent-cyan); font-weight:700;">${activeData.environment}</span>
              </div>
            </div>

            <!-- 12 Signal Dimensions Grid -->
            <div class="dna-signal-grid">
              <!-- Signal 1: Service -->
              <div class="dna-signal-item purple-sig">
                <span class="dna-signal-label">
                  <span>1. Service Target</span>
                  <span style="color:#a855f7;">SVC</span>
                </span>
                <span class="dna-signal-value">${sigs.service}</span>
              </div>

              <!-- Signal 2: Error Message -->
              <div class="dna-signal-item alert-sig">
                <span class="dna-signal-label">
                  <span>2. Error Message</span>
                  <span style="color:#ef4444;">ERR</span>
                </span>
                <span class="dna-signal-value" style="font-family:var(--font-mono); font-size:0.72rem;">${sigs.errorMessage}</span>
              </div>

              <!-- Signal 3: HTTP Status -->
              <div class="dna-signal-item alert-sig">
                <span class="dna-signal-label">
                  <span>3. HTTP Status</span>
                  <span style="color:#ef4444;">HTTP</span>
                </span>
                <span class="dna-signal-value" style="font-family:var(--font-mono);">${sigs.httpStatus}</span>
              </div>

              <!-- Signal 4: Dependencies -->
              <div class="dna-signal-item warn-sig">
                <span class="dna-signal-label">
                  <span>4. Dependencies</span>
                  <span style="color:#f59e0b;">DEP</span>
                </span>
                <span class="dna-signal-value">${sigs.dependency}</span>
              </div>

              <!-- Signal 5: Root Cause -->
              <div class="dna-signal-item warn-sig">
                <span class="dna-signal-label">
                  <span>5. Root Cause Pattern</span>
                  <span style="color:#f59e0b;">RCA</span>
                </span>
                <span class="dna-signal-value">${sigs.rootCause}</span>
              </div>

              <!-- Signal 6: Logs Signature -->
              <div class="dna-signal-item alert-sig">
                <span class="dna-signal-label">
                  <span>6. Log Trace Pattern</span>
                  <span style="color:#ef4444;">LOG</span>
                </span>
                <span class="dna-signal-value" style="font-family:var(--font-mono); font-size:0.72rem;">${sigs.logs}</span>
              </div>

              <!-- Signal 7: Deployment Info -->
              <div class="dna-signal-item purple-sig">
                <span class="dna-signal-label">
                  <span>7. Deployment Delta</span>
                  <span style="color:#a855f7;">CI/CD</span>
                </span>
                <span class="dna-signal-value">${sigs.deployment}</span>
              </div>

              <!-- Signal 8: Metrics -->
              <div class="dna-signal-item emerald-sig">
                <span class="dna-signal-label">
                  <span>8. Metrics Anomaly</span>
                  <span style="color:#10b981;">TELEMETRY</span>
                </span>
                <span class="dna-signal-value" style="font-size:0.73rem;">${sigs.metrics}</span>
              </div>

              <!-- Signal 9: Environment -->
              <div class="dna-signal-item">
                <span class="dna-signal-label">
                  <span>9. Environment</span>
                  <span style="color:var(--accent-cyan);">ENV</span>
                </span>
                <span class="dna-signal-value">${sigs.environment}</span>
              </div>

              <!-- Signal 10: Symptoms -->
              <div class="dna-signal-item warn-sig">
                <span class="dna-signal-label">
                  <span>10. Incident Symptoms</span>
                  <span style="color:#f59e0b;">SYMPTOMS</span>
                </span>
                <span class="dna-signal-value">${sigs.symptoms}</span>
              </div>

              <!-- Signal 11: Time Patterns -->
              <div class="dna-signal-item purple-sig">
                <span class="dna-signal-label">
                  <span>11. Time & Load Pattern</span>
                  <span style="color:#a855f7;">TEMPORAL</span>
                </span>
                <span class="dna-signal-value">${sigs.timePattern}</span>
              </div>

              <!-- Signal 12: Tags -->
              <div class="dna-signal-item emerald-sig">
                <span class="dna-signal-label">
                  <span>12. Domain Tags</span>
                  <span style="color:#10b981;">TAGS</span>
                </span>
                <div class="dna-tags-wrap">
                  ${sigs.tags.map(t => `<span class="memory-tag-badge">#${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- HISTORICAL SIMILARITY COMPARISON (94%, 81%, 73%) -->
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
              <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0; display:flex; align-items:center; gap:0.4rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Historical Match Radar: Multi-Signal Similarity Breakdown
              </h3>
              <span style="font-size:0.72rem; color:var(--text-dim);">
                Matches compared against 155k indexed post-mortems across 12 signal dimensions
              </span>
            </div>

            <div class="pattern-matches-grid">
              ${activeData.matches.map(match => `
                <div class="pattern-match-card">
                  <!-- Match Header -->
                  <div class="pattern-match-top">
                    <div>
                      <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:2px;">
                        <strong style="font-family:var(--font-mono); color:var(--accent-cyan); font-size:0.85rem;">${match.id}</strong>
                        <span class="header-pill" style="font-size:0.68rem; padding:0.1rem 0.4rem;">${match.service}</span>
                        <span class="header-pill" style="font-size:0.68rem; padding:0.1rem 0.4rem; color:#ef4444;">${match.severity}</span>
                      </div>
                      <h4 style="font-size:0.88rem; font-weight:700; color:var(--text-main); margin:0;">${match.title}</h4>
                      <span style="font-size:0.7rem; color:var(--text-dim); display:block; margin-top:2px;">
                        Resolved in <strong>${match.resolutionTime}</strong> on ${match.date}
                      </span>
                    </div>
                    <div class="pattern-match-score-badge ${match.similarity >= 90 ? 'high-match' : ''}">
                      <span>${match.similarity}%</span>
                      <span style="font-size:0.68rem; font-weight:600; opacity:0.85;">SIMILAR</span>
                    </div>
                  </div>

                  <!-- Why It Matches Breakdown -->
                  <div>
                    <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-dim); display:block; margin-bottom:4px;">
                      WHY IT MATCHES (MULTI-SIGNAL BREAKDOWN):
                    </span>
                    <div class="matched-signals-list">
                      ${match.matchedSignals.map(sig => `
                        <div class="matched-signal-badge">
                          <span class="matched-signal-check">+</span>
                          <strong style="color:var(--text-main);">${sig.name} matches:</strong>
                          <span style="color:var(--text-dim);">${sig.detail}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Summary of Past Root Cause -->
                  <div style="font-size:0.74rem; background:rgba(245,158,11,0.06); padding:0.5rem 0.65rem; border-radius:var(--radius-xs); border:1px solid rgba(245,158,11,0.2);">
                    <strong style="color:#fbbf24; display:block; margin-bottom:2px;">Historical Root Cause:</strong>
                    <span style="color:var(--text-main);">${match.rootCause}</span>
                  </div>

                  <!-- Actions -->
                  <div class="pattern-card-actions">
                    <button class="btn-ai-pill btn-ai-pill-secondary btn-pattern-view-inc" data-inc="${match.id}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      View Incident
                    </button>
                    <button class="btn-ai-pill btn-ai-pill-secondary btn-pattern-view-rca" data-inc="${match.id}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      View Root Cause
                    </button>
                    <button class="btn-ai-pill btn-ai-pill-primary btn-pattern-view-sol" data-inc="${match.id}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      View Previous Solution
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- PATTERN TIMELINE (ACROSS WEEKS & MONTHS) -->
          <div class="pattern-timeline-section">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0; display:flex; align-items:center; gap:0.4rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Pattern Timeline & Recurrence History Across Deployments
                </h3>
                <p style="font-size:0.72rem; color:var(--text-dim); margin:2px 0 0 0;">
                  Tracking recurring failure signatures across development sprints and production release cycles
                </p>
              </div>
              <span class="header-pill" style="color:var(--accent-cyan);">4 Incidents in Pattern Cluster</span>
            </div>

            <div class="timeline-track">
              ${activeData.timeline.map(item => `
                <div class="timeline-step-node ${item.status === 'Active' ? 'active-step' : ''}" data-inc="${item.incidentId}">
                  <span class="timeline-node-period">${item.period}</span>
                  <div style="display:flex; align-items:center; justify-content:space-between;">
                    <span class="timeline-node-id">${item.incidentId}</span>
                    <span style="font-size:0.68rem; font-weight:700; color:${item.status === 'Active' ? '#ef4444' : '#34d399'};">
                      ${item.status === 'Active' ? '● ACTIVE' : '✓ ' + item.resolutionTime}
                    </span>
                  </div>
                  <span class="timeline-node-title">${item.title}</span>
                  <span class="timeline-node-tag">${item.patternTag}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Event Listeners
      const selectEl = document.getElementById('pattern-incident-select');
      if (selectEl) {
        selectEl.addEventListener('change', (e) => {
          currentIncidentIndex = parseInt(e.target.value, 10);
          render();
        });
      }

      // Action Handlers
      container.querySelectorAll('.btn-pattern-view-inc').forEach(btn => {
        btn.addEventListener('click', () => {
          const incId = btn.getAttribute('data-inc');
          const matched = activeData.matches.find(m => m.id === incId);
          if (matched) {
            this.showIncidentDetailModal(matched);
          }
        });
      });

      container.querySelectorAll('.btn-pattern-view-rca').forEach(btn => {
        btn.addEventListener('click', () => {
          const incId = btn.getAttribute('data-inc');
          const matched = activeData.matches.find(m => m.id === incId);
          if (matched) {
            this.showRootCauseDetailModal(matched);
          }
        });
      });

      container.querySelectorAll('.btn-pattern-view-sol').forEach(btn => {
        btn.addEventListener('click', () => {
          const incId = btn.getAttribute('data-inc');
          const matched = activeData.matches.find(m => m.id === incId);
          if (matched) {
            this.showPreviousSolutionModal(matched);
          }
        });
      });

      container.querySelectorAll('.timeline-step-node').forEach(node => {
        node.addEventListener('click', () => {
          const incId = node.getAttribute('data-inc');
          toast.show({
            title: `Timeline Node: ${incId}`,
            message: `Inspecting historical recurrence milestone for ${incId}.`,
            type: "info"
          });
        });
      });
    };

    render();
  }

  showIncidentDetailModal(match) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 560px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:var(--accent-cyan); font-weight:800; font-family:var(--font-mono);">${match.id}</span>
            <h3 style="font-size:1.05rem; font-weight:800; margin:0; color:var(--text-main);">${match.title}</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--bg-surface); padding:0.65rem; border-radius:var(--radius-sm); border:1px solid var(--border-card);">
            <div><span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase;">Service:</span> <strong style="font-size:0.78rem; display:block;">${match.service}</strong></div>
            <div><span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase;">Severity:</span> <strong style="font-size:0.78rem; color:#ef4444; display:block;">${match.severity}</strong></div>
            <div><span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase;">Resolution Time:</span> <strong style="font-size:0.78rem; color:#34d399; display:block;">${match.resolutionTime}</strong></div>
            <div><span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase;">Historical Date:</span> <strong style="font-size:0.78rem; display:block;">${match.date}</strong></div>
          </div>

          <div>
            <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-dim);">Matched Telemetry Signals:</span>
            <div class="matched-signals-list" style="margin-top:4px;">
              ${match.matchedSignals.map(s => `
                <div class="matched-signal-badge">
                  <span class="matched-signal-check">✓</span>
                  <strong>${s.name}:</strong> ${s.detail}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showRootCauseDetailModal(match) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:#f59e0b; font-weight:800;">ROOT CAUSE DIAGNOSIS</span>
            <h3 style="font-size:1rem; font-weight:800; margin:0; color:var(--text-main);">${match.id}</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#fbbf24; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Identified Technical Root Cause:</strong>
            <p style="font-size:0.82rem; color:var(--text-main); margin:0; line-height:1.4;">${match.rootCause}</p>
          </div>
          <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#34d399; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Long-Term Architectural Prevention:</strong>
            <p style="font-size:0.82rem; color:var(--text-main); margin:0; line-height:1.4;">${match.prevention}</p>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showPreviousSolutionModal(match) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:#10b981; font-weight:800;">VERIFIED RUNBOOK & SOLUTION</span>
            <h3 style="font-size:1rem; font-weight:800; margin:0; color:var(--text-main);">${match.id}</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#34d399; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Proven Solution Applied (Resolved in ${match.resolutionTime}):</strong>
            <p style="font-size:0.84rem; color:var(--text-main); margin:0; line-height:1.4;">${match.solution}</p>
          </div>

          <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.75rem;">
            <strong style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:4px;">Automated Remediation Script:</strong>
            <pre style="background:rgba(0,0,0,0.3); padding:0.6rem; border-radius:var(--radius-xs); font-family:var(--font-mono); font-size:0.72rem; color:#6ee7b7; overflow-x:auto; margin:0;">
# Apply PgBouncer Connection Pool Ceiling Hotfix
kubectl set env deployment/payment-gateway-v3 DB_POOL_MAX=500 DB_IDLE_TIMEOUT=30s
kubectl rollout restart deployment/payment-gateway-v3 -n production</pre>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn-ai-pill btn-ai-pill-primary btn-apply-now">Apply Hotfix Pipeline</button>
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.querySelector('.btn-apply-now').addEventListener('click', () => {
      toast.show({
        title: `Hotfix Applied from ${match.id}`,
        message: "Triggered automated hotfix pipeline and container rollout.",
        type: "success"
      });
      close();
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  renderLogsView(container) {
    import('../data/observabilityData.js').then(({ structuredLogsData, traceWaterfallData, serviceDependenciesData }) => {
      this.initObservabilityWorkspace(container, {
        logs: structuredLogsData,
        traces: traceWaterfallData,
        dependencies: serviceDependenciesData
      });
    }).catch(err => {
      console.error("Error loading observabilityData:", err);
      container.innerHTML = `<div class="p-4 text-red-500">Failed to load Observability dataset.</div>`;
    });
  }

  initObservabilityWorkspace(container, data) {
    let activeTab = 'logs'; // 'logs' | 'traces' | 'dependencies'
    let searchQuery = '';
    let selectedSeverity = 'all';
    let selectedService = 'all';
    let selectedTime = 'all';
    let isStreamLive = true;
    let selectedTraceId = 'trace-7f9a2b01c4d9';
    let logsList = [...data.logs];

    const render = () => {
      container.innerHTML = `
        <div class="view-container">
          <!-- Top Header -->
          <div class="view-header">
            <div class="view-title-block">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                Observability Investigation: Logs, Traces & Dependencies
              </h2>
              <p>Unified telemetry stream compatible with Azure Monitor, Application Insights, and OpenTelemetry standards</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="header-pill" style="color:var(--accent-cyan);">Cluster: AKS-Alpha</span>
              <span class="header-pill" style="color:#10b981;">Telemetry: OpenTelemetry v1.28</span>
            </div>
          </div>

          <!-- Main 3 Tabs Navigation -->
          <div class="obs-tabs-nav">
            <button class="obs-tab-btn ${activeTab === 'logs' ? 'active' : ''}" data-tab="logs">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              1. Structured Logs <span style="font-size:0.7rem; opacity:0.8;">(${logsList.length})</span>
            </button>
            <button class="obs-tab-btn ${activeTab === 'traces' ? 'active' : ''}" data-tab="traces">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              2. Distributed Traces
            </button>
            <button class="obs-tab-btn ${activeTab === 'dependencies' ? 'active' : ''}" data-tab="dependencies">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              3. Service Dependencies
            </button>
          </div>

          <!-- TAB 1: STRUCTURED LOGS -->
          ${activeTab === 'logs' ? `
            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <!-- Controls Bar -->
              <div class="obs-controls-bar">
                <div class="obs-controls-left">
                  <!-- Search -->
                  <div style="position:relative; min-width:240px;">
                    <input type="text" id="obs-log-search" class="form-input" style="width:100%; padding-left:2rem; font-size:0.76rem;" placeholder="Search logs, messages, trace IDs..." value="${searchQuery}" />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2" style="position:absolute; left:0.65rem; top:50%; transform:translateY(-50%);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>

                  <!-- Severity Filter -->
                  <select id="obs-filter-severity" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.75rem;">
                    <option value="all" ${selectedSeverity === 'all' ? 'selected' : ''}>All Levels</option>
                    <option value="ERROR" ${selectedSeverity === 'ERROR' ? 'selected' : ''}>ERROR</option>
                    <option value="FATAL" ${selectedSeverity === 'FATAL' ? 'selected' : ''}>FATAL</option>
                    <option value="WARN" ${selectedSeverity === 'WARN' ? 'selected' : ''}>WARN</option>
                    <option value="INFO" ${selectedSeverity === 'INFO' ? 'selected' : ''}>INFO</option>
                  </select>

                  <!-- Service Filter -->
                  <select id="obs-filter-service" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.75rem;">
                    <option value="all" ${selectedService === 'all' ? 'selected' : ''}>All Services</option>
                    <option value="PaymentService" ${selectedService === 'PaymentService' ? 'selected' : ''}>PaymentService</option>
                    <option value="API Gateway" ${selectedService === 'API Gateway' ? 'selected' : ''}>API Gateway</option>
                    <option value="Database" ${selectedService === 'Database' ? 'selected' : ''}>Database (PostgreSQL)</option>
                    <option value="AuthService" ${selectedService === 'AuthService' ? 'selected' : ''}>AuthService</option>
                    <option value="Redis" ${selectedService === 'Redis' ? 'selected' : ''}>Redis</option>
                    <option value="Payment Gateway" ${selectedService === 'Payment Gateway' ? 'selected' : ''}>Payment Gateway</option>
                  </select>

                  <!-- Time Filter -->
                  <select id="obs-filter-time" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.75rem;">
                    <option value="all" ${selectedTime === 'all' ? 'selected' : ''}>All Time</option>
                    <option value="5m" ${selectedTime === '5m' ? 'selected' : ''}>Last 5 mins</option>
                    <option value="15m" ${selectedTime === '15m' ? 'selected' : ''}>Last 15 mins</option>
                    <option value="1h" ${selectedTime === '1h' ? 'selected' : ''}>Last 1 hour</option>
                  </select>
                </div>

                <div class="obs-controls-right">
                  <button class="ctrl-btn" id="btn-toggle-stream-live" style="color:${isStreamLive ? '#34d399' : '#f59e0b'};">
                    <span class="${isStreamLive ? 'stream-live-pulse' : ''}" style="width:7px; height:7px; background:${isStreamLive ? '#10b981' : '#f59e0b'}; display:inline-block; border-radius:50%;"></span>
                    ${isStreamLive ? 'Pause Stream' : 'Resume Live'}
                  </button>
                  <button class="ctrl-btn" id="btn-clear-obs-logs">Clear Logs</button>
                </div>
              </div>

              <!-- Structured Logs Table -->
              <div class="structured-logs-container">
                <table class="structured-logs-table">
                  <thead>
                    <tr>
                      <th style="width:110px;">Timestamp</th>
                      <th style="width:80px;">Level</th>
                      <th style="width:140px;">Service</th>
                      <th>Message</th>
                      <th style="width:160px;">Trace ID</th>
                      <th style="width:130px;">Request ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${getFilteredLogs().length > 0 ? getFilteredLogs().map(log => `
                      <tr class="log-table-row" data-log-id="${log.id}">
                        <td style="font-family:var(--font-mono); color:var(--text-dim);">${log.timestamp}</td>
                        <td><span class="log-lvl-pill ${log.level}">${log.level}</span></td>
                        <td style="font-weight:700; color:var(--accent-cyan);">${log.service}</td>
                        <td style="color:var(--text-main); line-height:1.35;">${escapeHtml(log.message)}</td>
                        <td>
                          <span class="trace-id-pill btn-jump-trace" data-trace-id="${log.traceId}">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            ${log.traceId}
                          </span>
                        </td>
                        <td style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-dim);">${log.requestId}</td>
                      </tr>
                    `).join('') : `
                      <tr>
                        <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-dim);">
                          No logs found matching current filters.
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- TAB 2: DISTRIBUTED TRACES -->
          ${activeTab === 'traces' ? `
            <div class="trace-flow-container">
              <!-- Trace Selector & Summary -->
              <div class="obs-controls-bar">
                <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                  <span style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">SELECT TRACE:</span>
                  <select id="obs-trace-select" class="form-input" style="padding:0.35rem 0.65rem; font-size:0.76rem; font-weight:700; background:var(--bg-card);">
                    ${Object.keys(data.traces).map(tid => `
                      <option value="${tid}" ${tid === selectedTraceId ? 'selected' : ''}>
                        ${tid} — ${data.traces[tid].endpoint} (${data.traces[tid].status})
                      </option>
                    `).join('')}
                  </select>
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="header-pill" style="color:${getActiveTrace().status >= 500 ? '#ef4444' : '#34d399'}; font-weight:800;">
                    HTTP ${getActiveTrace().status} (${getActiveTrace().statusText})
                  </span>
                  <span class="header-pill" style="color:var(--accent-cyan);">Duration: ${getActiveTrace().totalDurationMs}ms</span>
                </div>
              </div>

              <!-- Request Trace Flow Diagram -->
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <span style="font-size:0.72rem; font-weight:800; color:var(--text-dim); text-transform:uppercase;">
                  DISTRIBUTED REQUEST FLOW (END-TO-END HOP TRACE):
                </span>
                <div class="trace-flow-diagram">
                  ${getActiveTrace().flowPath.map((step, sIdx) => `
                    <div class="trace-step-box ${step.status === 'failing' ? 'failing-step' : ''} ${step.status === 'error' ? 'error-step' : ''}">
                      <strong style="font-size:0.78rem; color:${step.status === 'failing' ? '#ef4444' : 'var(--text-main)'};">
                        ${step.node}
                      </strong>
                      <span style="font-size:0.68rem; color:var(--text-dim);">${step.latency}</span>
                      ${step.status === 'failing' ? `
                        <span style="font-size:0.65rem; color:#ef4444; font-weight:800; background:rgba(239,68,68,0.2); padding:1px 4px; border-radius:3px;">
                          FAILING COMPONENT
                        </span>
                      ` : ''}
                    </div>
                    ${sIdx < getActiveTrace().flowPath.length - 1 ? '<span class="trace-arrow-icon">➔</span>' : ''}
                  `).join('')}
                </div>
              </div>

              <!-- Waterfall Spans Breakdown -->
              <div class="panel-card">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                  <h3 style="font-size:0.9rem; font-weight:800; color:var(--text-main); margin:0;">
                    Span Execution Waterfall & Timing Breakdown
                  </h3>
                  <span style="font-size:0.7rem; color:var(--text-dim);">Trace Root: ${getActiveTrace().failingComponent}</span>
                </div>

                <table class="trace-spans-table">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border-card);">
                      <th style="padding:0.4rem 0.6rem; color:var(--text-dim); font-size:0.68rem;">SERVICE & OPERATION</th>
                      <th style="padding:0.4rem 0.6rem; color:var(--text-dim); font-size:0.68rem; width:120px;">STATUS</th>
                      <th style="padding:0.4rem 0.6rem; color:var(--text-dim); font-size:0.68rem; width:90px;">DURATION</th>
                      <th style="padding:0.4rem 0.6rem; color:var(--text-dim); font-size:0.68rem; width:300px;">TIMELINE (0ms → ${getActiveTrace().totalDurationMs}ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${getActiveTrace().spans.map(span => {
                      const leftPct = Math.min(100, (span.startOffsetMs / getActiveTrace().totalDurationMs) * 100);
                      const widthPct = Math.max(4, Math.min(100 - leftPct, (span.durationMs / getActiveTrace().totalDurationMs) * 100));
                      return `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                          <td style="padding:0.5rem 0.6rem;">
                            <strong style="color:var(--text-main); display:block; font-size:0.78rem;">${span.service}</strong>
                            <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-dim);">${span.operation}</span>
                            <p style="font-size:0.7rem; color:${span.hasError ? '#f87171' : 'var(--text-dim)'}; margin:2px 0 0 0;">${span.details}</p>
                          </td>
                          <td style="padding:0.5rem 0.6rem;">
                            <span class="log-lvl-pill ${span.hasError ? 'ERROR' : 'INFO'}">${span.status}</span>
                          </td>
                          <td style="padding:0.5rem 0.6rem; font-family:var(--font-mono); font-weight:700; color:${span.hasError ? '#ef4444' : 'var(--text-main)'};">
                            ${span.durationMs}ms
                          </td>
                          <td style="padding:0.5rem 0.6rem;">
                            <div class="span-bar-wrap">
                              <div class="span-bar-fill ${span.hasError ? 'error-fill' : ''}" style="left:${leftPct}%; width:${widthPct}%;"></div>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- TAB 3: SERVICE DEPENDENCIES -->
          ${activeTab === 'dependencies' ? `
            <div class="dep-tree-container">
              <!-- Parent Service Banner -->
              <div class="dep-parent-card">
                <div>
                  <div style="display:flex; align-items:center; gap:0.4rem;">
                    <span class="header-pill" style="color:#ef4444; font-weight:800;">${data.dependencies.status}</span>
                    <strong style="font-size:1.05rem; color:var(--text-main);">${data.dependencies.parentService}</strong>
                    <span style="font-size:0.72rem; color:var(--text-dim);">(${data.dependencies.version})</span>
                  </div>
                  <p style="font-size:0.74rem; color:var(--text-dim); margin:4px 0 0 0;">
                    Root Gateway for checkout, card tokenization, and transaction settlement • Uptime: ${data.dependencies.uptime}
                  </p>
                </div>
                <button class="btn-ai-pill btn-ai-pill-secondary btn-jump-logs-dep" data-dep="PaymentService">
                  Inspect Payment Logs
                </button>
              </div>

              <!-- Dependencies Hierarchy Display -->
              <div>
                <span style="font-size:0.72rem; font-weight:800; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:0.5rem;">
                  DEPENDENCY TOPOLOGY & HEALTH STATUS:
                </span>
                <div class="dep-children-grid">
                  ${data.dependencies.nodes.map(node => `
                    <div class="dep-node-card ${node.isFailing ? 'failing-dep' : ''}" data-dep-filter="${node.filterKey}">
                      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem;">
                        <div>
                          <strong style="font-size:0.85rem; color:var(--text-main); display:block;">${node.name}</strong>
                          <span style="font-size:0.68rem; color:var(--text-dim);">${node.type}</span>
                        </div>
                        <span class="log-lvl-pill ${node.status === 'CRITICAL' ? 'FATAL' : (node.status === 'DEGRADED' ? 'WARN' : 'INFO')}">
                          ${node.status}
                        </span>
                      </div>

                      <div class="dep-metrics-list">
                        <div><span style="color:var(--text-dim);">P99 Latency:</span> <strong style="color:${node.isFailing ? '#ef4444' : 'var(--text-main)'};">${node.latencyP99}</strong></div>
                        <div><span style="color:var(--text-dim);">Error Rate:</span> <strong style="color:${node.isFailing ? '#ef4444' : 'var(--text-main)'};">${node.errorRate}</strong></div>
                        <div><span style="color:var(--text-dim);">Connections:</span> <strong>${node.activeConnections}</strong></div>
                        <div><span style="color:var(--text-dim);">Throughput:</span> <strong>${node.throughput}</strong></div>
                      </div>

                      <p style="font-size:0.72rem; color:${node.isFailing ? '#f87171' : 'var(--text-dim)'}; margin:0; line-height:1.3;">
                        ${node.failureSummary}
                      </p>

                      <div style="display:flex; justify-content:flex-end; margin-top:auto; padding-top:0.4rem; border-top:1px solid var(--border-card);">
                        <span style="font-size:0.7rem; color:var(--accent-cyan); font-weight:700;">Filter Logs for ${node.filterKey} ➔</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;

      attachEventListeners();
    };

    const getFilteredLogs = () => {
      return logsList.filter(log => {
        const matchesSearch = !searchQuery || 
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.requestId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSeverity = selectedSeverity === 'all' || log.level === selectedSeverity;
        const matchesService = selectedService === 'all' || log.service.toLowerCase() === selectedService.toLowerCase();
        const matchesTime = selectedTime === 'all' || log.timeFilter === selectedTime;

        return matchesSearch && matchesSeverity && matchesService && matchesTime;
      });
    };

    const getActiveTrace = () => {
      return data.traces[selectedTraceId] || data.traces['trace-7f9a2b01c4d9'];
    };

    const escapeHtml = (str) => {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const attachEventListeners = () => {
      // Tab Switching
      container.querySelectorAll('.obs-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.getAttribute('data-tab');
          render();
        });
      });

      // Filter Handlers
      const searchEl = container.querySelector('#obs-log-search');
      if (searchEl) {
        searchEl.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          render();
          const newSearch = container.querySelector('#obs-log-search');
          if (newSearch) {
            newSearch.focus();
            newSearch.setSelectionRange(searchQuery.length, searchQuery.length);
          }
        });
      }

      const sevEl = container.querySelector('#obs-filter-severity');
      if (sevEl) {
        sevEl.addEventListener('change', (e) => {
          selectedSeverity = e.target.value;
          render();
        });
      }

      const svcEl = container.querySelector('#obs-filter-service');
      if (svcEl) {
        svcEl.addEventListener('change', (e) => {
          selectedService = e.target.value;
          render();
        });
      }

      const timeEl = container.querySelector('#obs-filter-time');
      if (timeEl) {
        timeEl.addEventListener('change', (e) => {
          selectedTime = e.target.value;
          render();
        });
      }

      // Stream Toggle
      const streamBtn = container.querySelector('#btn-toggle-stream-live');
      if (streamBtn) {
        streamBtn.addEventListener('click', () => {
          isStreamLive = !isStreamLive;
          toast.show({
            title: isStreamLive ? "Log Stream Resumed" : "Log Stream Paused",
            message: isStreamLive ? "Listening to live eBPF telemetry sockets." : "Buffer held at current timestamp snapshot.",
            type: isStreamLive ? "success" : "info"
          });
          render();
        });
      }

      // Clear Logs
      const clearBtn = container.querySelector('#btn-clear-obs-logs');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          logsList = [];
          toast.show({
            title: "Logs Cleared",
            message: "Local buffer purged. Waiting for new log packets.",
            type: "info"
          });
          render();
        });
      }

      // Trace Selector
      const traceSel = container.querySelector('#obs-trace-select');
      if (traceSel) {
        traceSel.addEventListener('change', (e) => {
          selectedTraceId = e.target.value;
          render();
        });
      }

      // Jump to Trace from Log Row or Button
      container.querySelectorAll('.btn-jump-trace').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-trace-id');
          if (tid && data.traces[tid]) {
            selectedTraceId = tid;
            activeTab = 'traces';
            render();
          }
        });
      });

      // Jump to Logs from Dependencies
      container.querySelectorAll('.dep-node-card, .btn-jump-logs-dep').forEach(el => {
        el.addEventListener('click', () => {
          const filterKey = el.getAttribute('data-dep-filter') || el.getAttribute('data-dep');
          if (filterKey) {
            selectedService = filterKey;
            activeTab = 'logs';
            render();
          }
        });
      });

      // Click Log Row to open Investigation Drawer
      container.querySelectorAll('.log-table-row').forEach(row => {
        row.addEventListener('click', () => {
          const logId = row.getAttribute('data-log-id');
          const logItem = logsList.find(l => l.id === logId);
          if (logItem) {
            this.showLogInvestigationModal(logItem, (traceId) => {
              selectedTraceId = traceId;
              activeTab = 'traces';
              render();
            });
          }
        });
      });
    };

    render();
  }

  showLogInvestigationModal(log, onJumpTrace) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 650px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="log-lvl-pill ${log.level}">${log.level}</span>
            <h3 style="font-size:1.05rem; font-weight:800; margin:0; color:var(--text-main);">
              Log Investigation: ${log.service}
            </h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.9rem; padding:1.2rem;">
          <!-- Log Details Block -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:0.4rem;">
              LOG DETAILS & METADATA
            </strong>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.45rem; font-size:0.74rem;">
              <div><span style="color:var(--text-dim);">Timestamp:</span> <strong style="font-family:var(--font-mono);">${log.timestamp}</strong></div>
              <div><span style="color:var(--text-dim);">Pod Instance:</span> <strong style="font-family:var(--font-mono); color:var(--accent-cyan);">${log.pod}</strong></div>
              <div><span style="color:var(--text-dim);">Trace ID:</span> <strong style="font-family:var(--font-mono);">${log.traceId}</strong></div>
              <div><span style="color:var(--text-dim);">Request ID:</span> <strong style="font-family:var(--font-mono);">${log.requestId}</strong></div>
            </div>
            <div style="margin-top:0.6rem; padding:0.5rem; background:rgba(0,0,0,0.25); border-radius:var(--radius-xs); font-family:var(--font-mono); font-size:0.73rem; color:#f87171;">
              ${log.message}
            </div>
          </div>

          <!-- Possible Root Cause -->
          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-sm); padding:0.75rem;">
            <strong style="color:#fbbf24; font-size:0.72rem; text-transform:uppercase; display:block; margin-bottom:2px;">
              POSSIBLE CAUSE (AI TELEMETRY CORRELATION)
            </strong>
            <p style="font-size:0.78rem; color:var(--text-main); margin:0;">
              ${log.possibleCause}
            </p>
          </div>

          <!-- Related Incident & Trace Links -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
            <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.7rem;">
              <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">RELATED INCIDENT</span>
              ${log.relatedIncident ? `
                <div style="margin-top:3px;">
                  <strong style="color:var(--accent-cyan); font-size:0.8rem; display:block;">${log.relatedIncident.id}</strong>
                  <span style="font-size:0.72rem; color:var(--text-main);">${log.relatedIncident.title}</span>
                </div>
              ` : '<span style="font-size:0.72rem; color:var(--text-dim); display:block; margin-top:2px;">No active Sev-1 incident linked</span>'}
            </div>

            <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.7rem; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">RELATED TRACE</span>
                <strong style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); display:block; margin-top:2px;">
                  ${log.traceId}
                </strong>
              </div>
              <button class="btn-ai-pill btn-ai-pill-secondary btn-modal-jump-trace" style="margin-top:0.4rem; padding:0.2rem 0.5rem; font-size:0.7rem;">
                Open Distributed Trace ➔
              </button>
            </div>
          </div>

          <!-- Historical Matches -->
          ${log.historicalMatches && log.historicalMatches.length > 0 ? `
            <div style="background:rgba(168,85,247,0.06); border:1px solid rgba(168,85,247,0.25); border-radius:var(--radius-sm); padding:0.75rem;">
              <strong style="color:#c084fc; font-size:0.72rem; text-transform:uppercase; display:block; margin-bottom:4px;">
                HISTORICAL MATCHES FROM INCIDENT MEMORY
              </strong>
              ${log.historicalMatches.map(m => `
                <div style="font-size:0.74rem; color:var(--text-main);">
                  <strong style="color:var(--accent-cyan);">${m.id} (${m.match}):</strong> ${m.solution}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.querySelector('.btn-modal-jump-trace')?.addEventListener('click', () => {
      close();
      if (onJumpTrace) onJumpTrace(log.traceId);
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  renderMeshView(container) {
    import('../data/servicesMeshData.js').then(({ enterpriseServices, topologyEdges }) => {
      this.initServicesMeshWorkspace(container, {
        services: enterpriseServices,
        edges: topologyEdges
      });
    }).catch(err => {
      console.error("Error loading servicesMeshData:", err);
      container.innerHTML = `<div class="p-4 text-red-500">Failed to load Services & Mesh dataset.</div>`;
    });
  }

  initServicesMeshWorkspace(container, data) {
    let selectedServiceId = 'payment-service';
    let isImpactAnalysisActive = false;

    const render = () => {
      const selected = data.services.find(s => s.id === selectedServiceId) || data.services[2];

      container.innerHTML = `
        <div class="view-container">
          <!-- Top Header -->
          <div class="view-header">
            <div class="view-title-block">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                Enterprise Service Dependency Map & Mesh Topology
              </h2>
              <p>Topological dependency map representing microservice health, latency friction, and cascading blast radiuses</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
              <span class="header-pill" style="color:var(--accent-cyan);">Services Tracked: ${data.services.length}</span>
              <span class="header-pill" style="color:#ef4444; border-color:rgba(239,68,68,0.3);">Active Outages: 2 Services Affected</span>
            </div>
          </div>

          <!-- Main Layout (Graph on Left + Inspector on Right) -->
          <div class="mesh-workspace-layout">
            <!-- LEFT: VISUAL SERVICE GRAPH -->
            <div class="mesh-graph-box">
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                <div class="mesh-health-legend">
                  <span style="font-size:0.68rem; font-weight:800; color:var(--text-dim); text-transform:uppercase; margin-right:0.3rem;">HEALTH STATES:</span>
                  <span class="health-legend-chip"><span class="health-dot Healthy"></span> Healthy</span>
                  <span class="health-legend-chip"><span class="health-dot Degraded"></span> Degraded</span>
                  <span class="health-legend-chip"><span class="health-dot Critical"></span> Critical</span>
                  <span class="health-legend-chip"><span class="health-dot Unknown"></span> Unknown</span>
                </div>
                <span style="font-size:0.72rem; color:var(--text-dim);">Click any node to inspect & simulate blast radius</span>
              </div>

              <!-- Interactive SVG Graph -->
              <div class="svg-mesh-container">
                <svg width="100%" height="100%" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet" style="user-select:none;">
                  <defs>
                    <marker id="mesh-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255,255,255,0.3)" />
                    </marker>
                    <marker id="mesh-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
                    </marker>
                    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <!-- Dependency Edges (Connecting Lines) -->
                  <g class="mesh-edges">
                    ${data.edges.map(edge => {
                      const fromNode = data.services.find(s => s.id === edge.from);
                      const toNode = data.services.find(s => s.id === edge.to);
                      if (!fromNode || !toNode) return '';
                      const isEdgeFailing = (fromNode.status === 'Critical' || toNode.status === 'Critical') ||
                                            (fromNode.id === selected.id && toNode.status !== 'Healthy');
                      const strokeColor = isEdgeFailing ? '#ef4444' : 'rgba(255,255,255,0.18)';
                      const strokeWidth = isEdgeFailing ? '2.5' : '1.5';
                      const strokeDash = isEdgeFailing ? '4 3' : 'none';

                      return `
                        <path d="M ${fromNode.x} ${fromNode.y + 20} Q ${(fromNode.x + toNode.x)/2} ${(fromNode.y + toNode.y)/2 - 15} ${toNode.x} ${toNode.y - 20}"
                              fill="none"
                              stroke="${strokeColor}"
                              stroke-width="${strokeWidth}"
                              stroke-dasharray="${strokeDash}"
                              marker-end="${isEdgeFailing ? 'url(#mesh-arrow-active)' : 'url(#mesh-arrow)'}" />
                      `;
                    }).join('')}
                  </g>

                  <!-- Service Nodes -->
                  <g class="mesh-nodes">
                    ${data.services.map(srv => {
                      const isSelected = srv.id === selected.id;
                      const isCritical = srv.status === 'Critical';
                      const isDegraded = srv.status === 'Degraded';
                      const borderColor = isSelected ? '#00d2ff' : (isCritical ? '#ef4444' : (isDegraded ? '#f59e0b' : 'rgba(255,255,255,0.15)'));
                      const nodeBg = isSelected ? 'rgba(0, 210, 255, 0.12)' : (isCritical ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card)');

                      return `
                        <g class="mesh-svg-node ${isSelected ? 'selected' : ''} ${isCritical ? 'failing' : ''}" data-srv-id="${srv.id}" transform="translate(${srv.x - 75}, ${srv.y - 30})">
                          <rect width="150" height="60" rx="6" fill="${nodeBg}" stroke="${borderColor}" stroke-width="${isSelected ? '2.5' : '1.5'}" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));" />
                          
                          <!-- Status Indicator Dot -->
                          <circle cx="15" cy="20" r="4.5" fill="${srv.statusColor}" class="${isCritical ? 'stream-live-pulse' : ''}" />
                          
                          <!-- Node Label -->
                          <text x="26" y="23" fill="#fff" font-size="11" font-weight="700" font-family="var(--font-sans)">${srv.name}</text>
                          
                          <!-- Type Label -->
                          <text x="14" y="38" fill="var(--text-dim)" font-size="8.5" font-family="var(--font-sans)">${srv.type}</text>
                          
                          <!-- Metrics Summary -->
                          <text x="14" y="50" fill="${isCritical ? '#f87171' : (isDegraded ? '#fbbf24' : '#34d399')}" font-size="8.5" font-weight="700" font-family="var(--font-mono)">
                            ${srv.errorRate} err • ${srv.avgLatency}
                          </text>

                          ${isCritical ? `
                            <rect x="100" y="8" width="42" height="13" rx="3" fill="#ef4444" />
                            <text x="121" y="17" fill="#fff" font-size="7.5" font-weight="800" text-anchor="middle">CRITICAL</text>
                          ` : ''}
                        </g>
                      `;
                    }).join('')}
                  </g>
                </svg>
              </div>
            </div>

            <!-- RIGHT: SERVICE INSPECTOR & BLAST RADIUS -->
            <div class="mesh-inspector-panel">
              <!-- Service Overview Card -->
              <div class="inspector-header-card">
                <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem;">
                  <div>
                    <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">SELECTED SERVICE</span>
                    <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin:2px 0 0 0;">
                      ${selected.name}
                    </h3>
                    <span style="font-size:0.72rem; color:var(--text-dim);">${selected.type}</span>
                  </div>
                  <span class="log-lvl-pill ${selected.status === 'Critical' ? 'FATAL' : (selected.status === 'Degraded' ? 'WARN' : 'INFO')}" style="font-size:0.72rem;">
                    ● ${selected.status.toUpperCase()}
                  </span>
                </div>

                <!-- 6 Metrics Grid -->
                <div class="inspector-metrics-grid">
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Error Rate</span>
                    <span class="inspector-metric-val" style="color:${selected.status === 'Healthy' ? '#34d399' : '#ef4444'};">${selected.errorRate}</span>
                  </div>
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Request Rate</span>
                    <span class="inspector-metric-val">${selected.requestRate}</span>
                  </div>
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Average Latency</span>
                    <span class="inspector-metric-val" style="color:${selected.status === 'Critical' ? '#ef4444' : 'var(--text-main)'};">${selected.avgLatency}</span>
                  </div>
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Active Incidents</span>
                    <span class="inspector-metric-val" style="color:${selected.activeIncidents > 0 ? '#ef4444' : '#34d399'};">${selected.activeIncidents} Active</span>
                  </div>
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Historical Total</span>
                    <span class="inspector-metric-val">${selected.incidentCount} Logged</span>
                  </div>
                  <div class="inspector-metric-box">
                    <span class="inspector-metric-label">Last Deployment</span>
                    <span style="font-size:0.72rem; font-weight:700; color:var(--text-main); margin-top:2px;">${selected.lastDeployment}</span>
                  </div>
                </div>

                <!-- Top Error Signature -->
                <div style="background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.25); border-radius:var(--radius-xs); padding:0.5rem 0.65rem;">
                  <strong style="font-size:0.68rem; color:#f87171; text-transform:uppercase; display:block; margin-bottom:2px;">TOP ERROR SIGNATURE:</strong>
                  <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-main);">${selected.topError}</span>
                </div>

                <!-- Direct Dependencies -->
                <div>
                  <strong style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:4px;">
                    DIRECT DEPENDENCIES (${selected.dependencies.length}):
                  </strong>
                  ${selected.dependencies.length > 0 ? `
                    <div style="display:flex; flex-direction:column; gap:0.3rem;">
                      ${selected.dependencies.map(dep => `
                        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface); padding:0.35rem 0.55rem; border-radius:var(--radius-xs); font-size:0.74rem;">
                          <span style="color:var(--text-main); font-weight:600;">${dep.name}</span>
                          <span class="log-lvl-pill ${dep.status === 'Critical' ? 'FATAL' : (dep.status === 'Degraded' ? 'WARN' : 'INFO')}">
                            ${dep.status}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  ` : '<span style="font-size:0.72rem; color:var(--text-dim);">Root infrastructure service (no upstream dependencies)</span>'}
                </div>
              </div>

              <!-- BLAST RADIUS CASCADE SECTION -->
              <div class="blast-radius-card">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <strong style="font-size:0.82rem; font-weight:800; color:#fbbf24; display:flex; align-items:center; gap:0.35rem;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                    CASCADE BLAST RADIUS ANALYSIS
                  </strong>
                  <span style="font-size:0.68rem; color:var(--text-dim);">When ${selected.name} Fails</span>
                </div>

                <!-- Tier 1: Directly Affected -->
                <div class="blast-radius-tier">
                  <span class="blast-tier-title" style="color:#ef4444;">
                    <span>● DIRECTLY AFFECTED:</span>
                  </span>
                  <div class="blast-tier-chips">
                    ${selected.blastRadius.directlyAffected.map(item => `
                      <span class="blast-chip direct">${item}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Tier 2: Potentially Affected -->
                <div class="blast-radius-tier">
                  <span class="blast-tier-title" style="color:#f59e0b;">
                    <span>▲ POTENTIALLY AFFECTED:</span>
                  </span>
                  <div class="blast-tier-chips">
                    ${selected.blastRadius.potentiallyAffected.map(item => `
                      <span class="blast-chip potential">${item}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Tier 3: Unaffected -->
                <div class="blast-radius-tier">
                  <span class="blast-tier-title" style="color:#10b981;">
                    <span>✓ UNAFFECTED:</span>
                  </span>
                  <div class="blast-tier-chips">
                    ${selected.blastRadius.unaffected.map(item => `
                      <span class="blast-chip unaffected">${item}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Run Impact Analysis CTA Button -->
                <button class="btn-impact-analysis-pill" id="btn-run-impact-analysis">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Run Impact Analysis on ${selected.name} ⚡
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      attachEventListeners();
    };

    const attachEventListeners = () => {
      // Node selection on SVG Graph
      container.querySelectorAll('.mesh-svg-node').forEach(node => {
        node.addEventListener('click', () => {
          const srvId = node.getAttribute('data-srv-id');
          if (srvId) {
            selectedServiceId = srvId;
            render();
          }
        });
      });

      // Impact Analysis Button
      const impactBtn = container.querySelector('#btn-run-impact-analysis');
      if (impactBtn) {
        impactBtn.addEventListener('click', () => {
          const selected = data.services.find(s => s.id === selectedServiceId) || data.services[2];
          toast.show({
            title: `Impact Analysis: ${selected.name}`,
            message: `Simulated failure cascade. High risk on: ${selected.blastRadius.directlyAffected.join(', ')} & ${selected.blastRadius.potentiallyAffected.join(', ')}.`,
            type: "warning"
          });
        });
      }
    };

    render();
  }

  renderCopilotView(container) {
    import('../services/geminiChatService.js').then(({ geminiChat }) => {
      this.initCopilotWorkspace(container, geminiChat);
    }).catch(err => {
      console.error("Error loading Gemini Copilot service:", err);
      container.innerHTML = `<div class="p-4 text-red-500">Failed to load Autonomous Copilot engine.</div>`;
    });
  }

  initCopilotWorkspace(container, geminiChat) {
    const suggestedQuestions = [
      "Why is Payment API failing?",
      "Have we seen this problem before?",
      "What changed before this incident?",
      "Which service is causing the problem?",
      "Show similar incidents.",
      "What was the previous solution?",
      "Summarize today's incidents.",
      "What should I investigate first?",
      "Create a troubleshooting plan."
    ];

    container.innerHTML = `
      <div class="view-container">
        <!-- Top Header -->
        <div class="view-header">
          <div class="view-title-block">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#00d2ff"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Autonomous Copilot: AI DevOps Incident Investigator
            </h2>
            <p>Grounded across Current Incidents, Incident Memory, Logs, Traces, Services & Mesh, Metrics, and Verified Runbooks</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button class="ctrl-btn" id="btn-clear-copilot-thread" style="color:#f87171; border-color:rgba(248,113,113,0.3);">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Clear Conversation
            </button>
            <span class="header-pill" style="color:#10b981; border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.08);">
              ● SRE Telemetry Mesh: ONLINE
            </span>
          </div>
        </div>

        <!-- Main Layout: Chat Box + Sources Sidebar -->
        <div class="copilot-workspace-grid">
          <!-- LEFT: CHAT CONTAINER -->
          <div class="copilot-chat-box">
            <!-- Messages Stream -->
            <div class="chat-messages-stream" id="copilot-msg-stream">
              <!-- Welcome Initial Message -->
              <div class="copilot-msg-row ai-row">
                <div class="copilot-avatar ai">AI</div>
                <div class="copilot-bubble">
                  <div style="font-weight:800; color:var(--accent-cyan); font-size:0.88rem; display:flex; align-items:center; gap:0.4rem;">
                    <span>AetherOps Autonomous DevOps Copilot Ready</span>
                  </div>
                  <p style="margin:0; font-size:0.78rem; color:var(--text-main);">
                    I am actively connected to your production AKS telemetry stream, distributed trace spans, and 155,000 historical incident memory vectors. I generate structured, evidence-backed answers to investigate outages, identify root causes, and prescribe proven runbooks.
                  </p>
                </div>
              </div>
            </div>

            <!-- Suggested Questions Bar (9 Questions) -->
            <div class="suggested-questions-wrap">
              <div class="suggested-questions-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span>SUGGESTED SRE QUESTIONS (CLICK TO ASK):</span>
              </div>
              <div class="suggested-chips-grid">
                ${suggestedQuestions.map(q => `
                  <button class="suggested-chip-btn" data-query="${q}">${q}</button>
                `).join('')}
              </div>
            </div>

            <!-- Input Bar -->
            <div class="copilot-input-row">
              <input type="text" class="form-input" id="copilot-query-input" style="flex:1; font-size:0.78rem; padding:0.5rem 0.8rem;" placeholder="Ask anything about current incidents, telemetry logs, root causes, or runbooks..." />
              <button class="btn-launch-copilot" id="btn-submit-copilot" style="width:auto; padding:0.45rem 1rem;">
                Ask Copilot ⚡
              </button>
            </div>
          </div>

          <!-- RIGHT: CONNECTED TELEMETRY SOURCES -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div class="copilot-sources-card">
              <strong style="font-size:0.82rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.4rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Connected Telemetry Knowledge Base
              </strong>

              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <div class="source-item-row">
                  <span>Current Incidents</span>
                  <span style="font-weight:700; color:#ef4444; font-size:0.7rem;">INC-9042 (Active)</span>
                </div>
                <div class="source-item-row">
                  <span>Historical Incidents</span>
                  <span style="font-weight:700; color:var(--accent-cyan); font-size:0.7rem;">155,000 Vectors</span>
                </div>
                <div class="source-item-row">
                  <span>Incident Memory</span>
                  <span style="font-weight:700; color:#10b981; font-size:0.7rem;">Synchronized</span>
                </div>
                <div class="source-item-row">
                  <span>Real-Time Logs (eBPF)</span>
                  <span style="font-weight:700; color:#10b981; font-size:0.7rem;">Live Stream</span>
                </div>
                <div class="source-item-row">
                  <span>Distributed Traces</span>
                  <span style="font-weight:700; color:var(--accent-cyan); font-size:0.7rem;">OpenTelemetry</span>
                </div>
                <div class="source-item-row">
                  <span>Services & Mesh</span>
                  <span style="font-weight:700; color:#a855f7; font-size:0.7rem;">9 Services Tracked</span>
                </div>
                <div class="source-item-row">
                  <span>Metrics Telemetry</span>
                  <span style="font-weight:700; color:#10b981; font-size:0.7rem;">Prometheus Live</span>
                </div>
                <div class="source-item-row">
                  <span>Verified Runbooks</span>
                  <span style="font-weight:700; color:#34d399; font-size:0.7rem;">Indexed</span>
                </div>
              </div>
            </div>

            <!-- Quick SRE Automations Card -->
            <div class="panel-card">
              <div class="panel-header" style="padding-bottom:0.4rem;">
                <div class="panel-title-block">
                  <h3 style="font-size:0.85rem;">Autonomous Runbook Actions</h3>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <button class="ctrl-btn quick-action-btn" data-action="Restart degraded payment-api pods to drain TCP sockets" style="justify-content:flex-start; text-align:left; font-size:0.72rem;">
                  ⚡ Recycle Payment Pods
                </button>
                <button class="ctrl-btn quick-action-btn" data-action="Scale PgBouncer pool ceiling to 500 connections" style="justify-content:flex-start; text-align:left; font-size:0.72rem;">
                  ▲ Scale PgBouncer Pool
                </button>
                <button class="ctrl-btn quick-action-btn" data-action="Draft post-mortem executive summary for Microsoft Teams" style="justify-content:flex-start; text-align:left; font-size:0.72rem;">
                  📄 Draft Incident Post-Mortem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const chatStream = document.getElementById('copilot-msg-stream');
    const input = document.getElementById('copilot-query-input');

    const formatMarkdownResponse = (rawText) => {
      if (!rawText) return '';
      let formatted = rawText
        .replace(/### Answer\s*([\s\S]*?)(?=### Evidence|$)/i, '<div class="copilot-section-block"><div class="copilot-section-title" style="color:#38bdf8;"><span>💬 ANSWER</span></div><div>$1</div></div>')
        .replace(/### Evidence\s*([\s\S]*?)(?=### Related Incidents|$)/i, '<div class="copilot-section-block evidence-block"><div class="copilot-section-title" style="color:#00d2ff;"><span>📊 TELEMETRY EVIDENCE</span></div><div>$1</div></div>')
        .replace(/### Related Incidents\s*([\s\S]*?)(?=### Recommended Next Step|$)/i, '<div class="copilot-section-block incidents-block"><div class="copilot-section-title" style="color:#c084fc;"><span>🔗 RELATED INCIDENTS</span></div><div>$1</div></div>')
        .replace(/### Recommended Next Step\s*([\s\S]*?)$/i, '<div class="copilot-section-block next-step-block"><div class="copilot-section-title" style="color:#34d399;"><span>🚀 RECOMMENDED NEXT STEP</span></div><div>$1</div></div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3); padding:1px 5px; border-radius:3px; font-family:var(--font-mono); color:#fed7aa;">$1</code>')
        .replace(/\n/g, '<br/>');

      return formatted;
    };

    const appendUserMessage = (text) => {
      const row = document.createElement('div');
      row.className = 'copilot-msg-row user-row';
      row.innerHTML = `
        <div class="copilot-avatar user">ME</div>
        <div class="copilot-bubble">
          <p style="margin:0; font-weight:600;">${text}</p>
        </div>
      `;
      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;
    };

    const appendAiLoading = () => {
      const row = document.createElement('div');
      row.className = 'copilot-msg-row ai-row msg-loading-state';
      row.id = 'copilot-loading-indicator';
      row.innerHTML = `
        <div class="copilot-avatar ai">AI</div>
        <div class="copilot-bubble" style="display:flex; align-items:center; gap:0.5rem; color:var(--accent-cyan);">
          <div class="spinner-icon"></div>
          <span>Correlating current telemetry, incident memory, logs & traces...</span>
        </div>
      `;
      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;
    };

    const removeAiLoading = () => {
      const loader = document.getElementById('copilot-loading-indicator');
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    };

    const appendAiMessage = (resData) => {
      const row = document.createElement('div');
      row.className = 'copilot-msg-row ai-row';
      const incId = resData.incidentId || "INC-9042";

      row.innerHTML = `
        <div class="copilot-avatar ai">AI</div>
        <div class="copilot-bubble">
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${formatMarkdownResponse(resData.text)}
          </div>

          <!-- Clickable Action Buttons -->
          <div class="copilot-actions-bar">
            <button class="btn-ai-pill btn-ai-pill-secondary btn-copilot-view-evidence" data-inc="${incId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              View Evidence
            </button>
            <button class="btn-ai-pill btn-ai-pill-secondary btn-copilot-view-incident" data-inc="${incId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
              View Incident
            </button>
            <button class="btn-ai-pill btn-ai-pill-secondary btn-copilot-view-rca" data-inc="${incId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              View Root Cause
            </button>
            <button class="btn-ai-pill btn-ai-pill-primary btn-copilot-view-solution" data-inc="${incId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              View Solution
            </button>
          </div>
        </div>
      `;

      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;

      // Attach button action handlers
      row.querySelector('.btn-copilot-view-evidence')?.addEventListener('click', () => {
        this.showCopilotEvidenceModal(incId);
      });
      row.querySelector('.btn-copilot-view-incident')?.addEventListener('click', () => {
        this.showCopilotIncidentModal(incId);
      });
      row.querySelector('.btn-copilot-view-rca')?.addEventListener('click', () => {
        this.showCopilotRcaModal(incId);
      });
      row.querySelector('.btn-copilot-view-solution')?.addEventListener('click', () => {
        this.showCopilotSolutionModal(incId);
      });
    };

    const handleSendQuery = async (customQuery = null) => {
      const query = (customQuery || input.value).trim();
      if (!query) return;

      appendUserMessage(query);
      if (!customQuery) input.value = '';

      appendAiLoading();

      try {
        const responseData = await geminiChat.sendMessage(query);
        removeAiLoading();
        appendAiMessage(responseData);
      } catch (err) {
        removeAiLoading();
        appendAiMessage({
          text: `### Answer\nI have correlated the telemetry signals across AKS cluster and Incident Memory for: **"${query}"**.\n\n### Evidence\n- **Service Target:** Payment API (v3.4.1)\n- **Active Bottleneck:** PostgreSQL connection pool saturation\n\n### Related Incidents\n- INC-9042 (Active), INC-0192 (94% Match)\n\n### Recommended Next Step\nReview live connection allocation in PgBouncer pooler.`,
          incidentId: "INC-9042"
        });
      }
    };

    // Event Listeners
    document.getElementById('btn-submit-copilot')?.addEventListener('click', () => handleSendQuery());
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendQuery();
    });

    container.querySelectorAll('.suggested-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        handleSendQuery(q);
      });
    });

    document.getElementById('btn-clear-copilot-thread')?.addEventListener('click', () => {
      geminiChat.clearHistory();
      chatStream.innerHTML = `
        <div class="copilot-msg-row ai-row">
          <div class="copilot-avatar ai">AI</div>
          <div class="copilot-bubble">
            <div style="font-weight:800; color:var(--accent-cyan); font-size:0.88rem;">
              Conversation Cleared & Context Re-indexed
            </div>
            <p style="margin:0; font-size:0.78rem; color:var(--text-main);">
              Ready for your next SRE investigation. Select a suggested question below or enter a custom telemetry query.
            </p>
          </div>
        </div>
      `;
      toast.show({
        title: "Conversation Cleared",
        message: "Memory buffer reset to fresh state.",
        type: "info"
      });
    });

    container.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        handleSendQuery(action);
      });
    });
  }

  showCopilotEvidenceModal(incId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:#00d2ff; font-weight:800;">TELEMETRY EVIDENCE</span>
            <h3 style="font-size:1rem; font-weight:800; margin:0;">${incId} Grounded Evidence</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.75rem;">
            <strong style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:4px;">Captured eBPF Socket Stream:</strong>
            <pre style="background:rgba(0,0,0,0.3); padding:0.6rem; border-radius:var(--radius-xs); font-family:var(--font-mono); font-size:0.72rem; color:#f87171; overflow-x:auto; margin:0;">
08:42:01.104 ERROR [payment-api-pod-8bf] Database timeout after 4500ms
08:42:02.320 FATAL [payment-api-pod-8bf] Connection pool exhausted (500/500 capped)
08:42:04.180 ERROR [api-gateway-mesh] 503 Service Unavailable on /api/v3/payments/charge</pre>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
            <div style="background:var(--bg-surface); padding:0.6rem; border-radius:var(--radius-xs); border:1px solid var(--border-card); font-size:0.74rem;">
              <span style="color:var(--text-dim); font-size:0.68rem; text-transform:uppercase;">Pool Saturation:</span>
              <strong style="color:#ef4444; display:block; font-size:0.88rem;">98.4% Active</strong>
            </div>
            <div style="background:var(--bg-surface); padding:0.6rem; border-radius:var(--radius-xs); border:1px solid var(--border-card); font-size:0.74rem;">
              <span style="color:var(--text-dim); font-size:0.68rem; text-transform:uppercase;">Latency P99:</span>
              <strong style="color:#ef4444; display:block; font-size:0.88rem;">4,820ms</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showCopilotIncidentModal(incId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:var(--accent-cyan); font-weight:800; font-family:var(--font-mono);">${incId}</span>
            <h3 style="font-size:1.05rem; font-weight:800; margin:0;">Database Connection Pool Exhaustion</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem; font-size:0.78rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--bg-surface); padding:0.65rem; border-radius:var(--radius-sm); border:1px solid var(--border-card);">
            <div><span style="color:var(--text-dim);">Service:</span> <strong style="display:block;">Payment API (v3.4.1)</strong></div>
            <div><span style="color:var(--text-dim);">Environment:</span> <strong style="display:block; color:var(--accent-cyan);">Production (US-East-1)</strong></div>
            <div><span style="color:var(--text-dim);">Severity:</span> <strong style="display:block; color:#ef4444;">Critical (Sev-1)</strong></div>
            <div><span style="color:var(--text-dim);">Status:</span> <strong style="display:block; color:#f59e0b;">Under Active Investigation</strong></div>
          </div>
          <p style="margin:0; line-height:1.4; color:var(--text-main);">
            High-concurrency traffic surge following container release v3.4.1 triggered socket pool starvation in async retry loop, leading to dropped checkout requests and 503 gateway timeouts.
          </p>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showCopilotRcaModal(incId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:#f59e0b; font-weight:800;">ROOT CAUSE DIAGNOSIS</span>
            <h3 style="font-size:1rem; font-weight:800; margin:0;">${incId} Analysis</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#fbbf24; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Technical Root Cause:</strong>
            <p style="font-size:0.82rem; color:var(--text-main); margin:0; line-height:1.4;">
              Npgsql connection pool saturation triggered by missing \`connection.Dispose()\` in async retry handler during high-concurrency payment processing.
            </p>
          </div>
          <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#34d399; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Long-Term Prevention:</strong>
            <p style="font-size:0.82rem; color:var(--text-main); margin:0; line-height:1.4;">
              Implement PgBouncer transaction-mode pooler and add Roslyn static code analyzer enforcing \`using\` statements across all database allocations.
            </p>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:flex-end;">
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showCopilotSolutionModal(incId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="header-pill" style="color:#10b981; font-weight:800;">PROVEN SOLUTION & RUNBOOK</span>
            <h3 style="font-size:1rem; font-weight:800; margin:0;">${incId} Remediation</h3>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.85rem; padding:1.2rem;">
          <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-sm); padding:0.85rem;">
            <strong style="color:#34d399; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:4px;">Verified Hotfix Solution:</strong>
            <p style="font-size:0.84rem; color:var(--text-main); margin:0; line-height:1.4;">
              1. Restart Payment API pods to immediately release 10,240 leaked TCP sockets.<br/>
              2. Inject Singleton DI factory in \`Program.cs\` to clamp max pool ceiling to 500 connections.<br/>
              3. Deploy PgBouncer in transaction mode.
            </p>
          </div>

          <div style="background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:0.75rem;">
            <strong style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:4px;">Autonomous Remediation Command:</strong>
            <pre style="background:rgba(0,0,0,0.3); padding:0.6rem; border-radius:var(--radius-xs); font-family:var(--font-mono); font-size:0.72rem; color:#6ee7b7; overflow-x:auto; margin:0;">
kubectl rollout restart deployment/payment-gateway-v3 -n production</pre>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.75rem 1.2rem; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn-ai-pill btn-ai-pill-primary btn-apply-copilot-fix">Apply Hotfix Now ⚡</button>
          <button class="btn-ai-pill btn-ai-pill-secondary modal-close-btn-action">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(b => b.addEventListener('click', close));
    modal.querySelector('.btn-apply-copilot-fix')?.addEventListener('click', () => {
      toast.show({
        title: `Remediation Triggered for ${incId}`,
        message: "Initiated zero-downtime container rollout on AKS worker pool.",
        type: "success"
      });
      close();
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  renderRunbooksView(container) {
    container.innerHTML = `
      <div class="view-container">
        <div class="view-header">
          <div class="view-title-block">
            <h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Runbooks & Automation Workflows
            </h2>
            <p>1-Click verified remediation pipelines orchestrated across Kubernetes and Azure</p>
          </div>
          <button class="ctrl-btn" id="btn-create-runbook">+ Create New Runbook</button>
        </div>

        <div class="runbook-cards-grid">
          <div class="runbook-card">
            <div class="runbook-title">
              <span>RB-101: Cosmos Connection Pool Hotfix</span>
              <span class="header-pill" style="color:#10b981;">Automated</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-dim);">
              Safely injects singleton connection factory and initiates AKS rolling container restart.
            </p>
            <div class="runbook-code-preview">
az deployment group create --template-uri https://contoso.blob.core.windows.net/hotfix/cosmos-singleton.json
kubectl rollout restart deployment/checkout-service -n prod
            </div>
            <button class="btn-launch-copilot btn-run-single-runbook" data-name="Cosmos Connection Pool Hotfix">Run Automation ⚡</button>
          </div>

          <div class="runbook-card">
            <div class="runbook-title">
              <span>RB-204: Ephemeral Socket & Port Drain</span>
              <span class="header-pill" style="color:#10b981;">Automated</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-dim);">
              Flushes TIME_WAIT TCP sockets on Linux worker nodes and recycles exhausted proxy containers.
            </p>
            <div class="runbook-code-preview">
sysctl -w net.ipv4.tcp_tw_reuse=1
az aks nodepool restart --cluster-name aks-01 --nodepool-name userpool
            </div>
            <button class="btn-launch-copilot btn-run-single-runbook" data-name="Ephemeral Socket Drain">Run Automation ⚡</button>
          </div>

          <div class="runbook-card">
            <div class="runbook-title">
              <span>RB-309: Canary Revision Instant Rollback</span>
              <span class="header-pill" style="color:#10b981;">Automated</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-dim);">
              Reverts ingress traffic weighting from 25% canary back to 100% stable baseline v4.11.8.
            </p>
            <div class="runbook-code-preview">
az containerapp revision set-mode --mode single
az containerapp revision activate --revision payment-gw--v4-11-8
            </div>
            <button class="btn-launch-copilot btn-run-single-runbook" data-name="Canary Instant Rollback">Run Automation ⚡</button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.btn-run-single-runbook').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        toast.show({
          title: `Executing ${name}`,
          message: "Automation pipeline completed with 0 errors.",
          type: "success"
        });
      });
    });

    document.getElementById('btn-create-runbook')?.addEventListener('click', () => {
      toast.show({
        title: "Runbook Studio",
        message: "Opened visual runbook workflow editor.",
        type: "azure"
      });
    });
  }

  renderAnalyticsView(container) {
    import('../data/telemetryAnalyticsData.js').then(({ telemetryAnalyticsData }) => {
      this.initAnalyticsWorkspace(container, telemetryAnalyticsData);
    }).catch(err => {
      console.error("Error loading telemetryAnalyticsData:", err);
      container.innerHTML = `<div class="p-4 text-red-500">Failed to load Telemetry & Analytics dataset.</div>`;
    });
  }

  initAnalyticsWorkspace(container, data) {
    let selectedRange = "30 Days";
    let selectedService = "All Services";

    const render = () => {
      const metrics = data.metricsByRange[selectedRange] || data.metricsByRange["30 Days"];
      const kReuse = data.knowledgeReuseStats;
      const chart = data.chartData;

      container.innerHTML = `
        <div class="view-container analytics-workspace-layout">
          <!-- Top Header -->
          <div class="view-header">
            <div class="view-title-block">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Enterprise DevOps & Telemetry Analytics Center
              </h2>
              <p>Longitudinal SRE metrics, SLO/SLA compliance, MTTR velocity, and organizational incident memory reuse</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button class="ctrl-btn btn-export" id="btn-export-analytics">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export Analytics Report
              </button>
            </div>
          </div>

          <!-- Multi-Dimensional Filter Toolbar -->
          <div class="analytics-filter-bar">
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-dim); text-transform:uppercase;">DATE RANGE:</span>
              <div class="time-range-pills">
                ${data.timeFilters.map(tf => `
                  <button class="time-range-pill ${tf === selectedRange ? 'active' : ''}" data-range="${tf}">${tf}</button>
                `).join('')}
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-dim); text-transform:uppercase;">SERVICE:</span>
              <select id="analytics-service-filter" class="form-input" style="padding:0.35rem 0.65rem; font-size:0.76rem; font-weight:700; background:var(--bg-surface);">
                ${data.services.map(srv => `
                  <option value="${srv}" ${srv === selectedService ? 'selected' : ''}>${srv}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- 10 CORE SIGNALS KPI GRID -->
          <div class="analytics-kpi-grid">
            <!-- 1. Error Trends -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>1. Error Trends</span>
                <span style="color:#ef4444;">ERR</span>
              </span>
              <span class="analytics-kpi-value" style="color:#f87171;">${metrics.errorTrends.value}</span>
              <span class="analytics-kpi-delta ${metrics.errorTrends.isNegative ? 'negative' : 'positive'}">${metrics.errorTrends.delta}</span>
            </div>

            <!-- 2. Request Trends -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>2. Request Trends</span>
                <span style="color:var(--accent-cyan);">REQ</span>
              </span>
              <span class="analytics-kpi-value">${metrics.requestTrends.value}</span>
              <span class="analytics-kpi-delta positive">${metrics.requestTrends.delta}</span>
            </div>

            <!-- 3. Latency -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>3. P99 Latency</span>
                <span style="color:#f59e0b;">LAT</span>
              </span>
              <span class="analytics-kpi-value">${metrics.latency.value}</span>
              <span class="analytics-kpi-delta ${metrics.latency.isNegative ? 'negative' : 'positive'}">${metrics.latency.delta}</span>
            </div>

            <!-- 4. CPU -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>4. CPU Utilization</span>
                <span style="color:#3b82f6;">CPU</span>
              </span>
              <span class="analytics-kpi-value">${metrics.cpu.value}</span>
              <span class="analytics-kpi-delta ${metrics.cpu.isNegative ? 'negative' : 'positive'}">${metrics.cpu.delta}</span>
            </div>

            <!-- 5. Memory -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>5. Memory Saturation</span>
                <span style="color:#a855f7;">RAM</span>
              </span>
              <span class="analytics-kpi-value">${metrics.memory.value}</span>
              <span class="analytics-kpi-delta ${metrics.memory.isNegative ? 'negative' : 'positive'}">${metrics.memory.delta}</span>
            </div>

            <!-- 6. Service Health -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>6. Service Health</span>
                <span style="color:#10b981;">SLO</span>
              </span>
              <span class="analytics-kpi-value" style="color:#34d399;">${metrics.serviceHealth.value}</span>
              <span class="analytics-kpi-delta positive">${metrics.serviceHealth.delta}</span>
            </div>

            <!-- 7. Incident Frequency -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>7. Incident Frequency</span>
                <span style="color:#ef4444;">FREQ</span>
              </span>
              <span class="analytics-kpi-value" style="color:#f87171;">${metrics.incidentFreq.value}</span>
              <span class="analytics-kpi-delta ${metrics.incidentFreq.isNegative ? 'negative' : 'positive'}">${metrics.incidentFreq.delta}</span>
            </div>

            <!-- 8. Root Causes -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>8. Top Root Cause</span>
                <span style="color:#f59e0b;">RCA</span>
              </span>
              <span class="analytics-kpi-value" style="font-size:0.92rem; line-height:1.2;">${metrics.rootCauses.value}</span>
              <span class="analytics-kpi-delta ${metrics.rootCauses.isNegative ? 'negative' : 'positive'}">${metrics.rootCauses.delta}</span>
            </div>

            <!-- 9. Resolution Time -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>9. Resolution Time</span>
                <span style="color:#10b981;">MTTR</span>
              </span>
              <span class="analytics-kpi-value" style="color:#34d399;">${metrics.resolutionTime.value}</span>
              <span class="analytics-kpi-delta positive">${metrics.resolutionTime.delta}</span>
            </div>

            <!-- 10. Knowledge Reuse -->
            <div class="analytics-kpi-card">
              <span class="analytics-kpi-label">
                <span>10. Knowledge Reuse</span>
                <span style="color:var(--accent-cyan);">REUSE</span>
              </span>
              <span class="analytics-kpi-value" style="color:var(--accent-cyan);">${metrics.knowledgeReuse.value}</span>
              <span class="analytics-kpi-delta positive">${metrics.knowledgeReuse.delta}</span>
            </div>
          </div>

          <!-- KNOWLEDGE REUSE SECTION -->
          <div class="knowledge-reuse-container">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-size:0.95rem; font-weight:800; color:#34d399; margin:0; display:flex; align-items:center; gap:0.4rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  Organizational Knowledge Reuse & Learning Velocity
                </h3>
                <p style="font-size:0.72rem; color:var(--text-dim); margin:2px 0 0 0;">
                  Quantifying post-mortem memory recall and autonomous runbook reuse efficiency
                </p>
              </div>
              <span class="header-pill" style="color:#10b981; font-weight:800;">Reusability Rate: ${kReuse.reusabilityRate}</span>
            </div>

            <div class="knowledge-reuse-stats-row">
              <div class="reuse-stat-box">
                <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Incidents this month</span>
                <span class="reuse-stat-num" style="color:var(--text-main);">${kReuse.incidentsMonth}</span>
              </div>
              <div class="reuse-stat-box">
                <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Historical matches</span>
                <span class="reuse-stat-num" style="color:var(--accent-cyan);">${kReuse.historicalMatches}</span>
              </div>
              <div class="reuse-stat-box">
                <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Previous solutions reused</span>
                <span class="reuse-stat-num" style="color:#34d399;">${kReuse.solutionsReused}</span>
              </div>
              <div class="reuse-stat-box">
                <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">New knowledge created</span>
                <span class="reuse-stat-num" style="color:#f59e0b;">${kReuse.newKnowledgeCreated}</span>
              </div>
            </div>
          </div>

          <!-- CHARTS GRID (6 CHARTS) -->
          <div class="analytics-charts-grid">
            <!-- Chart 1: Errors by Hour -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">Errors by Hour</h4>
                <span style="font-size:0.68rem; color:var(--text-dim);">Spike at 09:00 UTC</span>
              </div>
              <div style="height:150px; display:flex; align-items:flex-end; gap:6px; padding:0.5rem 0; border-bottom:1px solid var(--border-card);">
                ${chart.errorsByHour.map(pt => {
                  const heightPct = Math.max(8, (pt.errors / 142) * 100);
                  const isPeak = pt.errors > 80;
                  return `
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
                      <div style="width:100%; height:${heightPct}%; background:${isPeak ? '#ef4444' : 'var(--accent-cyan)'}; border-radius:3px 3px 0 0;" title="${pt.time}: ${pt.errors} errors"></div>
                      <span style="font-size:0.6rem; color:var(--text-dim); margin-top:4px;">${pt.time.slice(0, 2)}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Chart 2: Incidents by Service -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">Incidents by Service</h4>
                <span style="font-size:0.68rem; color:var(--text-dim);">30-day breakdown</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.45rem; margin-top:0.3rem;">
                ${chart.incidentsByService.map(srv => `
                  <div style="display:flex; flex-direction:column; gap:0.15rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.72rem;">
                      <strong style="color:var(--text-main);">${srv.service}</strong>
                      <span style="font-family:var(--font-mono); color:${srv.color};">${srv.count} incidents</span>
                    </div>
                    <div style="height:6px; background:var(--bg-surface); border-radius:9999px; overflow:hidden;">
                      <div style="width:${(srv.count / 28) * 100}%; height:100%; background:${srv.color}; border-radius:9999px;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chart 3: Incidents by Severity -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">Incidents by Severity</h4>
                <span style="font-size:0.68rem; color:var(--text-dim);">84 Total</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.3rem;">
                ${chart.incidentsBySeverity.map(sev => `
                  <div style="background:var(--bg-surface); padding:0.55rem; border-radius:var(--radius-xs); border:1px solid var(--border-card); display:flex; flex-direction:column; gap:0.15rem;">
                    <span style="font-size:0.68rem; font-weight:700; color:${sev.color};">${sev.label}</span>
                    <strong style="font-size:1.05rem; font-family:var(--font-mono); color:var(--text-main);">${sev.count}</strong>
                    <span style="font-size:0.65rem; color:var(--text-dim);">${sev.pct}% of total</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chart 4: Root Causes Pareto Breakdown -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">Root Causes Distribution</h4>
                <span style="font-size:0.68rem; color:var(--text-dim);">Pareto Analysis</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.3rem;">
                ${chart.rootCausesBreakdown.map(rc => `
                  <div style="display:flex; flex-direction:column; gap:0.15rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.72rem;">
                      <span style="color:var(--text-main);">${rc.cause}</span>
                      <strong style="font-family:var(--font-mono); color:#fbbf24;">${rc.pct}%</strong>
                    </div>
                    <div style="height:6px; background:var(--bg-surface); border-radius:9999px; overflow:hidden;">
                      <div style="width:${rc.pct}%; height:100%; background:linear-gradient(90deg, #f59e0b, #ef4444); border-radius:9999px;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chart 5: Average Resolution Time MTTR -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">Average Resolution Time (MTTR)</h4>
                <span style="font-size:0.68rem; color:#34d399; font-weight:700;">-52% Overall</span>
              </div>
              <div style="display:flex; align-items:flex-end; justify-content:space-between; height:120px; padding:0.5rem 0.5rem 0; border-bottom:1px solid var(--border-card);">
                ${chart.mttrTrend.map(pt => `
                  <div style="display:flex; flex-direction:column; align-items:center; gap:0.25rem;">
                    <span style="font-family:var(--font-mono); font-size:0.7rem; font-weight:800; color:#34d399;">${pt.mttr}m</span>
                    <div style="width:24px; height:${(pt.mttr / 40) * 80}px; background:linear-gradient(180deg, #10b981, #00d2ff); border-radius:3px;"></div>
                    <span style="font-size:0.65rem; color:var(--text-dim); margin-top:2px;">${pt.week}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chart 6: AI-Assisted Investigations -->
            <div class="analytics-chart-card">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:0;">AI-Assisted vs Manual Investigations</h4>
                <span style="font-size:0.68rem; color:var(--accent-cyan); font-weight:700;">${chart.aiAssistedResolution.avgSpeedup}</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.4rem;">
                <div style="display:flex; height:24px; border-radius:var(--radius-xs); overflow:hidden; border:1px solid var(--border-card);">
                  <div style="width:${chart.aiAssistedResolution.aiAssisted}%; background:linear-gradient(90deg, #00d2ff, #a855f7); display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:800; color:#fff;">
                    AI-Assisted (${chart.aiAssistedResolution.aiAssisted}%)
                  </div>
                  <div style="width:${chart.aiAssistedResolution.manualOnly}%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; color:var(--text-dim);">
                    Manual (${chart.aiAssistedResolution.manualOnly}%)
                  </div>
                </div>
                <p style="font-size:0.72rem; color:var(--text-dim); margin:0; line-height:1.35;">
                  72% of Sev-1/Sev-2 incidents were investigated and resolved with autonomous AI Incident Memory correlation, resulting in a 4.2x speedup in diagnostic time.
                </p>
              </div>
            </div>
          </div>

          <!-- RECURRING PROBLEMS & OPERATIONAL TRENDS ROW -->
          <div class="analytics-insights-row">
            <!-- Left: Recurring Problems -->
            <div class="panel-card">
              <div class="panel-header" style="padding-bottom:0.4rem;">
                <div class="panel-title-block">
                  <h3 style="font-size:0.9rem; font-weight:800;">Recurring Problems</h3>
                  <span style="font-size:0.7rem;">Top systemic failure signatures</span>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.45rem;">
                ${data.recurringProblems.map(prob => `
                  <div class="recurring-problem-item">
                    <div>
                      <strong style="font-size:0.78rem; color:var(--text-main); display:block;">${prob.title}</strong>
                      <span style="font-size:0.68rem; color:var(--text-dim);">${prob.tag}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span class="header-pill" style="color:#ef4444; font-weight:800; font-family:var(--font-mono);">${prob.count} incidents</span>
                      <span class="log-lvl-pill ${prob.risk === 'High' ? 'FATAL' : 'WARN'}">${prob.risk}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right: Operational Trends -->
            <div class="panel-card">
              <div class="panel-header" style="padding-bottom:0.4rem;">
                <div class="panel-title-block">
                  <h3 style="font-size:0.9rem; font-weight:800;">Operational Trends</h3>
                  <span style="font-size:0.7rem;">Real-time automated telemetry signals</span>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.45rem;">
                ${data.operationalTrends.map(trend => `
                  <div class="operational-trend-item ${trend.type}">
                    <span style="font-size:0.8rem;">
                      ${trend.type === 'alert' ? '⚠️' : (trend.type === 'success' ? '✓' : 'ℹ️')}
                    </span>
                    <span style="color:var(--text-main);">${trend.text}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      attachEventListeners();
    };

    const attachEventListeners = () => {
      // Time Range Pills
      container.querySelectorAll('.time-range-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          selectedRange = pill.getAttribute('data-range');
          render();
        });
      });

      // Service Filter
      const srvSel = container.querySelector('#analytics-service-filter');
      if (srvSel) {
        srvSel.addEventListener('change', (e) => {
          selectedService = e.target.value;
          render();
        });
      }

      // Export Report
      document.getElementById('btn-export-analytics')?.addEventListener('click', () => {
        toast.show({
          title: `Exporting ${selectedRange} Report`,
          message: `Generated SRE telemetry analytics summary for ${selectedService}.`,
          type: "success"
        });
      });
    };

    render();
  }

  renderSettingsView(container) {
    const data = platformSettingsData;

    // Render helper for Monitoring Integrations
    const renderIntegrations = () => {
      return data.monitoringIntegrations.map(integ => {
        const isConn = integ.status === 'Connected';
        return `
          <div class="integration-card" id="integ-card-${integ.id}">
            <div>
              <div class="integration-card-header">
                <div>
                  <div class="integration-card-title">${integ.name}</div>
                  <div class="integration-card-type">${integ.type}</div>
                </div>
                <span class="integration-status-badge ${isConn ? 'connected' : 'disconnected'}" id="status-badge-${integ.id}">
                  <span style="width:6px; height:6px; border-radius:50%; background:${isConn ? '#10b981' : '#ef4444'}; display:inline-block;"></span>
                  ${integ.status}
                </span>
              </div>
              <div class="integration-details-list">
                <div class="integration-detail-row">
                  <span class="integration-detail-label">Last Sync:</span>
                  <span class="integration-detail-val" id="sync-time-${integ.id}">${integ.lastSync}</span>
                </div>
                <div class="integration-detail-row">
                  <span class="integration-detail-label">Workspace:</span>
                  <span class="integration-detail-val">${integ.workspace}</span>
                </div>
                <div class="integration-detail-row">
                  <span class="integration-detail-label">Data Sources:</span>
                  <span class="integration-detail-val">${integ.dataSources}</span>
                </div>
              </div>
            </div>
            <div class="integration-actions-row">
              <button class="btn-integ-action btn-integ-toggle" data-id="${integ.id}">
                ${isConn ? 'Disconnect' : 'Connect'}
              </button>
              <button class="btn-integ-action btn-integ-test" data-id="${integ.id}" data-name="${integ.name}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Test Connection
              </button>
              <button class="btn-integ-action btn-integ-refresh" data-id="${integ.id}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Refresh
              </button>
            </div>
          </div>
        `;
      }).join('');
    };

    // Render helper for API Configuration Table
    const renderApiConfigTable = () => {
      return data.apiConfiguration.map(api => {
        const isConfigured = api.status === 'Configured';
        return `
          <tr>
            <td style="font-weight:600; color:#fff;">${api.name}</td>
            <td><code style="background:rgba(0,0,0,0.3); padding:0.15rem 0.4rem; border-radius:4px; color:var(--accent-cyan);">${api.envVar}</code></td>
            <td>
              <span class="${isConfigured ? 'badge-configured' : 'badge-not-configured'}">
                ${api.status}
              </span>
            </td>
            <td style="font-size:0.75rem; color:var(--text-muted);">${api.lastRotated}</td>
            <td>
              <button class="btn-integ-action btn-verify-secret" data-env="${api.envVar}">
                Verify Vault Link
              </button>
            </td>
          </tr>
        `;
      }).join('');
    };

    // Render helper for User Roles
    const renderUserRolesTable = () => {
      return data.userRoles.map(user => {
        return `
          <tr>
            <td style="display:flex; align-items:center; gap:0.5rem; font-weight:600; color:#fff;">
              <div style="width:24px; height:24px; border-radius:50%; background:rgba(14,165,233,0.2); border:1px solid var(--accent-cyan); display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:var(--accent-cyan);">
                ${user.name.charAt(0)}
              </div>
              ${user.name}
            </td>
            <td style="font-family:var(--font-mono); font-size:0.75rem;">${user.email}</td>
            <td>
              <span style="background:rgba(255,255,255,0.06); padding:0.2rem 0.5rem; border-radius:4px; font-size:0.75rem; color:#fff;">
                ${user.role}
              </span>
            </td>
            <td>
              <span style="color:#10b981; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.3rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                ${user.status}
              </span>
            </td>
            <td>
              <button class="btn-integ-action btn-manage-user-role" data-user="${user.name}">
                Manage Role
              </button>
            </td>
          </tr>
        `;
      }).join('');
    };

    // Render helper for Audit Logs Table
    const renderAuditLogsTable = () => {
      return data.auditLogs.map(log => {
        let badgeClass = 'badge-audit-info';
        if (log.status === 'Success') badgeClass = 'badge-audit-success';
        if (log.status.includes('Blocked')) badgeClass = 'badge-audit-blocked';

        return `
          <tr>
            <td style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${log.timestamp}</td>
            <td style="font-weight:500; color:#fff;">${log.user}</td>
            <td>
              <code style="background:rgba(14,165,233,0.1); color:var(--accent-cyan); padding:0.15rem 0.35rem; border-radius:3px; font-size:0.72rem;">${log.action}</code>
            </td>
            <td style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-secondary);">${log.resource}</td>
            <td>
              <span class="${badgeClass}">${log.status}</span>
            </td>
          </tr>
        `;
      }).join('');
    };

    container.innerHTML = `
      <div class="view-container">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-block">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Enterprise Platform Configuration Center
            </h2>
            <p>Unified administration hub for observability integrations, AI model tuning, detection rules, security RBAC & immutable audit logs</p>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <button class="btn-integ-action" id="btn-export-settings" style="padding:0.45rem 0.9rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Manifest
            </button>
            <button class="btn-launch-copilot" id="btn-save-all-settings" style="width:auto; padding:0.45rem 1.2rem; font-size:0.82rem;">
              Save & Apply Settings 💾
            </button>
          </div>
        </div>

        <!-- Section Navigation Bar -->
        <div class="settings-nav-bar">
          <button class="settings-nav-btn active" data-target="sec-integrations">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            1. Monitoring Integrations
          </button>
          <button class="settings-nav-btn" data-target="sec-ai">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path><path d="M12 12L2.5 7.5"></path></svg>
            2. AI Configuration
          </button>
          <button class="settings-nav-btn" data-target="sec-rules">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            3. Incident Rules
          </button>
          <button class="settings-nav-btn" data-target="sec-notifications">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            4. Notifications
          </button>
          <button class="settings-nav-btn" data-target="sec-security">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            5. Security
          </button>
          <button class="settings-nav-btn" data-target="sec-roles">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            6. User Roles
          </button>
          <button class="settings-nav-btn" data-target="sec-api">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            7. API Configuration
          </button>
          <button class="settings-nav-btn" data-target="sec-audit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            8. Audit Logs
          </button>
        </div>

        <!-- 1. MONITORING INTEGRATIONS -->
        <div class="settings-section-card" id="sec-integrations">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                1. Monitoring Integrations
              </div>
              <div class="settings-section-desc">Manage connected Azure observability collectors, distributed tracing pipelines, and telemetry sources</div>
            </div>
            <button class="btn-integ-action" id="btn-refresh-all-monitors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Refresh All Connections
            </button>
          </div>
          <div class="integrations-grid" id="integrations-container">
            ${renderIntegrations()}
          </div>
        </div>

        <!-- 2. AI CONFIGURATION -->
        <div class="settings-section-card" id="sec-ai">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                2. AI Configuration
              </div>
              <div class="settings-section-desc">Tune LLM reasoning models, inference temperature, and response window parameters</div>
            </div>
          </div>

          <div class="security-notice-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <div>
              <strong>Secure Key Storage:</strong> AI API keys and client credentials are fully protected and loaded via system environment variables (<code>GEMINI_API_KEY</code>). Plaintext secrets are strictly never exposed in the browser.
            </div>
          </div>

          <div class="rules-config-grid">
            <div class="config-field-box">
              <label class="config-field-label">
                <span>AI Provider</span>
                <span class="badge-configured">Active</span>
              </label>
              <select class="form-select" id="ai-provider-select">
                <option selected>Google Vertex AI & Gemini 1.5</option>
                <option>Azure OpenAI Service</option>
                <option>Anthropic Claude Enterprise (AWS Bedrock)</option>
              </select>
              <div class="config-field-desc">Primary AI backend for telemetry reasoning & incident diagnosis.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Model Architecture</span>
                <span style="color:var(--accent-cyan); font-size:0.75rem;">Fine-Tuned</span>
              </label>
              <select class="form-select" id="ai-model-select">
                <option selected>gemini-1.5-flash (Low-latency SRE Fine-tuned)</option>
                <option>gemini-1.5-pro (Deep Multi-modal Diagnostics)</option>
                <option>gpt-4o (Azure High-Performance)</option>
                <option>claude-3-5-sonnet (Code & Root-Cause Synthesizer)</option>
              </select>
              <div class="config-field-desc">Optimized for sub-second log parsing and dependency tree graph traversal.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Inference Temperature</span>
                <span id="temp-val-display" style="font-family:var(--font-mono); font-weight:600; color:#fff;">0.3</span>
              </label>
              <input type="range" min="0.0" max="1.0" step="0.05" value="0.3" class="form-input" id="ai-temp-slider" style="padding:0.2rem; cursor:pointer;" />
              <div class="config-field-desc">Lower values (0.1 - 0.3) provide deterministic, accurate root-cause hypotheses.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Maximum Response Length</span>
                <span style="font-family:var(--font-mono); font-size:0.75rem;">Tokens</span>
              </label>
              <input type="number" class="form-input" id="ai-max-tokens" value="2048" min="512" max="8192" step="256" />
              <div class="config-field-desc">Response ceiling per autonomous diagnosis and interactive copilot session.</div>
            </div>
          </div>
        </div>

        <!-- 3. INCIDENT DETECTION RULES -->
        <div class="settings-section-card" id="sec-rules">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                3. Incident Detection Rules & Thresholds
              </div>
              <div class="settings-section-desc">Establish automated alert triggers and anomaly thresholds across microservices</div>
            </div>
            <button class="btn-integ-action" id="btn-reset-rules">Revert Defaults</button>
          </div>

          <div class="rules-config-grid">
            <div class="config-field-box">
              <label class="config-field-label">
                <span>Error Rate Threshold</span>
                <span style="color:#ef4444; font-weight:600;">Trigger Alert</span>
              </label>
              <input type="text" class="form-input" id="rule-error-rate" value="${data.incidentRules.errorRateThreshold}" />
              <div class="config-field-desc">Exceeding this error percentage triggers an automated Sev-2 triage.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>HTTP 5xx Threshold</span>
                <span style="color:#f59e0b; font-weight:600;">Server Errors</span>
              </label>
              <input type="text" class="form-input" id="rule-http-5xx" value="${data.incidentRules.http5xxThreshold}" />
              <div class="config-field-desc">Sustained rate of HTTP 500/502/503/504 errors per second.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Latency Threshold (p99)</span>
                <span style="color:#f59e0b; font-weight:600;">Degraded</span>
              </label>
              <input type="text" class="form-input" id="rule-latency" value="${data.incidentRules.latencyThreshold}" />
              <div class="config-field-desc">99th percentile response duration before flagging service degradation.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>CPU Threshold</span>
                <span style="color:#ef4444; font-weight:600;">Pod Saturation</span>
              </label>
              <input type="text" class="form-input" id="rule-cpu" value="${data.incidentRules.cpuThreshold}" />
              <div class="config-field-desc">Kubernetes node / container CPU throttle threshold.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Memory Threshold</span>
                <span style="color:#ef4444; font-weight:600;">OOM Risk</span>
              </label>
              <input type="text" class="form-input" id="rule-memory" value="${data.incidentRules.memoryThreshold}" />
              <div class="config-field-desc">Memory limit ceiling before triggering heap dump analysis.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Recurring Incident Threshold</span>
                <span style="color:var(--accent-cyan); font-weight:600;">Pattern Match</span>
              </label>
              <input type="text" class="form-input" id="rule-recurring" value="${data.incidentRules.recurringThreshold}" />
              <div class="config-field-desc">Identifies repeat incidents to automatically attach known solutions.</div>
            </div>
          </div>
        </div>

        <!-- 4. NOTIFICATIONS -->
        <div class="settings-section-card" id="sec-notifications">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                4. Notifications & Incident Escalation Channels
              </div>
              <div class="settings-section-desc">Broadcast real-time incident updates to on-call engineers via Email, Microsoft Teams, and Webhook dispatchers</div>
            </div>
          </div>

          <div class="rules-config-grid">
            <!-- Email Notification -->
            <div class="config-field-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; color:#fff;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Email Alerts
                </div>
                <span class="badge-configured">Enabled</span>
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Recipients List</label>
                <input type="text" class="form-input" value="${data.notifications.email.recipients}" />
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Severity Filter</label>
                <input type="text" class="form-input" value="${data.notifications.email.severityFilter}" />
              </div>
              <button class="btn-integ-action btn-test-notification" data-channel="Email" style="width:100%; justify-content:center; margin-top:0.4rem;">
                Send Test Email
              </button>
            </div>

            <!-- Microsoft Teams -->
            <div class="config-field-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; color:#fff;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Microsoft Teams
                </div>
                <span class="badge-configured">Connected</span>
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Target Channel</label>
                <input type="text" class="form-input" value="${data.notifications.teams.channel}" />
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Connector Webhook (Secured)</label>
                <input type="text" class="form-input" readonly value="${data.notifications.teams.webhookUrl}" style="background:rgba(0,0,0,0.3); font-family:var(--font-mono); color:var(--text-muted);" />
              </div>
              <button class="btn-integ-action btn-test-notification" data-channel="Microsoft Teams" style="width:100%; justify-content:center; margin-top:0.4rem;">
                Trigger Teams Incident Card
              </button>
            </div>

            <!-- Webhook -->
            <div class="config-field-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; color:#fff;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Generic Webhook
                </div>
                <span class="badge-configured">Configured</span>
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Endpoint URL</label>
                <input type="text" class="form-input" value="${data.notifications.webhook.endpoint}" />
              </div>
              <div class="form-group" style="margin-bottom:0.5rem;">
                <label class="form-label" style="font-size:0.75rem;">Authentication Header</label>
                <input type="text" class="form-input" readonly value="${data.notifications.webhook.authHeader}" style="background:rgba(0,0,0,0.3); font-family:var(--font-mono); color:var(--text-muted);" />
              </div>
              <button class="btn-integ-action btn-test-notification" data-channel="Webhook" style="width:100%; justify-content:center; margin-top:0.4rem;">
                Dispatch CloudEvent Ping
              </button>
            </div>
          </div>
        </div>

        <!-- 5. SECURITY -->
        <div class="settings-section-card" id="sec-security">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                5. Security & Session Policies
              </div>
              <div class="settings-section-desc">Identity authentication, multi-factor enforcement, role management policies, and session expiration locks</div>
            </div>
          </div>

          <div class="rules-config-grid">
            <div class="config-field-box">
              <label class="config-field-label">
                <span>Enterprise SSO Provider</span>
                <span class="badge-configured">Active</span>
              </label>
              <input type="text" class="form-input" readonly value="${data.securitySettings.authentication}" style="background:rgba(0,0,0,0.3);" />
              <div class="config-field-desc">Integrated with Azure Active Directory (Microsoft Entra ID) OIDC.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Multi-Factor Authentication</span>
                <span class="badge-configured">Enforced</span>
              </label>
              <select class="form-select">
                <option selected>Strict MFA Required (FIDO2 / Authenticator App)</option>
                <option>Conditional Access Policy</option>
                <option>Optional for Internal Subnet</option>
              </select>
              <div class="config-field-desc">Mandatory hardware or TOTP key requirement for all SRE leads.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Session Expiration Timeout</span>
                <span style="font-family:var(--font-mono);">${data.securitySettings.sessionTimeout}</span>
              </label>
              <select class="form-select">
                <option selected>60 minutes</option>
                <option>30 minutes</option>
                <option>15 minutes</option>
                <option>120 minutes</option>
              </select>
              <div class="config-field-desc">Maximum active token lifespan before mandatory token renewal.</div>
            </div>

            <div class="config-field-box">
              <label class="config-field-label">
                <span>Idle Auto-Lock Timeout</span>
                <span style="font-family:var(--font-mono);">${data.securitySettings.idleLock}</span>
              </label>
              <select class="form-select">
                <option selected>15 minutes (Standard Enterprise)</option>
                <option>5 minutes (High Security)</option>
                <option>30 minutes</option>
              </select>
              <div class="config-field-desc">Locks console when no user interaction is detected.</div>
            </div>
          </div>
        </div>

        <!-- 6. USER ROLES -->
        <div class="settings-section-card" id="sec-roles">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                6. User Roles & Access Control
              </div>
              <div class="settings-section-desc">Role-Based Access Control (RBAC) assignments and verified multi-factor credentials</div>
            </div>
            <button class="btn-integ-action" id="btn-invite-user">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Invite Member
            </button>
          </div>

          <div class="settings-table-wrapper">
            <table class="settings-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>MFA Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${renderUserRolesTable()}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 7. API CONFIGURATION -->
        <div class="settings-section-card" id="sec-api">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                7. API Configuration & Vault Secret Bindings
              </div>
              <div class="settings-section-desc">Environment-injected secrets and third-party API configurations without browser exposure</div>
            </div>
          </div>

          <div class="security-notice-banner" style="border-color:rgba(16, 185, 129, 0.3); background:rgba(16, 185, 129, 0.08); color:#a7f3d0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <strong>Zero Secret Exposure Policy:</strong> Passwords, client secrets, and authentication keys are resolved on the secure backend runner via Azure Key Vault bindings. The frontend only displays <code>Configured</code> / <code>Not Configured</code> states.
            </div>
          </div>

          <div class="settings-table-wrapper">
            <table class="settings-table">
              <thead>
                <tr>
                  <th>Secret / Credential</th>
                  <th>Environment Variable</th>
                  <th>Configuration Status</th>
                  <th>Last Rotated</th>
                  <th>Audit Action</th>
                </tr>
              </thead>
              <tbody>
                ${renderApiConfigTable()}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 8. AUDIT LOGS -->
        <div class="settings-section-card" id="sec-audit">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                8. Enterprise Audit Logs & Compliance Trail
              </div>
              <div class="settings-section-desc">Immutable append-only record of all administrative actions, config adjustments, and automated remediations</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-integ-action" id="btn-export-audit">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
              <button class="btn-integ-action" id="btn-refresh-audit">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Refresh Log
              </button>
            </div>
          </div>

          <div class="settings-table-wrapper">
            <table class="settings-table" id="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Actor</th>
                  <th>Action</th>
                  <th>Target Resource</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="audit-logs-tbody">
                ${renderAuditLogsTable()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Interactive event listeners

    // 1. Navigation Section Scrolling
    const navButtons = container.querySelectorAll('.settings-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 2. Monitoring Integrations - Connect / Disconnect Toggle
    container.querySelectorAll('.btn-integ-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const integ = data.monitoringIntegrations.find(m => m.id === id);
        if (!integ) return;

        const isCurrentlyConnected = integ.status === 'Connected';
        integ.status = isCurrentlyConnected ? 'Disconnected' : 'Connected';
        
        // Update DOM
        const badge = document.getElementById(`status-badge-${id}`);
        if (badge) {
          badge.className = `integration-status-badge ${integ.status === 'Connected' ? 'connected' : 'disconnected'}`;
          badge.innerHTML = `
            <span style="width:6px; height:6px; border-radius:50%; background:${integ.status === 'Connected' ? '#10b981' : '#ef4444'}; display:inline-block;"></span>
            ${integ.status}
          `;
        }
        btn.textContent = integ.status === 'Connected' ? 'Disconnect' : 'Connect';

        toast.show({
          title: `${integ.name} ${integ.status}`,
          message: `Integration status transitioned to ${integ.status} successfully.`,
          type: integ.status === 'Connected' ? 'success' : 'warning'
        });
      });
    });

    // 3. Test Connection Button
    container.querySelectorAll('.btn-integ-test').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const id = btn.getAttribute('data-id');
        const origText = btn.innerHTML;
        btn.innerHTML = `<span>Probing...</span>`;
        btn.disabled = true;

        setTimeout(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
          const syncEl = document.getElementById(`sync-time-${id}`);
          if (syncEl) syncEl.textContent = "Just now";

          toast.show({
            title: `Connection Verified: ${name}`,
            message: `Health probe returned 200 OK (Latency: 18ms, Telemetry stream active).`,
            type: "success"
          });
        }, 600);
      });
    });

    // 4. Refresh Integration Button
    container.querySelectorAll('.btn-integ-refresh').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const syncEl = document.getElementById(`sync-time-${id}`);
        if (syncEl) syncEl.textContent = "Just now";

        toast.show({
          title: "Telemetry Refreshed",
          message: "Data sources re-indexed and synchronized with Azure metrics stream.",
          type: "info"
        });
      });
    });

    // Refresh all monitors
    document.getElementById('btn-refresh-all-monitors')?.addEventListener('click', () => {
      data.monitoringIntegrations.forEach(integ => {
        const syncEl = document.getElementById(`sync-time-${integ.id}`);
        if (syncEl) syncEl.textContent = "Just now";
      });
      toast.show({
        title: "All Monitors Synchronized",
        message: "Azure Monitor, Application Insights, and Log Analytics telemetry streams verified.",
        type: "success"
      });
    });

    // 5. Temperature Slider display
    const tempSlider = document.getElementById('ai-temp-slider');
    const tempDisplay = document.getElementById('temp-val-display');
    if (tempSlider && tempDisplay) {
      tempSlider.addEventListener('input', (e) => {
        tempDisplay.textContent = e.target.value;
      });
    }

    // 6. Reset Detection Rules
    document.getElementById('btn-reset-rules')?.addEventListener('click', () => {
      document.getElementById('rule-error-rate').value = "5.0%";
      document.getElementById('rule-http-5xx').value = "10 req/s";
      document.getElementById('rule-latency').value = "2,000ms p99";
      document.getElementById('rule-cpu').value = "85%";
      document.getElementById('rule-memory').value = "90%";
      document.getElementById('rule-recurring').value = "3 occurrences in 14 days";

      toast.show({
        title: "Thresholds Reset",
        message: "Incident detection rules restored to recommended enterprise baseline.",
        type: "info"
      });
    });

    // 7. Notification Channel Tests
    container.querySelectorAll('.btn-test-notification').forEach(btn => {
      btn.addEventListener('click', () => {
        const channel = btn.getAttribute('data-channel');
        toast.show({
          title: `Test Dispatched: ${channel}`,
          message: `Sample Sev-1 incident alert delivered to configured ${channel} target.`,
          type: "success"
        });
      });
    });

    // 8. User Management Actions
    container.querySelectorAll('.btn-manage-user-role').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = btn.getAttribute('data-user');
        toast.show({
          title: `RBAC Policy: ${user}`,
          message: `Role permissions and MFA keys verified with Entra ID directory.`,
          type: "info"
        });
      });
    });

    document.getElementById('btn-invite-user')?.addEventListener('click', () => {
      toast.show({
        title: "Invite Member",
        message: "Enterprise SSO directory invite link generated for Entra ID directory.",
        type: "info"
      });
    });

    // 9. API Configuration Secret Verification
    container.querySelectorAll('.btn-verify-secret').forEach(btn => {
      btn.addEventListener('click', () => {
        const envVar = btn.getAttribute('data-env');
        toast.show({
          title: `Vault Binding: ${envVar}`,
          message: `Environment binding verified. Secret remains securely masked in Vault.`,
          type: "success"
        });
      });
    });

    // 10. Audit Log Actions
    document.getElementById('btn-export-audit')?.addEventListener('click', () => {
      toast.show({
        title: "Audit Trail Exported",
        message: "SOC2/ISO27001 compliant audit log exported as signed CSV report.",
        type: "success"
      });
    });

    document.getElementById('btn-refresh-audit')?.addEventListener('click', () => {
      toast.show({
        title: "Audit Stream Synced",
        message: "Loaded latest immutable log events from Azure Sentinel workspace.",
        type: "info"
      });
    });

    // 11. Save & Export All Settings
    document.getElementById('btn-export-settings')?.addEventListener('click', () => {
      toast.show({
        title: "Configuration Exported",
        message: "Platform manifest YAML exported for GitOps CI/CD sync.",
        type: "success"
      });
    });

    document.getElementById('btn-save-all-settings')?.addEventListener('click', () => {
      toast.show({
        title: "Enterprise Settings Saved",
        message: "All 8 configuration modules updated and synchronized across production clusters.",
        type: "success"
      });
    });
  }
}
