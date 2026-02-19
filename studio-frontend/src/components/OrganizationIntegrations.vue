<template>
  <div>
    <h3>{{ $t("integrations.title") }}</h3>

    <section class="integration-section">
      <h4>{{ $t("integrations.teams_app.title") }}</h4>
      <p class="integration-description">
        {{ $t("integrations.teams_app.description") }}
      </p>

      <div class="integration-actions flex gap-small align-center">
        <Button
          variant="primary"
          icon="download-simple"
          size="sm"
          :loading="downloading"
          :label="$t('integrations.teams_app.download_button')"
          @click="handleDownloadTeamsApp" />
        <Button
          variant="secondary"
          icon="info"
          size="sm"
          :label="$t('integrations.teams_app.info_button')"
          :loading="teamsAppInfoLoading"
          @click="fetchTeamsAppInfo" />
      </div>

      <div v-if="teamsAppInfo" class="teams-app-info">
        <table>
          <tr>
            <td><strong>App ID</strong></td>
            <td>{{ teamsAppInfo.appId || "—" }}</td>
          </tr>
          <tr>
            <td><strong>Domain</strong></td>
            <td>{{ teamsAppInfo.domain || "—" }}</td>
          </tr>
        </table>
      </div>

      <div class="integration-instructions">
        <p>
          <strong>{{ $t("integrations.teams_app.install_title") }}</strong>
        </p>
        <ol>
          <li>{{ $t("integrations.teams_app.install_step_1") }}</li>
          <li>{{ $t("integrations.teams_app.install_step_2") }}</li>
          <li>{{ $t("integrations.teams_app.install_step_3") }}</li>
        </ol>
      </div>
    </section>

    <hr />

    <section class="integration-section">
      <h4>{{ $t("integrations.calendar.title") }}</h4>
      <p class="integration-description">
        {{ $t("integrations.calendar.description") }}
      </p>

      <CalendarSubscriptionsList :organizationId="organizationId" />
    </section>
  </div>
</template>

<script>
import { getTeamsAppInfo, downloadTeamsApp } from "@/api/teamsApp.js"
import CalendarSubscriptionsList from "@/components/CalendarSubscriptionsList.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "OrganizationIntegrations",
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  components: {
    CalendarSubscriptionsList,
    Button,
  },
  data() {
    return {
      teamsAppInfo: null,
      teamsAppInfoLoading: false,
      downloading: false,
    }
  },
  methods: {
    async handleDownloadTeamsApp() {
      this.downloading = true
      const res = await downloadTeamsApp(this.organizationId)
      if (res.status === "success") {
        const url = URL.createObjectURL(res.data)
        const link = document.createElement("a")
        link.href = url
        link.download = "linto-teams-app.zip"
        link.click()
        URL.revokeObjectURL(url)
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("integrations.teams_app.download_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.downloading = false
    },
    async fetchTeamsAppInfo() {
      this.teamsAppInfoLoading = true
      const res = await getTeamsAppInfo(this.organizationId)
      if (res.status === "success") {
        this.teamsAppInfo = res.data
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("integrations.teams_app.info_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.teamsAppInfoLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.integration-section {
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1em;
  }
}

.integration-description {
  color: var(--text-secondary);
  font-size: 0.9em;
  margin-bottom: 1rem;
}

.integration-actions {
  margin-bottom: 1rem;
}

.teams-app-info {
  background: var(--background-secondary, #f5f5f5);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9em;

  table {
    width: 100%;

    td {
      padding: 0.25rem 0.5rem;
    }

    td:first-child {
      width: 120px;
      color: var(--text-secondary);
    }
  }
}

.integration-instructions {
  font-size: 0.9em;
  color: var(--text-secondary);

  ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0 0;

    li {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
