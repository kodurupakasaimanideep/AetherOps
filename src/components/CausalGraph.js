export class CausalGraph {
  constructor(containerId, onSelectNode) {
    this.container = document.getElementById(containerId);
    this.onSelectNode = onSelectNode;
    this.scale = 1;
  }

  render(incident) {
    if (!this.container) return;

    const nodes = incident.causalNodes || [];
    const edges = incident.causalEdges || [];

    // Layout configuration
    const width = 640;
    const height = 360;

    // Arrange nodes in logical topology
    // Entry (left), Gateway (mid-left), AKS Services (center), DB/Cache (right)
    const positions = {
      client: { x: 70, y: 180 },
      apigw: { x: 220, y: 180 },
      aks: { x: 380, y: 120 },
      auth: { x: 380, y: 260 },
      cosmos: { x: 550, y: 80 },
      redis: { x: 550, y: 190 },
      eventgrid: { x: 550, y: 300 }
    };

    let edgesSvg = edges.map(edge => {
      const fromPos = positions[edge.from] || { x: 100, y: 100 };
      const toPos = positions[edge.to] || { x: 300, y: 300 };

      const stroke = edge.isCriticalPath ? '#ef4444' : 'rgba(255,255,255,0.2)';
      const strokeWidth = edge.isCriticalPath ? '3' : '1.5';
      const dashArray = edge.isCriticalPath ? 'none' : '4,4';

      return `
        <g class="graph-edge">
          <line x1="${fromPos.x}" y1="${fromPos.y}" x2="${toPos.x}" y2="${toPos.y}" 
                stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArray}" />
          ${edge.isCriticalPath ? `
            <circle r="3" fill="#ef4444">
              <animateMotion path="M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}" dur="1.8s" repeatCount="indefinite" />
            </circle>
          ` : ''}
        </g>
      `;
    }).join("");

    let nodesSvg = nodes.map(node => {
      const pos = positions[node.id] || { x: 300, y: 180 };
      
      let statusColor = '#10b981';
      let statusBg = 'rgba(16, 185, 129, 0.15)';
      let glowFilter = '';

      if (node.status === 'critical' || node.isCulprit) {
        statusColor = '#ef4444';
        statusBg = 'rgba(239, 68, 68, 0.25)';
        glowFilter = 'filter="url(#glow-critical)"';
      } else if (node.status === 'degraded' || node.status === 'throttled') {
        statusColor = '#f97316';
        statusBg = 'rgba(249, 115, 22, 0.2)';
      }

      return `
        <g class="graph-node-group" style="cursor: pointer;" data-node-id="${node.id}" transform="translate(${pos.x}, ${pos.y})">
          ${node.isCulprit ? `
            <circle cx="0" cy="0" r="34" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6">
              <animate attributeName="r" values="28;38;28" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          ` : ''}
          <rect x="-65" y="-22" width="130" height="44" rx="8" fill="#111827" stroke="${statusColor}" stroke-width="${node.isCulprit ? '2.5' : '1.5'}" ${glowFilter} />
          <circle cx="-48" cy="0" r="5" fill="${statusColor}"></circle>
          <text x="-36" y="-3" fill="#f8fafc" font-size="10" font-weight="600" font-family="sans-serif">${node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}</text>
          <text x="-36" y="11" fill="#94a3b8" font-size="8.5" font-family="monospace">${node.latency} | ${node.errors}</text>
        </g>
      `;
    }).join("");

    this.container.innerHTML = `
      <div class="causal-graph-container">
        <div class="graph-controls">
          <button class="graph-ctrl-btn" id="graph-zoom-in" title="Zoom In">+</button>
          <button class="graph-ctrl-btn" id="graph-zoom-out" title="Zoom Out">-</button>
          <button class="graph-ctrl-btn" id="graph-reset" title="Reset View">↺</button>
        </div>
        <div class="graph-legend">
          <div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span> Healthy</div>
          <div class="legend-item"><span class="legend-dot" style="background:#f97316;"></span> Degraded</div>
          <div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span> Root Cause Culprit</div>
        </div>
        <svg viewBox="0 0 ${width} ${height}" class="graph-svg" id="causal-graph-svg">
          <defs>
            <filter id="glow-critical" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g id="graph-viewport">
            ${edgesSvg}
            ${nodesSvg}
          </g>
        </svg>
      </div>
    `;

    // Wire click events on nodes
    const nodeGroups = this.container.querySelectorAll('.graph-node-group');
    nodeGroups.forEach(grp => {
      grp.addEventListener('click', () => {
        const nodeId = grp.getAttribute('data-node-id');
        const nodeData = nodes.find(n => n.id === nodeId);
        if (this.onSelectNode && nodeData) {
          this.onSelectNode(nodeData);
        }
      });
    });

    // Zoom controls
    const svgViewport = this.container.querySelector('#graph-viewport');
    document.getElementById('graph-zoom-in')?.addEventListener('click', () => {
      this.scale = Math.min(this.scale + 0.15, 1.8);
      svgViewport.setAttribute('transform', `scale(${this.scale})`);
    });
    document.getElementById('graph-zoom-out')?.addEventListener('click', () => {
      this.scale = Math.max(this.scale - 0.15, 0.6);
      svgViewport.setAttribute('transform', `scale(${this.scale})`);
    });
    document.getElementById('graph-reset')?.addEventListener('click', () => {
      this.scale = 1;
      svgViewport.removeAttribute('transform');
    });
  }
}
