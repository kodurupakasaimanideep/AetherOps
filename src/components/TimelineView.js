export class TimelineView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(incident, filterType = 'all') {
    if (!this.container) return;

    let items = incident.timeline || [];
    if (filterType !== 'all') {
      items = items.filter(it => it.type === filterType);
    }

    if (items.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <div class="empty-title">No Timeline Events</div>
          <div class="empty-desc">No events matched the selected filter criteria.</div>
        </div>
      `;
      return;
    }

    const itemsHtml = items.map(item => {
      return `
        <div class="timeline-item type-${item.type}">
          <div class="timeline-bullet"></div>
          <div class="timeline-header-row">
            <span class="timeline-title">${item.title}</span>
            <span class="timeline-time">${item.time}</span>
          </div>
          <div style="display:flex; gap:0.4rem; margin-bottom:0.3rem;">
            <span class="info-chip" style="font-size:0.65rem; padding:1px 5px;">${item.badge}</span>
            <span class="info-chip" style="font-size:0.65rem; padding:1px 5px; color:var(--azure-cyan);">${item.author}</span>
          </div>
          <p class="timeline-desc">${item.desc}</p>
        </div>
      `;
    }).join("");

    this.container.innerHTML = `
      <div class="timeline-list">
        ${itemsHtml}
      </div>
    `;
  }
}
