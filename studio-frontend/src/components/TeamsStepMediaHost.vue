<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.media_host.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.media_host.description") }}</p>

    <!-- Already deployed -->
    <div v-if="deployed" class="wizard-step__success">
      <StatusLed :on="true" />
      <span>{{ $t("integrations.teams_wizard.media_host.deployed") }}</span>
      <div class="wizard-step__info">
        <p>
          {{ $t("integrations.teams_wizard.media_host.dns_label") }}
          <code>{{ currentMediaHost?.dns || config.mediaHostDns }}</code>
        </p>
      </div>
    </div>

    <!-- Mode selector -->
    <div v-else-if="!selectedMode" class="wizard-step__mode-selector">
      <p class="text-muted">{{ $t("integrations.teams_wizard.media_host.mode_label") }}</p>
      <div class="wizard-step__mode-cards">
        <div
          class="wizard-step__mode-card"
          :class="{ 'wizard-step__mode-card--hover': hoveredMode === 'azure' }"
          @mouseenter="hoveredMode = 'azure'"
          @mouseleave="hoveredMode = null"
          @click="selectMode('azure')">
          <div class="wizard-step__mode-card-icon">&#9729;</div>
          <h5>{{ $t("integrations.teams_wizard.media_host.mode_azure_title") }}</h5>
          <p>{{ $t("integrations.teams_wizard.media_host.mode_azure_desc") }}</p>
        </div>
        <div
          class="wizard-step__mode-card"
          :class="{ 'wizard-step__mode-card--hover': hoveredMode === 'manual' }"
          @mouseenter="hoveredMode = 'manual'"
          @mouseleave="hoveredMode = null"
          @click="selectMode('manual')">
          <div class="wizard-step__mode-card-icon">&#9881;</div>
          <h5>{{ $t("integrations.teams_wizard.media_host.mode_manual_title") }}</h5>
          <p>{{ $t("integrations.teams_wizard.media_host.mode_manual_desc") }}</p>
        </div>
        <div
          v-if="availablePlatformMediaHosts.length > 0 && !isPlatform"
          class="wizard-step__mode-card"
          :class="{ 'wizard-step__mode-card--hover': hoveredMode === 'shared' }"
          @mouseenter="hoveredMode = 'shared'"
          @mouseleave="hoveredMode = null"
          @click="selectMode('shared')">
          <div class="wizard-step__mode-card-icon">&#9741;</div>
          <h5>{{ $t("integrations.teams_wizard.media_host.mode_shared_title") }}</h5>
          <p>{{ $t("integrations.teams_wizard.media_host.mode_shared_desc") }}</p>
        </div>
      </div>
    </div>

    <!-- Azure mode (existing flow) -->
    <div v-else-if="selectedMode === 'azure'">
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.estimated_cost") }}
      </p>
      <Button
        variant="primary"
        :label="$t('integrations.teams_wizard.media_host.deploy_button')"
        :disabled="polling"
        @click="deploy" />
      <p v-if="!polling" class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.deploy_hint") }}
      </p>

      <div v-if="polling" class="wizard-step__polling">
        <span class="spinner"></span>
        <p>{{ $t("integrations.teams_wizard.media_host.polling") }}</p>
      </div>

      <Button
        variant="text"
        :label="$t('integrations.teams_wizard.media_host.change_mode')"
        @click="resetMode" />
    </div>

    <!-- Manual mode -->
    <div v-else-if="selectedMode === 'manual'">
      <MediaHostManualSetup
        :config="config"
        :organizationId="organizationId"
        :scope="scope"
        :mediaHostId="currentMediaHost?.id || currentMediaHost?._id || null"
        @media-host-created="onMediaHostCreated"
        @validated="onManualValidated" />

      <Button
        variant="text"
        :label="$t('integrations.teams_wizard.media_host.change_mode')"
        @click="resetMode" />
    </div>

    <!-- Shared mode -->
    <div v-else-if="selectedMode === 'shared'">
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.shared_description") }}
      </p>
      <div class="wizard-step__shared-list">
        <div
          v-for="mh in availablePlatformMediaHosts"
          :key="mh.id || mh._id"
          class="wizard-step__shared-item"
          :class="{ 'wizard-step__shared-item--selected': selectedSharedMediaHost === (mh.id || mh._id) }"
          @click="selectSharedMediaHost(mh)">
          <StatusLed :on="mh.healthStatus?.status === 'healthy' || mh.status === 'online'" />
          <span class="wizard-step__shared-name">{{ mh.dns || mh.name || (mh.id || mh._id) }}</span>
          <span class="wizard-step__shared-status text-muted">{{ mh.healthStatus?.status || mh.status || 'unknown' }}</span>
        </div>
      </div>

      <Button
        variant="text"
        :label="$t('integrations.teams_wizard.media_host.change_mode')"
        @click="resetMode" />
    </div>
    <div class="wizard-step__network-section">
      <TeamsNetworkRequirements :config="config" />
    </div>
  </div>
</template>

