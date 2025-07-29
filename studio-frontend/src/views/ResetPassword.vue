<template>
  <MainContentPublic>
    <form id="app-login" class="flex col" @submit.prevent="handleForm">
      <h2 class="login-title">{{ $t("login.recover_password") }}</h2>
      <p style="font-style: italic; font-size: 13px; margin-top: 0">
        {{ $t("login.recover_password_detail") }}
      </p>
      <div class="form-field flex col">
        <label for="email" class="form-label">Email</label>
        <input
          type="text"
          name="email"
          @change="testEmail"
          class="fullwidth"
          :class="email.error !== null ? 'error' : ''"
          v-model="email.value" />
        <span class="error-field" v-if="email.error !== null">{{
          email.error
        }}</span>
      </div>
      <div class="form-field flex row">
        <button type="submit" :disabled="sending" class="btn primary">
          <span class="label">{{
            $t("login.recover_password_btn_label")
          }}</span>
        </button>
      </div>
      <div class="error-field global" v-if="globalError !== ''">
        {{ globalError }}
      </div>
    </form>
    <div class="flex col gap-tiny medium-margin-top">
      <router-link to="/login" class="toggle-login-link underline">
        {{ $t("createaccount.signin_button") }}
      </router-link>
      <div>
        <span>{{ $t("login.not_registered") }}</span>
        <router-link
          to="/create-account"
          class="underline"
          v-if="enable_inscription">
          {{ $t("login.create_account_button") }}
        </router-link>
      </div>
    </div>
  </MainContentPublic>
</template>
<script>
import { getEnv } from "@/tools/getEnv"

import LocalSwitcher from "@/components/LocalSwitcher.vue"
import EMPTY_FIELD from "@/const/emptyField.js"
import { apiRecoverPassword } from "../api/user"
import { testEmail } from "@/tools/fields/testEmail"
import MainContentPublic from "@/components/MainContentPublic.vue"

export default {
  data() {
    return {
      email: {
        ...EMPTY_FIELD,
      },
      globalError: "",
      sending: false,
    }
  },
  computed: {
    logo() {
      return `/img/${getEnv("VUE_APP_LOGO")}`
    },
    title() {
      return getEnv("VUE_APP_NAME")
    },
    enable_inscription() {
      return getEnv("VUE_APP_DISABLE_USER_CREATION") !== "true"
    },
  },
  methods: {
    testEmail() {
      return testEmail(this.email, (key) => this.$t(key))
    },
    async handleForm() {
      if (!this.sending) {
        try {
          this.testEmail()
          this.globalError = ""
          if (this.email.valid) {
            this.sending = true
            const req = await apiRecoverPassword(this.email.value, null)
            if (req.status === "error") {
              throw req
            } else {
              this.$store.dispatch("system/addNotification", {
                message: this.$t("login.recover_password_sent"),
                type: "success",
                timeout: 5000,
              })
              this.email = { ...EMPTY_FIELD }
              this.$options.filters.setCookie("forgot_pwd", true, 7)
            }
            this.sending = false
          }
        } catch (error) {
          this.sending = false
          if (error?.message) {
            this.globalError = error.message
          }
        }
      }
    },
  },
  components: {
    LocalSwitcher,
    MainContentPublic,
  },
}
</script>
