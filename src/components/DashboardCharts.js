export class DashboardCharts {
  // Mini sparkline generator for KPI cards
  static renderSparkline(svgId, pointsArray, strokeColor = "#00d2ff") {
    const el = document.getElementById(svgId);
    if (!el) return;

    const width = 50;
    const height = 20;
    const pad = 2;
    const max = Math.max(...pointsArray);
    const min = Math.min(...pointsArray);
    const range = max - min || 1;

    const getX = (i) => pad + (i * (width - 2 * pad)) / (pointsArray.length - 1);
    const getY = (v) => height - pad - ((v - min) / range) * (height - 2 * pad);

    const points = pointsArray.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");

    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
        <polyline fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      </svg>
    `;
  }

  // Large Incidents Over Time Area Chart
  static renderIncidentsOverTime(containerId, timeframe = "day") {
    const el = document.getElementById(containerId);
    if (!el) return;

    let data = [];
    if (timeframe === "day") {
      data = [
        { label: "Oct 14", val: 14 },
        { label: "Oct 15", val: 18 },
        { label: "Oct 16 (Spike)", val: 38, isPeak: true },
        { label: "Oct 17", val: 21 },
        { label: "Oct 18", val: 16 }
      ];
    } else if (timeframe === "week") {
      data = [
        { label: "Wk 1", val: 62 },
        { label: "Wk 2", val: 54 },
        { label: "Wk 3 (Spike)", val: 98, isPeak: true },
        { label: "Wk 4", val: 34 }
      ];
    } else {
      data = [
        { label: "Aug", val: 180 },
        { label: "Sep", val: 210 },
        { label: "Oct (Peak)", val: 248, isPeak: true }
      ];
    }

    const width = 460;
    const height = 150;
    const padX = 35;
    const padY = 25;

    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const minVal = 0;

    const getX = (i) => padX + (i * (width - 2 * padX)) / (data.length - 1);
    const getY = (v) => height - padY - ((v - minVal) / (maxVal - minVal)) * (height - 2 * padY);

    const linePoints = data.map((d, i) => `${getX(i)},${getY(d.val)}`).join(" ");
    const areaPoints = `${getX(0)},${height - padY} ${linePoints} ${getX(data.length - 1)},${height - padY}`;

    let dotsAndLabels = data.map((d, i) => {
      const cx = getX(i);
      const cy = getY(d.val);

      if (d.isPeak) {
        return `
          <!-- Peak Callout Tag -->
          <g>
            <rect x="${cx - 65}" y="${cy - 28}" width="130" height="20" rx="4" fill="rgba(239, 68, 68, 0.85)" stroke="#ef4444" stroke-width="1" />
            <text x="${cx}" y="${cy - 14}" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700" font-family="monospace">
              Peak: ${d.val}/day (Oct 16 Outage)
            </text>
            <circle cx="${cx}" cy="${cy}" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="2">
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="${cx}" y="${height - 8}" text-anchor="middle" fill="#ef4444" font-weight="700" font-size="9.5">${d.label}</text>
          </g>
        `;
      }

      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="3.5" fill="#00d2ff" stroke="#070b14" stroke-width="1.5"></circle>
          <text x="${cx}" y="${height - 8}" text-anchor="middle" fill="#8b9bb4" font-size="9">${d.label}</text>
        </g>
      `;
    }).join("");

    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="areaGlowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.4"/>
            <stop offset="80%" stop-color="#00d2ff" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="#00d2ff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        <!-- Grid horizontal guidelines -->
        <line x1="${padX}" y1="${getY(maxVal * 0.75)}" x2="${width - padX}" y2="${getY(maxVal * 0.75)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 3" />
        <line x1="${padX}" y1="${getY(maxVal * 0.35)}" x2="${width - padX}" y2="${getY(maxVal * 0.35)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 3" />
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="rgba(255,255,255,0.1)" />

        <!-- Area fill & Line -->
        <polygon points="${areaPoints}" fill="url(#areaGlowGrad)" />
        <polyline fill="none" stroke="#00d2ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${linePoints}" />
        
        ${dotsAndLabels}
      </svg>
    `;
  }

  // Severity Donut Chart
  static renderSeverityDonut(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    // 248 total: Critical 4, High 12, Med 62, Low 170
    // Circumference = 2 * PI * 42 ~= 263.89
    const total = 248;
    const c = 263.89;

    const lowLen = (170 / total) * c;
    const medLen = (62 / total) * c;
    const highLen = (12 / total) * c;
    const critLen = (4 / total) * c;

    el.innerHTML = `
      <svg viewBox="0 0 100 100" style="width:100%; height:100%; transform: rotate(-90deg);">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#152238" stroke-width="11" />
        
        <!-- Low (Cyan) -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2ff" stroke-width="11"
          stroke-dasharray="${lowLen} ${c - lowLen}" stroke-dashoffset="0" />
        
        <!-- Medium (Blue) -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" stroke-width="11"
          stroke-dasharray="${medLen} ${c - medLen}" stroke-dashoffset="-${lowLen}" />
        
        <!-- High (Orange) -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f97316" stroke-width="11"
          stroke-dasharray="${highLen} ${c - highLen}" stroke-dashoffset="-${lowLen + medLen}" />

        <!-- Critical (Red) -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ef4444" stroke-width="11"
          stroke-dasharray="${critLen} ${c - critLen}" stroke-dashoffset="-${lowLen + medLen + highLen}" />
      </svg>
    `;
  }

  // MTTR Velocity Trend Line with step progression
  static renderMttrVelocity(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const steps = [
      { week: "Week 1", val: 68, display: "68 min" },
      { week: "Week 2", val: 51, display: "51 min" },
      { week: "Week 3", val: 42, display: "42 min" },
      { week: "Week 4", val: 18, display: "18 min" }
    ];

    const width = 340;
    const height = 100;
    const padX = 30;
    const padY = 20;

    const maxVal = 75;
    const minVal = 10;

    const getX = (i) => padX + (i * (width - 2 * padX)) / (steps.length - 1);
    const getY = (v) => height - padY - ((v - minVal) / (maxVal - minVal)) * (height - 2 * padY);

    const points = steps.map((s, i) => `${getX(i)},${getY(s.val)}`).join(" ");

    let nodesSvg = steps.map((s, i) => {
      const cx = getX(i);
      const cy = getY(s.val);
      const isLatest = i === steps.length - 1;

      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${isLatest ? 5.5 : 4}" fill="${isLatest ? '#10b981' : '#070b14'}" stroke="${isLatest ? '#ffffff' : '#00d2ff'}" stroke-width="2"></circle>
          <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="${isLatest ? '#34d399' : '#8b9bb4'}" font-size="8.5" font-family="monospace" font-weight="700">${s.display}</text>
          <text x="${cx}" y="${height - 4}" text-anchor="middle" fill="#54657e" font-size="8">${s.week}</text>
        </g>
      `;
    }).join("");

    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
        <polyline fill="none" stroke="#00d2ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
        ${nodesSvg}
      </svg>
    `;
  }

  // SLA Resolution Donut
  static renderResolutionHealthDonut(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    // 94% SLA
    const c = 263.89;
    const healthyLen = 0.94 * c;

    el.innerHTML = `
      <svg viewBox="0 0 100 100" style="width:100%; height:100%; transform: rotate(-90deg);">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#152238" stroke-width="9" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" stroke-width="9"
          stroke-dasharray="${healthyLen} ${c - healthyLen}" stroke-dashoffset="0" />
      </svg>
    `;
  }
}
