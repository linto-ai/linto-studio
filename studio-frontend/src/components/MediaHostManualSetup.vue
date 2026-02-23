<template>
  <div class="manual-setup">
    <!-- Sub-step 0: Prerequisites -->
    <div v-if="subStep === 0" class="manual-setup__step">
      <h5>{{ $t("integrations.teams_wizard.media_host.manual.prereq_title") }}</h5>
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.manual.prereq_desc") }}
      </p>
      <div class="manual-setup__checklist">
        <label v-for="(item, idx) in prereqs" :key="idx" class="manual-setup__check-item">
          <input type="checkbox" v-model="item.checked" />
          <span>{{ item.label }}</span>
        </label>
      </div>
      <div class="manual-setup__actions">
        <Button
          variant="primary"
          :label="$t('integrations.teams_wizard.media_host.manual.prereq_continue')"
          :disabled="!allPrereqsChecked"
          @click="subStep = 1" />
      </div>
    </div>

    <!-- Sub-step 1: Network Configuration -->
    <div v-if="subStep === 1" class="manual-setup__step">
      <h5>{{ $t("integrations.teams_wizard.media_host.manual.network_title") }}</h5>
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.manual.network_desc") }}
      </p>

      <div class="manual-setup__form">
        <div class="form-field">
          <label>{{ $t("integrations.teams_wizard.media_host.manual.fqdn_label") }}</label>
          <input
            type="text"
            v-model="fqdn"
            :placeholder="$t('integrations.teams_wizard.media_host.manual.fqdn_placeholder')" />
          <span class="form-hint">{{ $t("integrations.teams_wizard.media_host.manual.fqdn_hint") }}</span>
        </div>

        <div class="form-field">
          <label>{{ $t("integrations.teams_wizard.media_host.manual.public_ip_label") }}</label>
          <input
            type="text"
            v-model="publicIp"
            :placeholder="$t('integrations.teams_wizard.media_host.manual.public_ip_placeholder')" />
        </div>

        <div class="form-field">
          <label>{{ $t("integrations.teams_wizard.media_host.manual.ssl_mode_label") }}</label>
          <div class="manual-setup__radio-group">
            <label class="manual-setup__radio">
              <input type="radio" v-model="sslMode" value="letsencrypt" />
              {{ $t("integrations.teams_wizard.media_host.manual.ssl_letsencrypt") }}
            </label>
            <label class="manual-setup__radio">
              <input type="radio" v-model="sslMode" value="pfx" />
              {{ $t("integrations.teams_wizard.media_host.manual.ssl_pfx") }}
            </label>
          </div>
        </div>

        <div v-if="sslMode === 'pfx'" class="form-field">
          <label>{{ $t("integrations.teams_wizard.media_host.manual.pfx_path_label") }}</label>
          <input
            type="text"
            v-model="pfxPath"
            :placeholder="$t('integrations.teams_wizard.media_host.manual.pfx_path_placeholder')" />
        </div>

        <div v-if="connectivityResult" class="manual-setup__connectivity">
          <p :class="connectivityResult.dns ? 'status--ok' : 'status--error'">
            {{ connectivityResult.dns
              ? $t("integrations.teams_wizard.media_host.manual.dns_ok")
              : $t("integrations.teams_wizard.media_host.manual.dns_fail") }}
            <span v-if="connectivityResult.resolvedIp" class="text-muted">
              ({{ connectivityResult.resolvedIp }})
            </span>
          </p>
          <p :class="connectivityResult.mqtt ? 'status--ok' : 'status--error'">
            {{ connectivityResult.mqtt
              ? $t("integrations.teams_wizard.media_host.manual.mqtt_ok")
              : $t("integrations.teams_wizard.media_host.manual.mqtt_fail") }}
          </p>
        </div>
      </div>

      <div class="manual-setup__actions">
        <Button
          variant="secondary"
          :label="$t('integrations.teams_wizard.previous')"
          @click="subStep = 0" />
        <Button
          variant="secondary"
          :label="$t('integrations.teams_wizard.media_host.manual.check_dns')"
          :disabled="!fqdn || checkingDns"
          :loading="checkingDns"
          @click="checkDns" />
        <Button
          variant="primary"
          :label="$t('integrations.teams_wizard.media_host.manual.save_config')"
          :disabled="!fqdn"
          :loading="saving"
          @click="saveConfig" />
      </div>
    </div>

    <!-- Sub-step 2: Installation -->
    <div v-if="subStep === 2" class="manual-setup__step">
      <h5>{{ $t("integrations.teams_wizard.media_host.manual.install_title") }}</h5>
      <p class="text-muted">
        {{ $t("integrations.teams_wizard.media_host.manual.install_desc") }}
      </p>

      <div class="manual-setup__install">
        <p>{{ $t("integrations.teams_wizard.media_host.manual.install_step1") }}</p>
        <Button
          variant="primary"
          :label="$t('integrations.teams_wizard.media_host.manual.install_download_script')"
          @click="downloadScript" />

        <p>{{ $t("integrations.teams_wizard.media_host.manual.install_copy_command") }}</p>
        <div class="manual-setup__code">
          <code>{{ setupCommand }}</code>
          <CopyButton :value="setupCommand" />
        </div>
      </div>

      <div v-if="polling" class="wizard-step__polling">
        <span class="spinner"></span>
        <p>{{ $t("integrations.teams_wizard.media_host.manual.install_waiting") }}</p>
      </div>

      <div class="manual-setup__actions">
        <Button
          variant="secondary"
          :label="$t('integrations.teams_wizard.previous')"
          @click="subStep = 1" />
      </div>
    </div>

    <!-- Sub-step 3: Verification -->
    <div v-if="subStep === 3" class="manual-setup__step">
      <h5>{{ $t("integrations.teams_wizard.media_host.manual.verify_title") }}</h5>
      <div class="manual-setup__verify">
        <StatusLed :on="true" />
        <span>{{ $t("integrations.teams_wizard.media_host.manual.verify_desc") }}</span>
      </div>
      <div class="manual-setup__info">
        <p>
          {{ $t("integrations.teams_wizard.media_host.manual.verify_dns") }}
          <code>{{ config.mediaHostDns || fqdn }}</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  updateIntegrationConfig,
  generateProvisioningToken,
  getIntegrationConfig,
  checkConnectivity,
  getSetupScriptUrl,
} from "@/api/integrationConfig"
import Button from "@/components/atoms/Button.vue"
import StatusLed from "@/components/atoms/StatusLed.vue"
import CopyButton from "@/components/atoms/CopyButton.vue"

