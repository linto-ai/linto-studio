<template>
  <div>
    <form @submit="saveSso">
      <section>
        <h2>{{ $t("organisation.sso.title") }}</h2>

        <FormCheckbox :field="enabled" v-model="enabled.value" switchDisplay />

        <FormInput :field="issuerUrl" v-model="issuerUrl.value" />

        <FormInput :field="clientId" v-model="clientId.value" />

        <FormInput
          :field="clientSecret"
          v-model="clientSecret.value"
          type="password"
          autocomplete="new-password"
          :placeholder="clientSecretPlaceholder" />

        <FormInput :field="scope" v-model="scope.value" />

        <FormInput :field="emailDomains" v-model="emailDomains.value" />

        <FormInput :field="callbackUrl" readonly code />

        <fieldset class="small-margin">
          <legend>{{ $t("organisation.sso.advanced_title") }}</legend>
          <FormInput
            :field="authorizationUrl"
            v-model="authorizationUrl.value" />
          <FormInput :field="tokenUrl" v-model="tokenUrl.value" />
          <FormInput :field="userInfoUrl" v-model="userInfoUrl.value" />
        </fieldset>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          :loading="saving"
          :label="$t('organisation.sso.save_button')" />
      </section>
    </form>

    <section v-if="isConfigured">
      <h2>{{ $t("organisation.danger_zone") }}</h2>
      <Alert
        variant="error"
        icon="trash"
        size="xs"
        :title="$t('organisation.sso.delete_modal.title')"
        :message="$t('organisation.sso.delete_modal.content')"
        @confirm="removeSso">
        <Button
          variant="secondary"
          intent="destructive"
          icon="trash"
          size="sm"
          :label="$t('organisation.sso.delete_button')" />
      </Alert>
    </section>
  </div>
</template>

<script>
import { formsMixin } from "@/mixins/forms.js"

import EMPTY_FIELD from "@/const/emptyField"

import { testContent } from "@/tools/fields/testContent"
import { testHttpsUrl } from "@/tools/fields/testHttpsUrl"
import { testEmailDomains } from "@/tools/fields/testEmailDomains"
import { testOidcScope } from "@/tools/fields/testOidcScope"
import { buildSsoPayload } from "@/tools/buildSsoPayload"

import {
  apiGetOrganisationSso,
  apiUpdateOrganisationSso,
  apiDeleteOrganisationSso,
} from "@/api/organisation.js"

import FormInput from "@/components/molecules/FormInput.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import Alert from "@/components/atoms/Alert.vue"

const DEFAULT_SCOPE = "openid, email, profile"
const TEXT_FIELDS = [
  "issuerUrl",
  "clientId",
  "clientSecret",
  "scope",
  "emailDomains",
  "authorizationUrl",
  "tokenUrl",
  "userInfoUrl",
]

export default {
  mixins: [formsMixin],
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: TEXT_FIELDS,
      saving: false,
      isConfigured: false,
      enabled: {
        ...EMPTY_FIELD,
        value: true,
        label: this.$t("organisation.sso.enabled_label"),
      },
      issuerUrl: {
        ...EMPTY_FIELD,
        required: true,
        label: this.$t("organisation.sso.issuer_url_label"),
        testField: testHttpsUrl,
      },
      clientId: {
        ...EMPTY_FIELD,
        required: true,
        label: this.$t("organisation.sso.client_id_label"),
        testField: testContent,
      },
      clientSecret: {
        ...EMPTY_FIELD,
        required: true,
        label: this.$t("organisation.sso.client_secret_label"),
      },
      scope: {
        ...EMPTY_FIELD,
        value: DEFAULT_SCOPE,
        required: true,
        label: this.$t("organisation.sso.scope_label"),
        testField: testOidcScope,
      },
      // Optional here: the API falls back to the organization matching email
      emailDomains: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.sso.email_domains_label"),
        testField: testEmailDomains,
      },
      callbackUrl: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.sso.callback_url_label"),
      },
      authorizationUrl: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.sso.authorization_url_label"),
        testField: testHttpsUrl,
      },
      tokenUrl: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.sso.token_url_label"),
        testField: testHttpsUrl,
      },
      userInfoUrl: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.sso.user_info_url_label"),
        testField: testHttpsUrl,
      },
    }
  },
  computed: {
    organizationId() {
      return this.currentOrganization._id
    },
    clientSecretPlaceholder() {
      if (!this.isConfigured) return ""
      return this.$t("organisation.sso.client_secret_kept_placeholder")
    },
  },
  async mounted() {
    await this.fetchSso()
  },
  methods: {
    async fetchSso() {
      const req = await apiGetOrganisationSso(this.organizationId)
      if (req.status === "success") this.applyConfig(req.data)
    },
    applyConfig({ callbackUrl, sso }) {
      if (callbackUrl) this.callbackUrl.value = callbackUrl
      const config = sso ?? null
      this.isConfigured = config !== null
      this.clientSecret.required = !this.isConfigured
      this.clientSecret.value = ""
      if (!config) return
      this.enabled.value = config.enabled !== false
      this.issuerUrl.value = config.issuerUrl ?? ""
      this.clientId.value = config.clientId ?? ""
      this.scope.value = (config.scope ?? []).join(", ")
      this.emailDomains.value = (config.emailDomains ?? []).join(", ")
      this.authorizationUrl.value = config.authorizationUrl ?? ""
      this.tokenUrl.value = config.tokenUrl ?? ""
      this.userInfoUrl.value = config.userInfoUrl ?? ""
    },
    formValues() {
      const values = { enabled: this.enabled.value }
      for (const name of TEXT_FIELDS) values[name] = this[name].value
      return values
    },
    async saveSso(event) {
      event.preventDefault()
      if (!this.testFields()) return false

      this.saving = true
      const req = await apiUpdateOrganisationSso(
        this.organizationId,
        buildSsoPayload(this.formValues()),
        {
          timeout: 3000,
          redirect: false,
          message: this.$t("organisation.sso.save_success"),
        },
      )
      if (req.status === "success") this.applyConfig(req.data)
      this.saving = false
      return false
    },
    async removeSso() {
      const req = await apiDeleteOrganisationSso(this.organizationId, {
        timeout: 3000,
        redirect: false,
        message: this.$t("organisation.sso.delete_success"),
      })
      if (req.status === "success") this.applyConfig({ sso: null })
    },
  },
  components: { FormInput, FormCheckbox, Alert },
}
</script>
