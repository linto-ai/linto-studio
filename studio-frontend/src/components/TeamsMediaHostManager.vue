<template>
  <div class="media-host-manager">
    <h5>{{ $t("integrations.teams_wizard.media_host.media_host_list") }}</h5>

    <div v-if="loading" class="media-host-manager__loading">
      <span class="spinner"></span>
    </div>

    <div v-else-if="mediaHosts.length === 0" class="media-host-manager__empty">
      <p class="text-muted">{{ $t("integrations.teams_wizard.media_host.no_media_hosts") }}</p>
    </div>

    <div v-else class="media-host-manager__list">
      <div
        v-for="mh in mediaHosts"
        :key="mh.id"
        class="media-host-manager__item">
        <StatusLed :on="mh.status === 'online'" />
        <span class="media-host-manager__dns">{{ mh.dns || mh.id }}</span>
        <span class="media-host-manager__status text-muted">{{ mh.status }}</span>
        <Button
          v-if="mh.status !== 'decommissioned'"
          variant="text"
          size="sm"
          :label="$t('integrations.teams_wizard.media_host.decommission_media_host')"
          @click="decommission(mh)" />
      </div>
    </div>

    <div class="media-host-manager__actions">
      <Button
        variant="secondary"
        size="sm"
        :label="$t('integrations.teams_wizard.media_host.add_media_host')"
        @click="showAddDialog = true" />
    </div>

    <!-- Add Media Host dialog -->
    <div v-if="showAddDialog" class="media-host-manager__dialog-overlay" @click.self="showAddDialog = false">
      <div class="media-host-manager__dialog">
        <h5>{{ $t("integrations.teams_wizard.media_host.add_media_host") }}</h5>
        <p class="text-muted">{{ $t("integrations.teams_wizard.media_host.mode_label") }}</p>

        <div class="media-host-manager__mode-cards">
          <div
            class="media-host-manager__mode-card"
            @click="addMediaHost('azure')">
            <div class="media-host-manager__mode-icon">&#9729;</div>
            <h6>{{ $t("integrations.teams_wizard.media_host.mode_azure_title") }}</h6>
            <p>{{ $t("integrations.teams_wizard.media_host.mode_azure_desc") }}</p>
          </div>
          <div
            class="media-host-manager__mode-card"
            @click="addMediaHost('manual')">
            <div class="media-host-manager__mode-icon">&#9881;</div>
            <h6>{{ $t("integrations.teams_wizard.media_host.mode_manual_title") }}</h6>
            <p>{{ $t("integrations.teams_wizard.media_host.mode_manual_desc") }}</p>
          </div>
        </div>

        <Button
          variant="text"
          :label="$t('common.cancel')"
          @click="showAddDialog = false" />
      </div>
    </div>
  </div>
</template>

<script>
import integrationApiMixin from "@/mixins/integrationApiMixin"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsMediaHostManager",
  components: { StatusLed, Button },
  mixins: [integrationApiMixin],
  props: {
    configId: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      default: "organization",
    },
  },
  data() {
    return {
      mediaHosts: [],
      loading: true,
      showAddDialog: false,
    }
  },
  async mounted() {
    await this.loadMediaHosts()
  },
  methods: {
    async loadMediaHosts() {
      this.loading = true
      try {
        this.mediaHosts = await this.api.getMediaHosts(this.configId)
      } catch {
        this.mediaHosts = []
      } finally {
        this.loading = false
      }
    },
    async decommission(mh) {
      if (!confirm(this.$t("integrations.teams_wizard.media_host.confirm_decommission"))) return
      try {
        await this.api.decommissionMediaHost(mh.id)
        await this.loadMediaHosts()
      } catch {
        // decommission error
      }
    },
    async addMediaHost(deploymentMode) {
      try {
        const mhRes = await this.api.createMediaHost(this.configId, { deploymentMode })
        const newHost = mhRes?.data || mhRes
        const mediaHostId = newHost?.id || newHost?._id

        if (deploymentMode === "azure" && mediaHostId) {
          await this.api.genProvisioningToken(mediaHostId)
          const res = await this.api.genDeployLink(mediaHostId)
          const deployUrl = res?.data?.url || res?.data
          if (deployUrl) {
            window.open(deployUrl, "_blank")
          }
        }

        this.showAddDialog = false
        await this.loadMediaHosts()
        this.$emit("media-host-added", newHost)
      } catch {
        // add error
      }
    },
  },
}
</script>

<style scoped>
.media-host-manager__list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.5rem 0;
}
.media-host-manager__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #eee);
  border-radius: 6px;
}
.media-host-manager__dns {
  flex: 1;
  font-weight: 500;
}
.media-host-manager__status {
  font-size: 0.85em;
}
.media-host-manager__actions {
  margin-top: 0.75rem;
}
.media-host-manager__empty {
  padding: 0.75rem 0;
}
.media-host-manager__dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.media-host-manager__dialog {
  background: var(--bg-primary, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
}
.media-host-manager__mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 1rem 0;
}
.media-host-manager__mode-card {
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.media-host-manager__mode-card:hover {
  border-color: var(--color-primary, #2196f3);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}
.media-host-manager__mode-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.media-host-manager__mode-card h6 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
}
.media-host-manager__mode-card p {
  margin: 0;
  font-size: 0.8em;
  color: var(--text-secondary, #666);
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
  to { transform: rotate(360deg); }
}
.text-muted {
  color: var(--text-secondary, #666);
  font-size: 0.9em;
}
</style>