<script>
import integrationApiMixin from "@/mixins/integrationApiMixin"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"
import MediaHostManualSetup from "@/components/MediaHostManualSetup.vue"
import TeamsNetworkRequirements from "@/components/TeamsNetworkRequirements.vue"

export default {
  name: "TeamsStepMediaHost",
  components: { StatusLed, Button, MediaHostManualSetup, TeamsNetworkRequirements },
  mixins: [integrationApiMixin],
  props: {
    config: {
      type: Object,
      default: null,
    },
    organizationId: {
      type: String,
      required: true,
    },
    platformMediaHosts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deployUrl: null,
      polling: false,
      pollInterval: null,
      deployed: false,
      selectedMode: null,
      hoveredMode: null,
      currentMediaHost: null,
      availablePlatformMediaHosts: [],
      selectedSharedMediaHost: null,
    }
  },
  async mounted() {
    if (this.config?.setupProgress?.mediaHost) {
      this.deployed = true
    } else if (this.config?.deploymentMode) {
      this.selectedMode = this.config.deploymentMode
    }
    // Load existing media hosts for this config
    if (this.config?.id) {
      try {
        const hosts = await this.api.getMediaHosts(this.config.id)
        if (hosts.some((h) => h.status === "online")) {
          this.deployed = true
        }
        if (hosts.length > 0) {
          this.currentMediaHost = hosts[0]
        }
      } catch {
        // silently ignore
      }
    }
    // Fetch platform media hosts for shared mode (N/A for platform scope)
    try {
      const platformStatus = await this.api.getPlatformStatus("teams")
      if (platformStatus?.mediaHosts?.length) {
        this.availablePlatformMediaHosts = platformStatus.mediaHosts
      }
    } catch {
      // silently ignore
    }
  },
  beforeDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
  },
  methods: {
    async selectMode(mode) {
      this.selectedMode = mode
      try {
        await this.api.updateConfig(this.config.id, {
          deploymentMode: mode,
        })
      } catch {
        // silently ignore
      }
    },
    resetMode() {
      this.selectedMode = null
    },
    onMediaHostCreated(mediaHost) {
      this.currentMediaHost = mediaHost
    },
    onManualValidated(payload) {
      this.deployed = true
      this.$emit("validated", payload)
    },
    async selectSharedMediaHost(mh) {
      const id = mh.id || mh._id
      this.selectedSharedMediaHost = id
      try {
        await this.api.updateConfig(this.config.id, {
          sharedMediaHostId: id,
        })
        this.deployed = true
        this.$emit("validated", { mediaHost: true, shared: true })
      } catch {
        // silently ignore
      }
    },
    async deploy() {
      try {
        // Create a media host first if we don't have one
        if (!this.currentMediaHost) {
          const mhRes = await this.api.createMediaHost(
            this.config.id,
            { deploymentMode: this.selectedMode }
          )
          this.currentMediaHost = mhRes?.data || mhRes
        }
        const mediaHostId = this.currentMediaHost?.id || this.currentMediaHost?._id
        await this.api.genProvisioningToken(mediaHostId)
        const res = await this.api.genDeployLink(mediaHostId)
        this.deployUrl = res?.data?.url || res?.data
        if (this.deployUrl) {
          window.open(this.deployUrl, "_blank")
        }
        this.startPolling()
      } catch {
        // error deploying
      }
    },
    startPolling() {
      this.polling = true
      this.pollInterval = setInterval(() => this.checkDeployment(), 10000)
    },
    async checkDeployment() {
      try {
        const res = await this.api.getConfig(this.config.id)
        if (res?.setupProgress?.mediaHost === true) {
          this.deployed = true
          clearInterval(this.pollInterval)
          this.polling = false
          this.$emit("validated", { mediaHost: true })
        }
      } catch {
        // silently ignore polling errors
      }
    },
  },
}
</script>

<style scoped>
.wizard-step__mode-selector {
  margin-top: 1rem;
}
.wizard-step__mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.75rem;
}
.wizard-step__mode-card {
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  text-align: center;
}
.wizard-step__mode-card--hover,
.wizard-step__mode-card:hover {
  border-color: var(--color-primary, #2196f3);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}
.wizard-step__mode-card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.wizard-step__mode-card h5 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.wizard-step__mode-card p {
  margin: 0;
  font-size: 0.85em;
  color: var(--text-secondary, #666);
}
.wizard-step__polling {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}
.wizard-step__success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.wizard-step__info {
  margin-top: 0.5rem;
}
.wizard-step__info code {
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color, #ccc);
  border-top-color: var(--color-primary, #2196f3);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.text-muted {
  color: var(--text-secondary, #666);
  font-size: 0.9em;
}
.wizard-step__shared-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}
.wizard-step__shared-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.wizard-step__shared-item:hover {
  border-color: var(--color-primary, #2196f3);
}
.wizard-step__shared-item--selected {
  border-color: var(--color-primary, #2196f3);
  background: rgba(33, 150, 243, 0.05);
}
.wizard-step__shared-name {
  flex: 1;
  font-weight: 600;
}
.wizard-step__shared-status {
  font-size: 0.85em;
}
.wizard-step__network-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
</style>
