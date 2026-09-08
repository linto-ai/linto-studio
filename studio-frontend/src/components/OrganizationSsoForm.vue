<template>
  <form class="flex col gap-small" @submit="submit">
    <FormInput :field="email" v-model="email.value" focus inputFullWidth />
    <Button
      type="submit"
      variant="primary"
      block
      :loading="resolving"
      :label="$t('login.organization_sso.submit')" />
  </form>
</template>

<script>
import { formsMixin } from "@/mixins/forms.js"
import { testEmail } from "@/tools/fields/testEmail"
import {
  apiResolveOrganizationSso,
  organizationSsoLoginUrl,
} from "@/api/user.js"

import FormInput from "@/components/molecules/FormInput.vue"

// Asks for the email, then sends the browser to the SSO of the organization
// attached to its domain.
export default {
  mixins: [formsMixin],
  data() {
    return {
      fields: ["email"],
      resolving: false,
      email: {
        value: "",
        error: null,
        valid: false,
        label: this.$t("login.organization_sso.email_label"),
        testField: testEmail,
      },
    }
  },
  methods: {
    async submit(event) {
      event.preventDefault()
      if (!this.testFields()) return false

      this.resolving = true
      const req = await apiResolveOrganizationSso(this.email.value)
      if (req.status === "success") {
        window.location.href = organizationSsoLoginUrl(this.email.value)
        return false
      }
      this.resolving = false
      if (req.error?.response?.data?.code === "ORGANIZATION_SSO_NOT_FOUND") {
        this.email.error = this.$t("login.organization_sso.not_found")
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("login.error"),
          type: "error",
        })
      }
      return false
    },
  },
  components: { FormInput },
}
</script>
