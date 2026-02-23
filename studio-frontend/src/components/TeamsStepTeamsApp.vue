<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.teams_app.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.teams_app.description") }}</p>

    <div class="wizard-step__actions">
      <Button
        variant="primary"
        :label="$t('integrations.teams_wizard.teams_app.download_button')"
        :loading="downloading"
        icon="download"
        @click="download" />
      <Button
        v-if="appInfo"
        variant="tertiary"
        :label="$t('integrations.teams_wizard.teams_app.info_button')"
        icon="info"
        @click="showInfo" />
    </div>

    <div class="wizard-step__instructions">
      <ol>
        <li>{{ $t("integrations.teams_wizard.teams_app.step1") }}</li>
        <li>{{ $t("integrations.teams_wizard.teams_app.step2") }}</li>
        <li>{{ $t("integrations.teams_wizard.teams_app.step3") }}</li>
      </ol>
    </div>

    <div class="wizard-step__checklist">
      <label>
        <input type="checkbox" v-model="confirmed" />
        {{ $t("integrations.teams_wizard.teams_app.check_uploaded") }}
      </label>
    </div>
  </div>
</template>

<script>
import { downloadTeamsApp, getTeamsAppInfo } from "@/api/teamsApp"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsStepTeamsApp",
  components: { Button },
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
      confirmed: false,
      downloading: false,
      appInfo: null,
    }
  },
  watch: {
    confirmed(val) {
      if (val) {
        this.$emit("validated", { teamsApp: true })
      }
    },
  },
  async mounted() {
    try {
      const res = await getTeamsAppInfo(this.organizationId)
      this.appInfo = res?.data || res
    } catch {
      // info not available
    }
  },
  methods: {
    async download() {
      this.downloading = true
      try {
        const res = await downloadTeamsApp(this.organizationId)
        const blob = res?.data instanceof Blob ? res.data : new Blob([res?.data])
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "linto-teams-app.zip"
        link.click()
        URL.revokeObjectURL(url)
      } catch {
        // download error
      } finally {
        this.downloading = false
      }
    },
    showInfo() {
      if (this.appInfo) {
        alert(JSON.stringify(this.appInfo, null, 2))
      }
    },
  },
}
</script>

<style scoped>
.wizard-step__actions {
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0;
}
.wizard-step__instructions {
  margin: 1rem 0;
}
.wizard-step__instructions ol {
  padding-left: 1.5rem;
}
.wizard-step__instructions li {
  margin-bottom: 0.5rem;
}
.wizard-step__checklist {
  margin-top: 1rem;
}
.wizard-step__checklist label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
