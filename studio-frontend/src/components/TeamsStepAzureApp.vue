<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.azure_app.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.azure_app.description") }}</p>

    <Button
      variant="text"
      href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
      target="_blank"
      rel="noopener">
      <span class="label">
        {{ $t("integrations.teams_wizard.azure_app.link_azure_portal") }}
        &nearr;
      </span>
    </Button>

    <div class="wizard-step__instructions">
      <p>{{ $t("integrations.teams_wizard.azure_app.instructions") }}</p>
      <p>
        <strong>{{
          $t("integrations.teams_wizard.azure_app.permissions")
        }}</strong>
      </p>
      <ul>
        <li>
          {{
            $t(
              "integrations.teams_wizard.azure_app.permission_calls_access"
            )
          }}
        </li>
        <li>
          {{
            $t("integrations.teams_wizard.azure_app.permission_calls_join")
          }}
        </li>
        <li>
          {{
            $t(
              "integrations.teams_wizard.azure_app.permission_calls_initiate"
            )
          }}
        </li>
      </ul>
    </div>

    <div class="wizard-step__form">
      <div class="form-field">
        <label>{{
          $t("integrations.teams_wizard.azure_app.tenant_id")
        }}</label>
        <input
          type="text"
          v-model="tenantId"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      </div>
      <div class="form-field">
        <label>{{
          $t("integrations.teams_wizard.azure_app.client_id")
        }}</label>
        <input
          type="text"
          v-model="clientId"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      </div>
      <div class="form-field">
        <label>{{
          $t("integrations.teams_wizard.azure_app.client_secret")
        }}</label>
        <input type="password" v-model="clientSecret" />
      </div>

      <div v-if="formError" class="form-error">{{ formError }}</div>

      <div
        v-if="validationResult !== null"
        :class="[
          'validation-result',
          validationResult
            ? 'validation-result--success'
            : 'validation-result--error',
        ]">
        {{
          validationResult
            ? $t("integrations.teams_wizard.azure_app.valid")
            : $t("integrations.teams_wizard.azure_app.invalid")
        }}
      </div>

      <Button
        variant="primary"
        :label="validating
          ? $t('integrations.teams_wizard.azure_app.validating')
          : $t('integrations.teams_wizard.azure_app.validate_button')"
        :loading="validating"
        :disabled="!tenantId || !clientId || !clientSecret"
        @click="validate" />
    </div>
  </div>
</template>

<script>
import {
  updateIntegrationConfig,
  validateCredentials,
} from "@/api/integrationConfig"
import Button from "@/components/atoms/Button.vue"

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default {
  name: "TeamsStepAzureApp",
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
      tenantId: "",
      clientId: "",
      clientSecret: "",
      validating: false,
      validationResult: null,
      formError: null,
    }
  },
  created() {
    if (this.config?.config) {
      const parsed =
        typeof this.config.config === "string"
          ? JSON.parse(this.config.config)
          : this.config.config
      this.tenantId = parsed.tenantId || ""
      this.clientId = parsed.clientId || ""
    }
  },
  methods: {
    async validate() {
      this.formError = null
      this.validationResult = null

      if (!UUID_REGEX.test(this.tenantId)) {
        this.formError = "Invalid Tenant ID format"
        return
      }
      if (!UUID_REGEX.test(this.clientId)) {
        this.formError = "Invalid Client ID format"
        return
      }

      this.validating = true
      try {
        await updateIntegrationConfig(this.organizationId, this.config.id, {
          config: {
            tenantId: this.tenantId,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
          },
        })

        const res = await validateCredentials(
          this.organizationId,
          this.config.id
        )
        this.validationResult = res?.status === 200 || res?.data?.valid === true
        if (this.validationResult) {
          this.$emit("validated", { azureApp: true })
        }
      } catch {
        this.validationResult = false
      } finally {
        this.validating = false
      }
    },
  },
}
</script>

<style scoped>
.wizard-step__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-field label {
  font-weight: 600;
  font-size: 0.9em;
}
.form-field input {
  padding: 0.5rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
}
.form-error {
  color: var(--color-error, #e74c3c);
  font-size: 0.9em;
}
.validation-result {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9em;
}
.validation-result--success {
  background: var(--color-success-bg, #e8f5e9);
  color: var(--color-success, #27ae60);
}
.validation-result--error {
  background: var(--color-error-bg, #fde8e8);
  color: var(--color-error, #e74c3c);
}
.wizard-step__instructions {
  margin: 1rem 0;
}
</style>
