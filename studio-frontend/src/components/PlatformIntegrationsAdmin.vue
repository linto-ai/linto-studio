<template>
  <div class="platform-integrations-admin">
    <div class="platform-admin__header">
      <h3>{{ $t("integrations.platform_admin.title") }}</h3>
      <p>{{ $t("integrations.platform_admin.subtitle") }}</p>
    </div>

    <div class="platform-admin__actions">
      <Button
        v-if="!hasTeamsConfig"
        variant="primary"
        :label="$t('integrations.platform_admin.create_teams')"
        @click="showWizard = true" />
    </div>

    <div v-if="loading" class="platform-admin__loading">
      <span class="spinner"></span>
    </div>

    <div v-else class="platform-admin__configs">
      <div
        v-for="config in configs"
        :key="config.id"
        class="platform-admin__config-card">
        <div class="config-card__header">
          <h4>{{ config.provider }}</h4>
          <StatusLed :on="config.status === 'active'" />
          <span>{{ config.status }}</span>
        </div>

        <div class="config-card__body">
          <div class="config-card__field">
            <span class="config-card__label">{{ $t("integrations.platform_admin.lock_label") }}</span>
            <label class="config-card__toggle">
              <input
                type="checkbox"
                :checked="!config.allowOrganizationOverride"
                @change="toggleLock(config)" />
              <span>{{ config.allowOrganizationOverride
                ? $t("integrations.platform_admin.unlock_label")
                : $t("integrations.platform_admin.lock_active") }}</span>
            </label>
          </div>

          <div class="config-card__field" v-if="usageStats[config.provider]">
            <span class="config-card__label">{{ $t("integrations.platform_admin.usage_label") }}</span>
            <span>{{ $t("integrations.platform_admin.usage_orgs_own", { count: usageStats[config.provider].organizationsWithOwnConfig }) }}</span>
          </div>

          <div class="config-card__media-hosts">
            <h5>{{ $t("integrations.platform_admin.media_hosts_title") }}</h5>
            <div v-for="mh in config.mediaHosts || []" :key="mh.id" class="media-host-item">
              <StatusLed :on="mh.status === 'online'" />
              <span>{{ mh.dns || mh.id }}</span>
              <span class="text-muted">{{ mh.status }}</span>
              <Button
                v-if="mh.status !== 'decommissioned'"
                variant="text"
                size="sm"
                :label="$t('integrations.platform_admin.decommission')"
                @click="decommissionMediaHost(config, mh)" />
            </div>
            <Button
              variant="secondary"
              size="sm"
              :label="$t('integrations.platform_admin.add_media_host')"
              @click="addMediaHost(config)" />
          </div>
        </div>

        <div class="config-card__actions">
          <Button
            variant="secondary"
            :label="$t('integrations.platform_admin.configure')"
            @click="openConfig(config)" />
          <Button
            variant="danger"
            :label="$t('integrations.platform_admin.delete')"
            @click="deleteConfig(config)" />
        </div>
      </div>
    </div>

    <TeamsSetupWizard
      v-if="showWizard"
      :organizationId="''"
      :scope="'platform'"
      @close="onWizardClose" />
  </div>
</template>

<script>
import {
  getPlatformIntegrationConfigs,
  updatePlatformIntegrationConfig,
  deletePlatformIntegrationConfig,
  getPlatformConfigUsage,
  createAdminMediaHost,
  decommissionAdminMediaHost,
} from "@/api/integrationConfig"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"
import TeamsSetupWizard from "@/components/TeamsSetupWizard.vue"

export default {
  name: "PlatformIntegrationsAdmin",
  components: { StatusLed, Button, TeamsSetupWizard },
  data() {
    return {
      configs: [],
      usageStats: {},
      loading: true,
      showWizard: false,
    }
  },
  computed: {
    hasTeamsConfig() {
      return this.configs.some(c => c.provider === 'teams' && c.status !== 'disabled')
    },
  },
  async mounted() {
    await this.loadConfigs()
  },
  methods: {
    async loadConfigs() {
      this.loading = true
      try {
        this.configs = await getPlatformIntegrationConfigs()
        for (const config of this.configs) {
          try {
            const usage = await getPlatformConfigUsage(config.provider)
            if (usage) {
              this.$set(this.usageStats, config.provider, usage)
            }
          } catch {
            // ignore usage fetch errors
          }
        }
      } catch {
        // error loading
      } finally {
        this.loading = false
      }
    },
    async toggleLock(config) {
      try {
        await updatePlatformIntegrationConfig(config.id, {
          allowOrganizationOverride: !config.allowOrganizationOverride,
        })
        config.allowOrganizationOverride = !config.allowOrganizationOverride
      } catch {
        // toggle error
      }
    },
    async deleteConfig(config) {
      if (!confirm(this.$t("integrations.platform_admin.delete_confirm"))) return
      try {
        await deletePlatformIntegrationConfig(config.id)
        this.configs = this.configs.filter(c => c.id !== config.id)
      } catch {
        // delete error
      }
    },
    async addMediaHost(config) {
      try {
        await createAdminMediaHost(config.id, {})
        await this.loadConfigs()
      } catch {
        // add error
      }
    },
    async decommissionMediaHost(config, mh) {
      try {
        await decommissionAdminMediaHost(mh.id)
        await this.loadConfigs()
      } catch {
        // decommission error
      }
    },
    openConfig(config) {
      this.showWizard = true
    },
    onWizardClose() {
      this.showWizard = false
      this.loadConfigs()
    },
  },
}
</script>

<style scoped>
.platform-integrations-admin {
  padding: 1.5rem;
}
.platform-admin__header {
  margin-bottom: 1.5rem;
}
.platform-admin__header h3 {
  margin: 0 0 0.5rem;
}
.platform-admin__actions {
  margin-bottom: 1.5rem;
}
.platform-admin__configs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.platform-admin__config-card {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.5rem;
}
.config-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.config-card__header h4 {
  margin: 0;
  text-transform: capitalize;
}
.config-card__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.config-card__field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.config-card__label {
  font-weight: 600;
  font-size: 0.9em;
  min-width: 120px;
}
.config-card__toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.config-card__media-hosts {
  margin-top: 0.5rem;
}
.config-card__media-hosts h5 {
  margin: 0 0 0.5rem;
}
.media-host-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color, #eee);
}
.config-card__actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color, #ccc);
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
