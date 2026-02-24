<template>
  <div class="teams-health-panel" v-if="healthData">
    <div class="teams-health-panel__header">
      <h4>{{ $t("integrations.teams_wizard.health.title") }}</h4>
      <StatusLed :on="globalStatus === 'healthy'" />
      <span :class="'health-status--' + globalStatus">
        {{ $t("integrations.teams_wizard.health.status_" + globalStatus) }}
      </span>
      <Button
        variant="secondary"
        size="sm"
        :label="showDiagram
          ? $t('integrations.teams_wizard.media_host.network_diagram.hide_diagram')
          : $t('integrations.teams_wizard.media_host.network_diagram.show_diagram')"
        @click="showDiagram = !showDiagram" />
    </div>

    <div class="teams-health-panel__metrics">
      <div class="metric">
        <span class="metric__label">{{
          $t("integrations.teams_wizard.health.cpu")
        }}</span>
        <span class="metric__value">{{ healthData.cpu || "\u2014" }}%</span>
      </div>
      <div class="metric">
        <span class="metric__label">{{
          $t("integrations.teams_wizard.health.ram")
        }}</span>
        <span class="metric__value">{{ healthData.ram || "\u2014" }}%</span>
      </div>
      <div class="metric">
        <span class="metric__label">{{
          $t("integrations.teams_wizard.health.active_bots")
        }}</span>
        <span class="metric__value">{{ healthData.activeBots || 0 }}</span>
      </div>
      <div class="metric">
        <span class="metric__label">{{
          $t("integrations.teams_wizard.health.cert_expiry")
        }}</span>
        <span
          class="metric__value"
          :class="{ 'metric__value--warning': certExpiringWarning }">
          {{
            healthData.certExpiry ? formatDate(healthData.certExpiry) : "\u2014"
          }}
        </span>
        <span v-if="certExpiringWarning" class="metric__warning">
          {{ $t("integrations.teams_wizard.health.cert_warning") }}
        </span>
      </div>
    </div>

    <div v-if="mediaHosts.length > 1" class="teams-health-panel__hosts">
      <h5>{{ $t("integrations.teams_wizard.health.media_hosts") }}</h5>
      <div
        v-for="mh in mediaHosts"
        :key="mh.id || mh._id"
        class="teams-health-panel__host-card">
        <StatusLed :on="mh.healthStatus?.status === 'healthy' || mh.status === 'online'" />
        <span class="host-card__name">{{ mh.dns || mh.name || (mh.id || mh._id) }}</span>
        <span class="host-card__status text-muted">{{ mh.healthStatus?.status || mh.status || 'unknown' }}</span>
      </div>
    </div>

    <div class="teams-health-panel__footer">
      <span class="text-muted"
        >{{ $t("integrations.teams_wizard.health.last_check") }}
        {{ formatDate(config.lastHealthCheck) }}</span
      >
    </div>

    <div v-if="showDiagram" class="teams-health-panel__diagram">
      <TeamsNetworkDiagram :config="config" :visible="showDiagram" />
    </div>
  </div>
  <div class="teams-health-panel teams-health-panel--empty" v-else>
    <p class="text-muted">
      {{ $t("integrations.teams_wizard.health.no_data") }}
    </p>
  </div>
</template>

<script>
import integrationApiMixin from "@/mixins/integrationApiMixin"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"
import TeamsNetworkDiagram from "@/components/TeamsNetworkDiagram.vue"

export default {
  name: "TeamsHealthPanel",
  components: { StatusLed, Button, TeamsNetworkDiagram },
  mixins: [integrationApiMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      healthData: null,
      mediaHosts: [],
      pollInterval: null,
      showDiagram: false,
    }
  },
  computed: {
    globalStatus() {
      if (!this.healthData) return "offline"
      if (this.healthData.cpu > 90 || this.healthData.ram > 90)
        return "degraded"
      return "healthy"
    },
    certExpiringWarning() {
      if (!this.healthData?.certExpiry) return false
      return (
        Date.parse(this.healthData.certExpiry) - Date.now() <
        7 * 24 * 60 * 60 * 1000
      )
    },
  },
  mounted() {
    this.startPolling()
  },
  beforeDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
  },
  methods: {
    startPolling() {
      this.fetchHealth()
      this.pollInterval = setInterval(() => this.fetchHealth(), 30000)
    },
    async fetchHealth() {
      try {
        const hosts = await this.api.getMediaHosts(this.config.id)
        this.mediaHosts = hosts || []
        // Use the first media host's health status for the primary display
        const primaryHost = this.mediaHosts.find(
          (h) => h.healthStatus
        )
        if (primaryHost?.healthStatus) {
          this.healthData = primaryHost.healthStatus
        }
      } catch {
        // silently ignore polling errors
      }
    },
    formatDate(date) {
      if (!date) return "\u2014"
      return new Date(date).toLocaleString()
    },
  },
}
</script>

<style scoped>
.teams-health-panel__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.teams-health-panel__header h4 {
  margin: 0;
}
.teams-health-panel__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.metric__label {
  font-size: 0.85em;
  color: var(--text-secondary, #666);
}
.metric__value {
  font-size: 1.1em;
  font-weight: 600;
}
.metric__value--warning {
  color: var(--color-warning, #e67e22);
}
.metric__warning {
  font-size: 0.8em;
  color: var(--color-warning, #e67e22);
}
.health-status--healthy {
  color: var(--color-success, #27ae60);
}
.health-status--degraded {
  color: var(--color-warning, #e67e22);
}
.health-status--offline {
  color: var(--color-error, #e74c3c);
}
.teams-health-panel__hosts {
  margin-top: 1rem;
}
.teams-health-panel__hosts h5 {
  margin: 0 0 0.5rem;
}
.teams-health-panel__host-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.host-card__name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9em;
}
.host-card__status {
  font-size: 0.85em;
}
.teams-health-panel__footer {
  margin-top: 1rem;
}
.teams-health-panel--empty {
  padding: 1rem;
}
.teams-health-panel__diagram {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
</style>
