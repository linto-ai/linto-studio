<template>
  <form @submit="update">
    <section>
      <h2>
        {{ $t("user_settings.personal_information") }}
      </h2>

      <FormInput :field="firstName" v-model="firstName.value" />

      <FormInput :field="lastName" v-model="lastName.value" />

      <FormInput :field="email" v-model="email.value" :disabled="fromSso">
        <template v-slot:content-after-label>
          <span
            class="icon email-verified"
            v-if="userInfo.emailIsVerified"></span>
        </template>
      </FormInput>

      <button type="submit" class="btn primary">
        <ph-icon name="check" size="md" class="icon" />
        <span class="label">{{
          $t("user_settings.update_personal_information_button")
        }}</span>
      </button>
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { mapActions } from "vuex"

import { formsMixin } from "@/mixins/forms.js"

import { apiSendVerificationLink } from "@/api/user.js"
import { apiAdminUpdateUser } from "@/api/admin.js"

import { testName } from "@/tools/fields/testName"
import { testEmail } from "@/tools/fields/testEmail"

import FormInput from "@/components/molecules/FormInput.vue"

export default {
  mixins: [formsMixin],
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    isAdminPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      firstName: {
        value: this.userInfo.firstname,
        error: null,
        valid: false,
        label: this.$t("user_settings.firstname_label"),
        testField: testName,
      },
      lastName: {
        value: this.userInfo.lastname,
        error: null,
        valid: false,
        label: this.$t("user_settings.lastname_label"),
        testField: testName,
      },
      email: {
        value: this.userInfo.email,
        error: null,
        valid: false,
        label: this.$t("user_settings.email_label"),
        testField: testEmail,
      },
      fields: ["firstName", "lastName", "email"],
      sendingEmail: false,
      emailSent: false,
    }
  },
  mounted() {},
  computed: {
    fromSso() {
      return this.userInfo.fromSso
    },
  },
  methods: {
    ...mapActions("user", ["updateUser"]),
    async update(event) {
      event?.preventDefault()

      if (this.testFields()) {
        const payload = {
          firstname: this.firstName.value,
          lastname: this.lastName.value,
        }

        if (!this.fromSso) {
          payload["email"] = this.email.value
        }

        let req = null

        if (!this.isAdminPage) {
          req = await this.updateUser(payload)

          if (req.status === "success") {
            if (this.email.value !== this.userInfo.email) {
              await this.sendVerificationEmail()
            }
          }
        } else {
          req = await apiAdminUpdateUser(this.userInfo._id, payload)
        }

        if (req.status === "success") {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$t("user_settings.notif_success"),
          })
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$t("user_settings.notif_error"),
          })
        }
      }

      return false
    },
  },
  components: { Fragment, FormInput },
}
</script>
