<template>
  <div class="integrations-catalog">
    <div class="integrations-catalog__header">
      <h3>{{ $t("integrations.catalog.title") }}</h3>
      <p>{{ $t("integrations.catalog.subtitle") }}</p>
    </div>

    <div class="integrations-catalog__grid">
      <div class="integration-card" @click="openTeamsWizard">
        <div class="integration-card__logo">
          <img src="/img/teams-logo.svg" alt="Microsoft Teams" />
        </div>
        <div class="integration-card__info">
          <h4>{{ $t("integrations.catalog.teams.name") }}</h4>
          <p>{{ $t("integrations.catalog.teams.description") }}</p>
        </div>
        <div class="integration-card__status" v-if="teamsInherited">
          <StatusLed :on="true" />
          <span>{{ $t("integrations.catalog.status.inherited") }}</span>
          <span class="integration-card__badge">{{ $t("integrations.catalog.inherited_badge") }}</span>
        </div>
        <div class="integration-card__status" v-else-if="teamsLocked">
          <StatusLed :on="true" />
          <span>{{ $t("integrations.catalog.status.locked") }}</span>
          <span class="integration-card__badge">{{ $t("integrations.catalog.locked_badge") }}</span>
        </div>
        <div class="integration-card__status" v-else-if="teamsConfig">
          <StatusLed :on="teamsConfig.status === 'active'" />
          <span>{{ teamsStatusLabel }}</span>
        </div>

        <!-- Media Host Manager for active configs -->
        <TeamsMediaHostManager
          v-if="teamsOrgConfig && teamsOrgConfig.status === 'active'"
          :configId="teamsOrgConfig.id"
          :organizationId="organizationId"
          :scope="'organization'"
          @click.native.stop />

        <div class="integration-card__buttons" @click.stop>
          <Button
            v-if="teamsLocked"
            variant="secondary"
            :label="$t('integrations.catalog.configure_button')"
            disabled />
          <Button
            v-else-if="teamsInherited"
            variant="secondary"
            :label="$t('integrations.catalog.customize_button')"
            @click="openTeamsWizard" />
          <Button
            v-else
            variant="secondary"
            :label="$t('integrations.catalog.configure_button')"
            @click="openTeamsWizard" />
        </div>
      </div>

      <div class="integration-card integration-card--disabled">
        <div class="integration-card__info">
          <h4>{{ $t("integrations.catalog.livekit.name") }}</h4>
          <p>{{ $t("integrations.catalog.livekit.description") }}</p>
        </div>
        <span class="integration-card__badge">{{
          $t("integrations.catalog.coming_soon")
        }}</span>
      </div>

      <div class="integration-card integration-card--disabled">
        <div class="integration-card__info">
          <h4>{{ $t("integrations.catalog.zoom.name") }}</h4>
          <p>{{ $t("integrations.catalog.zoom.description") }}</p>
        </div>
        <span class="integration-card__badge">{{
          $t("integrations.catalog.coming_soon")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getIntegrationConfigs, getPlatformStatus } from "@/api/integrationConfig"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"
import TeamsMediaHostManager from "@/components/TeamsMediaHostManager.vue"

export default {
  name: "IntegrationsCatalog",
  components: { StatusLed, Button, TeamsMediaHostManager },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      integrationConfigs: [],
      platformStatus: null,
      loading: true,
      error: null,
    }
  },
  computed: {
    teamsOrgConfig() {
      const configs = Array.isArray(this.integrationConfigs)
        ? this.integrationConfigs
        : []
      return configs.find(
        (c) => c.provider === "teams" && c.status !== "disabled" && c.scope === "organization"
      )
    },
    teamsInherited() {
      return !this.teamsOrgConfig && this.platformStatus?.exists === true
    },
    teamsLocked() {
      return this.platformStatus?.exists === true && this.platformStatus?.allowOrganizationOverride === false
    },
    teamsConfig() {
      if (this.teamsOrgConfig) return this.teamsOrgConfig
      if (this.platformStatus?.exists) {
        return {
          status: "active",
          provider: "teams",
          id: this.platformStatus.configId || null,
        }
      }
      return null
    },
    teamsStatusLabel() {
      return this.$t(
        "integrations.catalog.status." + (this.teamsConfig?.status || "draft")
      )
    },
  },
  async mounted() {
    try {
      const [result, platformResult] = await Promise.all([
        getIntegrationConfigs(this.organizationId),
        getPlatformStatus(this.organizationId, "teams"),
      ])
      this.integrationConfigs = Array.isArray(result) ? result : []
      this.platformStatus = platformResult
    } catch (e) {
      this.error = e.message || "Error loading integration configs"
    } finally {
      this.loading = false
    }
  },
  methods: {
    openTeamsWizard() {
      this.$emit("open-teams-wizard", this.teamsConfig?.id || null)
    },
  },
}
</script>

<style scoped>
.integrations-catalog__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
.integration-card {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.integration-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.integration-card--disabled {
  opacity: 0.6;
  cursor: default;
  pointer-events: none;
}
.integration-card__logo img {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
}
.integration-card__info h4 {
  margin: 0 0 0.5rem 0;
}
.integration-card__info p {
  margin: 0;
  color: var(--text-secondary, #666);
  font-size: 0.9em;
}
.integration-card__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.integration-card__badge {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 12px;
  font-size: 0.8em;
  color: var(--text-secondary, #666);
}
</style>
