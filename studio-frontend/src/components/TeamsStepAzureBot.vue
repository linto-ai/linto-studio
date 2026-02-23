<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.azure_bot.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.azure_bot.description") }}</p>

    <div class="wizard-step__info-box">
      <label>{{
        $t("integrations.teams_wizard.azure_bot.client_id_label")
      }}</label>
      <div class="copy-field">
        <code>{{ clientId }}</code>
        <Button
          variant="tertiary"
          size="sm"
          :icon="copied ? 'check' : 'copy'"
          @click="copyClientId" />
      </div>
    </div>

    <div class="wizard-step__instructions">
      <ol>
        <li>{{ $t("integrations.teams_wizard.azure_bot.step1") }}</li>
        <li>{{ $t("integrations.teams_wizard.azure_bot.step2") }}</li>
        <li>
          {{ $t("integrations.teams_wizard.azure_bot.step3") }}
          <code>{{ messagingEndpoint }}</code>
        </li>
        <li>{{ $t("integrations.teams_wizard.azure_bot.step4") }}</li>
        <li>
          {{ $t("integrations.teams_wizard.azure_bot.step5") }}
          <code>{{ callingWebhook }}</code>
        </li>
      </ol>
    </div>

    <div class="wizard-step__checklist">
      <label>
        <input type="checkbox" v-model="checks.botCreated" />
        {{ $t("integrations.teams_wizard.azure_bot.check_bot_created") }}
      </label>
      <label>
        <input type="checkbox" v-model="checks.teamsChannel" />
        {{ $t("integrations.teams_wizard.azure_bot.check_teams_channel") }}
      </label>
      <label>
        <input type="checkbox" v-model="checks.callingEnabled" />
        {{
          $t("integrations.teams_wizard.azure_bot.check_calling_enabled")
        }}
      </label>
    </div>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsStepAzureBot",
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
      checks: {
        botCreated: false,
        teamsChannel: false,
        callingEnabled: false,
      },
      copied: false,
    }
  },
  computed: {
    clientId() {
      if (!this.config?.config) return "\u2014"
      const parsed =
        typeof this.config.config === "string"
          ? JSON.parse(this.config.config)
          : this.config.config
      return parsed.clientId || "\u2014"
    },
    messagingEndpoint() {
      const dns = this.config?.mediaHostDns || "<media-host-dns>"
      return `https://${dns}/api/messages`
    },
    callingWebhook() {
      const dns = this.config?.mediaHostDns || "<media-host-dns>"
      return `https://${dns}/api/calling`
    },
    allChecked() {
      return (
        this.checks.botCreated &&
        this.checks.teamsChannel &&
        this.checks.callingEnabled
      )
    },
  },
  watch: {
    allChecked(val) {
      if (val) {
        this.$emit("validated", { azureBot: true })
      }
    },
  },
  methods: {
    copyClientId() {
      navigator.clipboard.writeText(this.clientId)
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 2000)
    },
  },
}
</script>

<style scoped>
.wizard-step__info-box {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 4px;
}
.copy-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.copy-field code {
  flex: 1;
  padding: 0.5rem;
  background: var(--background-primary, #fff);
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
  font-size: 0.9em;
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
.wizard-step__instructions code {
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}
.wizard-step__checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
.wizard-step__checklist label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
