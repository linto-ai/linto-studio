<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.media_host.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.media_host.description") }}</p>

    <!-- Already deployed: show existing hosts + add button -->
    <div v-if="deployed" class="wizard-step__deployed">
      <div class="wizard-step__success">
        <StatusLed :on="true" />
        <span>{{ $t("integrations.teams_wizard.media_host.deployed") }}</span>
      </div>
      <div v-if="mediaHosts.length > 0" class="wizard-step__host-list">
        <div
          v-for="mh in mediaHosts"
          :key="mh.id"
          class="wizard-step__host-item">
          <StatusLed :on="mh.status === 'online'" />
          <span class="wizard-step__host-dns">{{ mh.dns || mh.id }}</span>
          <span class="wizard-step__host-status text-muted">{{ mh.status }}</span>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        :label="$t('integrations.teams_wizard.media_host.add_another_media_host')"
        @click="startAddAnother" />
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
      mediaHosts: [],
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
        this.mediaHosts = hosts
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
    startAddAnother() {
      this.currentMediaHost = null
      this.deployed = false
      this.selectedMode = null
    },
    onMediaHostCreated(mediaHost) {
      this.currentMediaHost = mediaHost
    },
    onManualValidated(payload) {
      this.deployed = true
      this.$emit("validated", payload)
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
          clearInterval(this.pollInterval)
          this.polling = false
          // Reload the list to include the newly deployed host
          try {
            this.mediaHosts = await this.api.getMediaHosts(this.config.id)
          } catch {
            // ignore
          }
          this.deployed = true
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
.wizard-step__deployed {
  margin-top: 1rem;
}
.wizard-step__success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.wizard-step__host-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.75rem 0;
}
.wizard-step__host-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #eee);
  border-radius: 6px;
}
.wizard-step__host-dns {
  flex: 1;
  font-weight: 500;
}
.wizard-step__host-status {
  font-size: 0.85em;
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
.wizard-step__network-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
</style>
