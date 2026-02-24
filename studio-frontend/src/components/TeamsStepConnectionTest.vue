<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.connection_test.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.connection_test.description") }}</p>

    <Button
      variant="primary"
      :label="running
        ? $t('integrations.teams_wizard.connection_test.running')
        : $t('integrations.teams_wizard.connection_test.run_test')"
      :loading="running"
      :disabled="false"
      @click="runDiagnostics" />

    <div class="wizard-step__checks">
      <div v-for="check in checks" :key="check.key" class="check-item">
        <StatusLed :on="check.status === 'ok'" />
        <span
          v-if="check.status === 'checking'"
          class="spinner-small"></span>
        <span class="check-item__label">{{
          $t(
            "integrations.teams_wizard.connection_test.check_" + check.key
          )
        }}</span>
        <span
          class="check-item__status"
          :class="'check-item__status--' + check.status">
          {{
            check.status === "ok"
              ? $t("integrations.teams_wizard.connection_test.status_ok")
              : check.status === "error"
                ? $t(
                    "integrations.teams_wizard.connection_test.status_error"
                  )
                : check.status === "checking"
                  ? $t(
                      "integrations.teams_wizard.connection_test.status_checking"
                    )
                  : ""
          }}
        </span>
        <span v-if="check.message" class="check-item__message">{{
          check.message
        }}</span>
      </div>
    </div>

    <div v-if="allPassed" class="wizard-step__success">
      <p>
        {{ $t("integrations.teams_wizard.connection_test.all_passed") }}
      </p>
    </div>
    <div v-else-if="hasErrors" class="wizard-step__error">
      <p>
        {{ $t("integrations.teams_wizard.connection_test.some_failed") }}
      </p>
    </div>
  </div>
</template>

<script>
import integrationApiMixin from "@/mixins/integrationApiMixin"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsStepConnectionTest",
  components: { StatusLed, Button },
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
      running: false,
      checks: [
        { key: "credentials", status: "pending", message: "" },
        { key: "media_host", status: "pending", message: "" },
        { key: "mqtt", status: "pending", message: "" },
        { key: "ssl", status: "pending", message: "" },
      ],
    }
  },
  computed: {
    allPassed() {
      return this.checks.every((c) => c.status === "ok")
    },
    hasErrors() {
      return this.checks.some((c) => c.status === "error")
    },
  },
  methods: {
    async runDiagnostics() {
      this.running = true
      this.checks.forEach((c) => {
        c.status = "pending"
        c.message = ""
      })

      // Check credentials
      this.checks[0].status = "checking"
      try {
        const res = await this.api.validateCredentials(this.config.id)
        this.checks[0].status =
          res?.status === 200 || res?.data?.valid ? "ok" : "error"
      } catch {
        this.checks[0].status = "error"
      }

      // Check media host + mqtt + ssl from health
      this.checks[1].status = "checking"
      this.checks[2].status = "checking"
      this.checks[3].status = "checking"
      try {
        const res = await this.api.getConfig(this.config.id)
        const health = res?.healthStatus || {}
        this.checks[1].status = health.mediaHost ? "ok" : "error"
        this.checks[2].status = health.mqtt ? "ok" : "error"
        this.checks[3].status = health.ssl ? "ok" : "error"
      } catch {
        this.checks[1].status = "error"
        this.checks[2].status = "error"
        this.checks[3].status = "error"
      }

      this.running = false

      if (this.allPassed) {
        try {
          await this.api.updateConfig(this.config.id, { status: "active" })
        } catch {
          // silently ignore
        }
        this.$emit("validated", { connectionTest: true })
      }
    },
  },
}
</script>

<style scoped>
.wizard-step__checks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.check-item__label {
  flex: 1;
}
.check-item__status--ok {
  color: var(--color-success, #27ae60);
  font-weight: 600;
}
.check-item__status--error {
  color: var(--color-error, #e74c3c);
  font-weight: 600;
}
.check-item__status--checking {
  color: var(--text-secondary, #666);
}
.check-item__message {
  font-size: 0.85em;
  color: var(--text-secondary, #666);
}
.wizard-step__success {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-success-bg, #e8f5e9);
  border-radius: 4px;
  color: var(--color-success, #27ae60);
}
.wizard-step__error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-error-bg, #fde8e8);
  border-radius: 4px;
  color: var(--color-error, #e74c3c);
}
.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
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
</style>