export default {
  name: "MediaHostManualSetup",
  components: { Button, StatusLed, CopyButton },
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
      subStep: 0,
      prereqs: [
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_os"), checked: false },
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_ram"), checked: false },
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_cpu"), checked: false },
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_disk"), checked: false },
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_network"), checked: false },
        { label: this.$t("integrations.teams_wizard.media_host.manual.prereq_ports"), checked: false },
      ],
      fqdn: "",
      publicIp: "",
      sslMode: "letsencrypt",
      pfxPath: "",
      checkingDns: false,
      connectivityResult: null,
      saving: false,
      provisioningToken: null,
      polling: false,
      pollInterval: null,
    }
  },
  computed: {
    allPrereqsChecked() {
      return this.prereqs.every(p => p.checked)
    },
    setupCommand() {
      if (!this.provisioningToken) return ""
      const url = getSetupScriptUrl(this.organizationId, this.config.id, this.provisioningToken)
      return `Invoke-WebRequest -Uri "${url}" -OutFile setup-manual.ps1; .\\setup-manual.ps1`
    },
  },
  mounted() {
    if (this.config?.manualConfig) {
      this.fqdn = this.config.manualConfig.fqdn || ""
      this.publicIp = this.config.manualConfig.publicIp || ""
      this.sslMode = this.config.manualConfig.sslMode || "letsencrypt"
      this.pfxPath = this.config.manualConfig.pfxPath || ""
      if (this.fqdn) {
        this.subStep = 2
        this.startInstallStep()
      }
    }
  },
  beforeDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
  },
  methods: {
    async checkDns() {
      this.checkingDns = true
      this.connectivityResult = null
      try {
        const res = await checkConnectivity(
          this.organizationId,
          this.config.id,
          { fqdn: this.fqdn }
        )
        this.connectivityResult = res?.data?.results || res?.results || null
      } catch {
        this.connectivityResult = { dns: false, resolvedIp: null, mqtt: false }
      } finally {
        this.checkingDns = false
      }
    },
    async saveConfig() {
      this.saving = true
      try {
        await updateIntegrationConfig(this.organizationId, this.config.id, {
          manualConfig: {
            fqdn: this.fqdn,
            publicIp: this.publicIp,
            sslMode: this.sslMode,
            pfxPath: this.pfxPath,
          },
        })
        this.subStep = 2
        await this.startInstallStep()
      } catch {
        // save error
      } finally {
        this.saving = false
      }
    },
    async startInstallStep() {
      if (!this.provisioningToken) {
        try {
          const res = await generateProvisioningToken(
            this.organizationId,
            this.config.id
          )
          this.provisioningToken = res?.data?.provisioningToken || null
        } catch {
          // token error
        }
      }
      this.startPolling()
    },
    downloadScript() {
      if (!this.provisioningToken) return
      const url = getSetupScriptUrl(
        this.organizationId,
        this.config.id,
        this.provisioningToken
      )
      window.open(url, "_blank")
    },
    startPolling() {
      this.polling = true
      this.pollInterval = setInterval(() => this.checkDeployment(), 10000)
    },
    async checkDeployment() {
      try {
        const res = await getIntegrationConfig(
          this.organizationId,
          this.config.id
        )
        if (res?.setupProgress?.mediaHost === true) {
          clearInterval(this.pollInterval)
          this.polling = false
          this.subStep = 3
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
.manual-setup__step {
  margin-top: 1rem;
}
.manual-setup__checklist {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}
.manual-setup__check-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.manual-setup__check-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.manual-setup__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
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
.form-field input[type="text"] {
  padding: 0.5rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
}
.form-hint {
  font-size: 0.8em;
  color: var(--text-secondary, #666);
}
.manual-setup__radio-group {
  display: flex;
  gap: 1.5rem;
}
.manual-setup__radio {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}
.manual-setup__connectivity {
  margin-top: 0.5rem;
}
.status--ok {
  color: var(--color-success, #27ae60);
}
.status--error {
  color: var(--color-error, #e74c3c);
}
.manual-setup__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.manual-setup__install {
  margin: 1rem 0;
}
.manual-setup__code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow-x: auto;
}
.manual-setup__code code {
  font-size: 0.85em;
  word-break: break-all;
  flex: 1;
}
.manual-setup__verify {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.manual-setup__info {
  margin-top: 0.5rem;
}
.manual-setup__info code {
  background: var(--bg-secondary, #f5f5f5);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}
.wizard-step__polling {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
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
</style>
