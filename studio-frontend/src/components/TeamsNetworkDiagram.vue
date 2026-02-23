<template>
  <div class="network-diagram" v-if="visible" ref="container">
    <h4>{{ $t("integrations.teams_wizard.media_host.network_diagram.title") }}</h4>

    <div class="network-diagram__grid" ref="grid">
      <!-- Microsoft Cloud Zone -->
      <div class="network-diagram__zone network-diagram__zone--microsoft" ref="zone_microsoft">
        <div class="network-diagram__zone-title">
          {{ $t("integrations.teams_wizard.media_host.network_diagram.zone_microsoft") }}
        </div>
        <div class="network-diagram__services">
          <div
            class="network-diagram__service"
            ref="service_teams"
            :class="{ highlighted: hoveredService && isConnected('teams') }"
            @mouseenter="hoveredService = 'teams'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_teams") }}
            </span>
            <span class="network-diagram__service-tech">Media Platform</span>
          </div>
          <div
            class="network-diagram__service"
            ref="service_graph"
            :class="{ highlighted: hoveredService && isConnected('graph') }"
            @mouseenter="hoveredService = 'graph'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_graph") }}
            </span>
            <span class="network-diagram__service-tech">REST API</span>
          </div>
        </div>
      </div>

      <!-- Media Host Zone -->
      <div class="network-diagram__zone network-diagram__zone--media-host" ref="zone_media_host">
        <div class="network-diagram__zone-title">
          {{ $t("integrations.teams_wizard.media_host.network_diagram.zone_media_host") }}
        </div>
        <div class="network-diagram__services">
          <div
            class="network-diagram__service"
            ref="service_bot"
            :class="{ highlighted: hoveredService && isConnected('bot') }"
            @mouseenter="hoveredService = 'bot'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_bot") }}
            </span>
            <span class="network-diagram__service-tech">.NET 4.8 / TCP 9441-9442</span>
          </div>
          <div
            class="network-diagram__service"
            ref="service_captions"
            :class="{ highlighted: hoveredService && isConnected('captions') }"
            @mouseenter="hoveredService = 'captions'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_captions") }}
            </span>
            <span class="network-diagram__service-tech">Node.js / TCP 443</span>
          </div>
        </div>
      </div>

      <!-- Backend Zone -->
      <div class="network-diagram__zone network-diagram__zone--backend" ref="zone_backend">
        <div class="network-diagram__zone-title">
          {{ $t("integrations.teams_wizard.media_host.network_diagram.zone_backend") }}
        </div>
        <div class="network-diagram__services">
          <div
            class="network-diagram__service"
            ref="service_session_api"
            :class="{ highlighted: hoveredService && isConnected('session_api') }"
            @mouseenter="hoveredService = 'session_api'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_session_api") }}
            </span>
            <span class="network-diagram__service-tech">Node.js / TCP 8000</span>
          </div>
          <div
            class="network-diagram__service"
            ref="service_mqtt"
            :class="{ highlighted: hoveredService && isConnected('mqtt') }"
            @mouseenter="hoveredService = 'mqtt'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_mqtt") }}
            </span>
            <span class="network-diagram__service-tech">Mosquitto / TCP 1883</span>
          </div>
          <div
            class="network-diagram__service"
            ref="service_transcriber"
            :class="{ highlighted: hoveredService && isConnected('transcriber') }"
            @mouseenter="hoveredService = 'transcriber'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_transcriber") }}
            </span>
            <span class="network-diagram__service-tech">Node.js / TCP 8890</span>
          </div>
        </div>
      </div>

      <!-- Client Zone -->
      <div class="network-diagram__zone network-diagram__zone--client" ref="zone_client">
        <div class="network-diagram__zone-title">
          {{ $t("integrations.teams_wizard.media_host.network_diagram.zone_client") }}
        </div>
        <div class="network-diagram__services">
          <div
            class="network-diagram__service"
            ref="service_frontend"
            :class="{ highlighted: hoveredService && isConnected('frontend') }"
            @mouseenter="hoveredService = 'frontend'"
            @mouseleave="hoveredService = null">
            <span class="network-diagram__service-name">
              {{ $t("integrations.teams_wizard.media_host.network_diagram.service_frontend") }}
            </span>
            <span class="network-diagram__service-tech">Vue.js / HTTPS</span>
          </div>
        </div>
      </div>

      <!-- SVG Overlay for connections -->
      <svg class="network-diagram__svg" ref="svg">
        <defs>
          <marker id="arrow-mqtt" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#27ae60" />
          </marker>
          <marker id="arrow-https" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#2196f3" />
          </marker>
          <marker id="arrow-ws" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#e67e22" />
          </marker>
          <marker id="arrow-rtp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#e74c3c" />
          </marker>
        </defs>
        <line
          v-for="(conn, idx) in svgLines"
          :key="idx"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          :stroke="protocolColors[conn.protocol]"
          :stroke-width="hoveredService && (conn.from === hoveredService || conn.to === hoveredService) ? 3 : 1.5"
          :opacity="hoveredService ? (conn.from === hoveredService || conn.to === hoveredService ? 1 : 0.15) : 0.7"
          :marker-end="'url(#arrow-' + conn.protocol + ')'"
          stroke-dasharray=""
          class="network-diagram__line" />
      </svg>
    </div>

    <!-- Legend -->
    <div class="network-diagram__legend">
      <span class="network-diagram__legend-title">
        {{ $t("integrations.teams_wizard.media_host.network_diagram.legend_title") }}:
      </span>
      <span v-for="(color, protocol) in protocolColors" :key="protocol" class="network-diagram__legend-item">
        <span class="network-diagram__legend-color" :style="{ background: color }"></span>
        {{ $t("integrations.teams_wizard.media_host.network_diagram.legend_" + protocol) }}
      </span>
    </div>
  </div>
