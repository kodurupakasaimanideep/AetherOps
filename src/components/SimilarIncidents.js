import { toast } from './ToastManager.js';

export class SimilarIncidents {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(incident) {
    if (!this.container) return;

    const similar = incident.similarIncidents || [];
    if (similar.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <div class="empty-title">No Similar Past Incidents</div>
          <div class="empty-desc">This signature appears to be novel across historical Azure telemetry.</div>
        </div>
      `;
      return;
    }

    const cardsHtml = similar.map(item => {
      return `
        <div class="similar-card">
          <div class="similar-header">
            <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--azure-cyan);">${item.id}</span>
            <span class="match-score-badge">${item.similarity}% Semantic Match</span>
          </div>
          <div class="similar-title">${item.title}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">Resolved: ${item.resolvedAgo} | MTTR: ${item.mttr}</div>
          
          <div class="similar-detail-row">
            <strong style="color:var(--text-primary); display:block; margin-bottom:2px;">Historic Root Cause:</strong>
            ${item.rootCause}
          </div>

          <div style="font-size:0.75rem; color:#34d399; margin-top:0.2rem;">
            <strong>Verified Fix:</strong> ${item.fixApplied}
          </div>

          <button class="btn btn-outline btn-sm apply-past-fix-btn" data-fix="${item.fixApplied}" style="margin-top:0.4rem; justify-content:center; font-size:0.75rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Apply Runbook from ${item.id}
          </button>
        </div>
      `;
    }).join("");

    this.container.innerHTML = `
      <div class="similar-grid">
        ${cardsHtml}
      </div>
    `;

    // Wire buttons
    const buttons = this.container.querySelectorAll('.apply-past-fix-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const fix = btn.getAttribute('data-fix');
        toast.show({
          title: "Runbook Applied",
          message: `Applying historic remediation: "${fix}"`,
          type: "success"
        });
      });
    });
  }
}
