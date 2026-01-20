<template>
  <div class="config-amazon">
    <FormInput
      :field="nameField"
      v-model="localConfig.name" />

    <FormInput
      :field="descriptionField"
      v-model="localConfig.description" />

    <section class="options-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.options_title") }}</h4>
      <FormCheckbox
        switchDisplay
        v-model="localQuickMeeting"
        :field="{ label: $t('backoffice.transcriber_profile_detail.quick_meeting_label'), value: localQuickMeeting }" />
    </section>

    <section class="form-section">
      <h4>Certificats AWS</h4>

      <div class="form-field">
        <label class="form-label">{{ $t("backoffice.transcriber_profile_detail.amazon_certificate_label") }}</label>
        <div class="file-input-wrapper">
          <input type="file" accept=".crt" @change="onCertificateChange" class="file-input" />
          <span v-if="files.certificate" class="file-selected">{{ files.certificate.name }}</span>
        </div>
      </div>

      <div class="form-field">
        <label class="form-label">{{ $t("backoffice.transcriber_profile_detail.amazon_private_key_label") }}</label>
        <div class="file-input-wrapper">
          <input type="file" accept=".pem" @change="onPrivateKeyChange" class="file-input" />
          <span v-if="files.privateKey" class="file-selected">{{ files.privateKey.name }}</span>
        </div>
        <div v-if="rsaWarning" class="warning-message">
          {{ $t("backoffice.transcriber_profile_detail.amazon_rsa_warning") }}
        </div>
      </div>

      <div class="pkcs8-helper">
        <span class="helper-text">{{ $t("backoffice.transcriber_profile_detail.amazon_pkcs8_helper") }}</span>
        <code class="helper-command">{{ $t("backoffice.transcriber_profile_detail.amazon_pkcs8_command") }}</code>
      </div>

      <FormInput
        :field="passphraseField"
        v-model="localConfig.passphrase" />
    </section>

    <section class="form-section">
      <h4>IAM Roles Anywhere</h4>

      <FormInput
        :field="credentialsField"
        v-model="localConfig.credentials" />

      <FormInput
        :field="trustAnchorArnField"
        v-model="localConfig.trustAnchorArn" />

      <FormInput
        :field="profileArnField"
        v-model="localConfig.profileArn" />

      <FormInput
        :field="roleArnField"
        v-model="localConfig.roleArn" />
    </section>
  </div>
</template>

<script>
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  name: "TranscriberProfileConfigAmazon",
  components: { FormCheckbox, FormInput },
  props: {
    value: {
      type: Object,
      required: true,
    },
    quickMeeting: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      files: {
        certificate: null,
        privateKey: null,
      },
      rsaWarning: false,
      nameField: {
        label: this.$t("backoffice.transcriber_profile_detail.name_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.name_placeholder"),
        error: null,
      },
      descriptionField: {
        label: this.$t("backoffice.transcriber_profile_detail.description_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.description_placeholder"),
        error: null,
      },
      passphraseField: {
        label: this.$t("backoffice.transcriber_profile_detail.amazon_passphrase_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.amazon_passphrase_placeholder"),
        type: "password",
        error: null,
      },
      credentialsField: {
        label: this.$t("backoffice.transcriber_profile_detail.amazon_credentials_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.amazon_credentials_placeholder"),
        error: null,
      },
      trustAnchorArnField: {
        label: this.$t("backoffice.transcriber_profile_detail.amazon_trust_anchor_arn_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.amazon_trust_anchor_arn_placeholder"),
        error: null,
      },
      profileArnField: {
        label: this.$t("backoffice.transcriber_profile_detail.amazon_profile_arn_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.amazon_profile_arn_placeholder"),
        error: null,
      },
      roleArnField: {
        label: this.$t("backoffice.transcriber_profile_detail.amazon_role_arn_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.amazon_role_arn_placeholder"),
        error: null,
      },
    }
  },
  computed: {
    localConfig: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
    localQuickMeeting: {
      get() {
        return this.quickMeeting
      },
      set(val) {
        this.$emit("update:quickMeeting", val)
      },
    },
  },
  watch: {
    localConfig: {
      handler(val) {
        this.$emit("input", val)
      },
      deep: true,
    },
  },
  methods: {
    onCertificateChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.files.certificate = file
        this.$emit("files-changed", this.files)
      }
    },
    async onPrivateKeyChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.files.privateKey = file
        this.rsaWarning = await this.checkRSAFormat(file)
        this.$emit("files-changed", this.files)
      }
    },
    async checkRSAFormat(file) {
      try {
        const text = await file.text()
        return text.includes("-----BEGIN RSA PRIVATE KEY-----")
      } catch {
        return false
      }
    },
    resetFiles() {
      this.files = { certificate: null, privateKey: null }
      this.rsaWarning = false
    },
  },
}
</script>

<style scoped>
.config-amazon {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--tiny-gap);
}

.options-section,
.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  margin-top: var(--small-gap);
  padding-top: var(--small-gap);
  border-top: var(--border-block);
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
}

.file-input {
  font-size: var(--text-sm);
}

.file-selected {
  font-size: var(--text-xs);
  color: var(--primary-color);
  font-weight: 500;
}

.warning-message {
  color: var(--warning-color);
  font-size: var(--text-xs);
  padding: var(--small-gap);
  background: var(--warning-soft);
  border-radius: 4px;
  margin-top: var(--tiny-gap);
}

.pkcs8-helper {
  display: flex;
  flex-direction: column;
  gap: var(--tiny-gap);
  padding: var(--small-gap);
  background: var(--neutral-10);
  border-radius: 4px;
  font-size: var(--text-xs);
  border-left: 3px solid var(--primary-color);
}

.helper-text {
  color: var(--text-secondary);
}

.helper-command {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: var(--text-xs);
  padding: var(--tiny-gap) var(--small-gap);
  background: var(--background-primary);
  border-radius: 4px;
  overflow-x: auto;
  border: var(--border-input);
}
</style>