</template>

<script>
const CONNECTIONS = [
  { from: "teams", to: "bot", protocol: "rtp", label: "Media streams" },
  { from: "graph", to: "bot", protocol: "https", label: "Call notifications" },
  { from: "bot", to: "graph", protocol: "https", label: "Join call / Graph API" },
  { from: "bot", to: "mqtt", protocol: "mqtt", label: "Audio publish" },
  { from: "bot", to: "session_api", protocol: "https", label: "Phone-home" },
  { from: "bot", to: "transcriber", protocol: "ws", label: "Audio stream" },
  { from: "captions", to: "mqtt", protocol: "mqtt", label: "Caption subscribe" },
  { from: "mqtt", to: "transcriber", protocol: "mqtt", label: "Audio dispatch" },
  { from: "transcriber", to: "mqtt", protocol: "mqtt", label: "Transcriptions" },
  { from: "frontend", to: "session_api", protocol: "https", label: "REST API" },
  { from: "frontend", to: "mqtt", protocol: "ws", label: "Live captions" },
]

export default {
  name: "TeamsNetworkDiagram",
  props: {
    config: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hoveredService: null,
      svgLines: [],
      protocolColors: {
        mqtt: "#27ae60",
        https: "#2196f3",
        ws: "#e67e22",
        rtp: "#e74c3c",
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => this.computeLines())
      }
    },
  },
  mounted() {
    this._resizeHandler = this.debounce(() => this.computeLines(), 200)
    window.addEventListener("resize", this._resizeHandler)
    if (this.visible) {
      this.$nextTick(() => this.computeLines())
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this._resizeHandler)
  },
  methods: {
    isConnected(serviceId) {
      return CONNECTIONS.some(
        c => c.from === serviceId || c.to === serviceId
      ) && CONNECTIONS.some(
        c =>
          (c.from === serviceId && c.to === this.hoveredService) ||
          (c.to === serviceId && c.from === this.hoveredService) ||
          serviceId === this.hoveredService
      )
    },
    computeLines() {
      const grid = this.$refs.grid
      if (!grid) return
      const gridRect = grid.getBoundingClientRect()

      const svg = this.$refs.svg
      if (svg) {
        svg.setAttribute("width", gridRect.width)
        svg.setAttribute("height", gridRect.height)
      }

      this.svgLines = CONNECTIONS.map(conn => {
        const fromEl = this.$refs["service_" + conn.from]
        const toEl = this.$refs["service_" + conn.to]
        if (!fromEl || !toEl) return null

        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()

        return {
          x1: fromRect.left + fromRect.width / 2 - gridRect.left,
          y1: fromRect.top + fromRect.height / 2 - gridRect.top,
          x2: toRect.left + toRect.width / 2 - gridRect.left,
          y2: toRect.top + toRect.height / 2 - gridRect.top,
          protocol: conn.protocol,
          from: conn.from,
          to: conn.to,
        }
      }).filter(Boolean)
    },
    debounce(fn, delay) {
      let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
      }
    },
  },
}
</script>

<style scoped>
.network-diagram {
  margin-top: 1rem;
}
.network-diagram__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  padding: 1rem;
  min-height: 300px;
}
.network-diagram__zone {
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  z-index: 1;
  background: var(--bg-primary, #fff);
}
.network-diagram__zone--microsoft {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.03);
}
.network-diagram__zone--media-host {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.03);
}
.network-diagram__zone--backend {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.03);
}
.network-diagram__zone--client {
  border-color: #e67e22;
  background: rgba(230, 126, 34, 0.03);
}
.network-diagram__zone-title {
  font-weight: 600;
  font-size: 0.85em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.network-diagram__services {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.network-diagram__service {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  background: var(--bg-primary, #fff);
  cursor: default;
  transition: box-shadow 0.2s, border-color 0.2s;
  position: relative;
  z-index: 2;
}
.network-diagram__service:hover,
.network-diagram__service.highlighted {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary, #2196f3);
}
.network-diagram__service-name {
  font-weight: 600;
  font-size: 0.85em;
}
.network-diagram__service-tech {
  font-size: 0.75em;
  color: var(--text-secondary, #666);
}
.network-diagram__svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}
.network-diagram__line {
  transition: opacity 0.2s, stroke-width 0.2s;
}
.network-diagram__legend {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  font-size: 0.85em;
}
.network-diagram__legend-title {
  font-weight: 600;
}
.network-diagram__legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.network-diagram__legend-color {
  display: inline-block;
  width: 20px;
  height: 3px;
  border-radius: 2px;
}
</style>
