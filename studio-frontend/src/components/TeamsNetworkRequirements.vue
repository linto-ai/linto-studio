<template>
  <div class="network-requirements">
    <h4>{{ $t("integrations.teams_wizard.media_host.network_requirements.title") }}</h4>
    <p class="text-muted">
      {{ $t("integrations.teams_wizard.media_host.network_requirements.description") }}
    </p>

    <div class="network-requirements__filters">
      <Button
        v-for="zone in zones"
        :key="zone.key"
        :variant="activeZone === zone.key ? 'primary' : 'secondary'"
        :label="zone.label"
        size="sm"
        @click="activeZone = zone.key" />
    </div>

    <div class="network-requirements__table-wrapper">
      <table class="network-requirements__table">
        <thead>
          <tr>
            <th>{{ $t("integrations.teams_wizard.media_host.network_requirements.col_direction") }}</th>
            <th>{{ $t("integrations.teams_wizard.media_host.network_requirements.col_protocol") }}</th>
            <th>{{ $t("integrations.teams_wizard.media_host.network_requirements.col_port") }}</th>
            <th>{{ $t("integrations.teams_wizard.media_host.network_requirements.col_source") }}</th>
            <th>{{ $t("integrations.teams_wizard.media_host.network_requirements.col_usage") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rule, idx) in filteredRules" :key="idx">
            <td>
              <span :class="'direction--' + rule.direction">
                {{ $t("integrations.teams_wizard.media_host.network_requirements.direction_" + rule.direction) }}
              </span>
            </td>
            <td><code>{{ rule.protocol }}</code></td>
            <td><code>{{ rule.port }}</code></td>
            <td>{{ rule.source }}</td>
            <td>{{ rule.usage }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="network-requirements__copy">
      <Button
        variant="secondary"
        size="sm"
        :label="copied ? $t('integrations.teams_wizard.media_host.network_requirements.copied') : $t('integrations.teams_wizard.media_host.network_requirements.copy_all')"
        @click="copyAll" />
    </div>

    <div class="network-requirements__domains">
      <h5>{{ $t("integrations.teams_wizard.media_host.network_requirements.domains_title") }}</h5>
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.network_requirements.domains_desc") }}
      </p>
      <ul>
        <li v-for="domain in microsoftDomains" :key="domain">
          <code>{{ domain }}</code>
        </li>
      </ul>
    </div>

    <p class="text-muted network-requirements__hint">
      {{ $t("integrations.teams_wizard.media_host.network_requirements.firewall_hint") }}
    </p>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsNetworkRequirements",
  components: { Button },
  props: {
    config: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      activeZone: "all",
      copied: false,
      rules: [
        // Media Host — Inbound
        { zone: "media_host", direction: "inbound", protocol: "TCP", port: "443", source: "Microsoft Teams / Clients", usage: "HTTPS (Bot Framework, signaling)" },
        { zone: "media_host", direction: "inbound", protocol: "TCP", port: "8445", source: "Microsoft Teams", usage: "Teams Calling (media signaling)" },
        { zone: "media_host", direction: "inbound", protocol: "TCP", port: "9441-9442", source: "Microsoft Teams", usage: "Teams Media Platform (audio/video)" },
        { zone: "media_host", direction: "inbound", protocol: "UDP", port: "49152-65535", source: "Microsoft Teams", usage: "RTP/SRTP media streams" },
        // Media Host — Outbound
        { zone: "media_host", direction: "outbound", protocol: "TCP", port: "443", source: "Microsoft Graph API", usage: "Graph API calls (join meeting)" },
        { zone: "media_host", direction: "outbound", protocol: "TCP", port: "1883/8883", source: "MQTT Broker (Backend)", usage: "MQTT publish (audio, health)" },
        { zone: "media_host", direction: "outbound", protocol: "TCP", port: "8000", source: "Session-API (Backend)", usage: "Phone-home registration" },
        { zone: "media_host", direction: "outbound", protocol: "TCP/WS", port: "8890", source: "Transcriber (Backend)", usage: "WebSocket audio streaming" },
        // Backend — Inbound
        { zone: "backend", direction: "inbound", protocol: "TCP", port: "1883/8883", source: "Media Host", usage: "MQTT subscriptions" },
        { zone: "backend", direction: "inbound", protocol: "TCP", port: "8000", source: "Media Host / Frontend", usage: "Session-API REST endpoints" },
        { zone: "backend", direction: "inbound", protocol: "TCP", port: "8890", source: "Media Host", usage: "WebSocket audio (Transcriber)" },
        // Backend — Outbound
        { zone: "backend", direction: "outbound", protocol: "TCP", port: "443", source: "Microsoft Graph API", usage: "Calendar webhooks, call management" },
        { zone: "backend", direction: "outbound", protocol: "TCP", port: "443", source: "ASR Providers", usage: "Speech-to-text API calls" },
        // Microsoft Cloud
        { zone: "microsoft", direction: "outbound", protocol: "TCP", port: "443", source: "Media Host → Teams", usage: "Bot signaling and Graph API" },
        { zone: "microsoft", direction: "outbound", protocol: "UDP", port: "3478-3481", source: "Media Host → Teams TURN", usage: "TURN relay for media" },
        // Client Browser
        { zone: "client", direction: "outbound", protocol: "TCP", port: "443", source: "Studio Frontend → Backend", usage: "HTTPS API access" },
        { zone: "client", direction: "outbound", protocol: "TCP/WS", port: "443", source: "Studio Frontend → Backend", usage: "WebSocket live captions" },
      ],
      microsoftDomains: [
        "*.microsoft.com",
        "*.microsoftonline.com",
        "*.skype.com",
        "*.teams.microsoft.com",
        "login.microsoftonline.com",
        "graph.microsoft.com",
        "*.communication.azure.com",
        "turn.azure.com",
      ],
    }
  },
  computed: {
    zones() {
      return [
        { key: "all", label: this.$t("integrations.teams_wizard.media_host.network_requirements.filter_all") },
        { key: "media_host", label: this.$t("integrations.teams_wizard.media_host.network_requirements.zone_media_host") },
        { key: "backend", label: this.$t("integrations.teams_wizard.media_host.network_requirements.zone_backend") },
        { key: "microsoft", label: this.$t("integrations.teams_wizard.media_host.network_requirements.zone_microsoft") },
        { key: "client", label: this.$t("integrations.teams_wizard.media_host.network_requirements.zone_client") },
      ]
    },
    filteredRules() {
      if (this.activeZone === "all") return this.rules
      return this.rules.filter(r => r.zone === this.activeZone)
    },
  },
  methods: {
    copyAll() {
      const header = "Direction\tProtocol\tPort\tSource/Dest\tUsage"
      const lines = this.filteredRules.map(
        r => `${r.direction}\t${r.protocol}\t${r.port}\t${r.source}\t${r.usage}`
      )
      navigator.clipboard.writeText([header, ...lines].join("\n"))
      this.copied = true
      setTimeout(() => { this.copied = false }, 2000)
    },
  },
}
</script>

<style scoped>
.network-requirements__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}
.network-requirements__table-wrapper {
  overflow-x: auto;
  margin: 1rem 0;
}
.network-requirements__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}
.network-requirements__table th,
.network-requirements__table td {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e0e0e0);
  text-align: left;
  white-space: nowrap;
}
.network-requirements__table th {
  background: var(--bg-secondary, #f5f5f5);
  font-weight: 600;
}
.network-requirements__table tbody tr:hover {
  background: var(--bg-hover, #f9f9f9);
}
.network-requirements__table code {
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.9em;
}
.direction--inbound {
  color: var(--color-success, #27ae60);
}
.direction--outbound {
  color: var(--color-primary, #2196f3);
}
.network-requirements__copy {
  margin: 0.5rem 0;
}
.network-requirements__domains {
  margin-top: 1.5rem;
}
.network-requirements__domains ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.network-requirements__domains li code {
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.85em;
}
.network-requirements__hint {
  margin-top: 1rem;
  font-style: italic;
}
.text-muted {
  color: var(--text-secondary, #666);
  font-size: 0.9em;
}
</style>
