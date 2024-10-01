<template>
  <div>
    <div class="login-form-container flex col">
      <main class="flex1 flex col">
        <img :src="logo" class="login-logo" />
        <h1 class="center-text">{{ title }}</h1>
        <div>
          <LocalSwitcher></LocalSwitcher>
        </div>

        <form id="app-login" class="flex col" @submit="handleForm">
          <h2 class="login-title">{{ $t("login.title") }}</h2>
          <div class="form-field flex col">
            <label for="email" class="form-label">{{
              $t("login.email_label")
            }}</label>
            <input
              id="email"
              type="text"
              v-model="email.value"
              autocomplete="username"
              :class="email.error !== null ? 'error' : ''"
              ref="email"
              @change="testEmail()" />
            <span class="error-field" v-if="email.error !== null">{{
              email.error
            }}</span>
          </div>
          <div class="form-field flex col">
            <label for="password" class="form-label">{{
              $t("login.password_label")
            }}</label>
            <input
              id="password"
              type="password"
              v-model="password.value"
              autocomplete="current-password"
              :class="password.error !== null ? 'error' : ''"
              @change="testPasswordEmpty()" />
            <span class="error-field" v-if="password.error !== null">{{
              password.error
            }}</span>
          </div>
          <div class="form-field flex row">
            <button class="btn green" type="submit">
              <span class="label">{{ $t("login.login_button") }}</span>
              <span class="icon apply"></span>
            </button>
          </div>
          <router-link to="/reset-password" class="toggle-login-link">{{
            $t("login.recover_password")
          }}</router-link>
          <div class="form-field" v-if="formError !== null">
            <span class="form-error">{{ formError }}</span>
          </div>
        </form>

        <router-link
          to="/create-account"
          id="create-account-link"
          class="toggle-login-link"
          v-if="enable_inscription"
          >{{ $t("login.create_account_button") }}</router-link
        >
      </main>
      <footer class="login-footer flex col">
        <div class="login-footer-text">
          Innovations Open source propulsées par LINAGORA sur les
          infrastructures EXAION
        </div>
        <div class="flex gap-medium login-logo-bottom">
          <img src="/img/linagora.png" class="flex1" />
          <img src="/img/exaion.svg" class="flex1" />
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import { getEnv } from "@/tools/getEnv"

import LocalSwitcher from "@/components/LocalSwitcher.vue"
import { apiLoginUser } from "../api/user"
export default {
  data() {
    return {
      email: {
        value: "",
        error: null,
        valid: false,
      },
      password: {
        value: "",
        error: null,
        valid: false,
      },
      formError: null,
    }
  },
  mounted() {
    this.$refs.email.focus()
  },
  computed: {
    formValid() {
      return this.email.valid && this.password.valid
    },
    enable_inscription() {
      return process.env.VUE_APP_DISABLE_USER_CREATION !== "true"
    },
    logo() {
      return `/img/${getEnv("VUE_APP_LOGO")}`
    },
    title() {
      return getEnv("VUE_APP_NAME")
    },
  },
  methods: {
    async handleForm(event) {
      event?.preventDefault()
      try {
        this.formError = null
        this.testEmail()
        this.testPasswordEmpty()

        if (this.formValid) {
          let login = await apiLoginUser(this.email.value, this.password.value)
          if (login.status === "success") {
            this.setCookie("userId", login.data.user_id, 7)
            this.setCookie("authToken", login.data.auth_token, 7)
            this.setCookie("refreshToken", login.data.refresh_token, 14)
            this.setCookie("cm_orga_scope", "")

            if (this.$route?.query?.next) {
              window.location.href = this.$route?.query?.next
            } else {
              window.location.href = "/"
            }
          } else {
            throw login
          }
        }
      } catch (error) {
        if (process.env.VUE_APP_DEBUG === "true") {
          console.error(error)
        }
        this.formError =
          error?.error?.response?.data?.error?.message ||
          "An error has occured, please try again later"
      }
      return false
    },
    testEmail() {
      return this.$options.filters.testEmail(this.email)
    },
    testPasswordEmpty() {
      return this.$options.filters.testFieldEmpty(this.password)
    },
    setCookie(name, value, exdays) {
      return this.$options.filters.setCookie(name, value, exdays)
    },
  },
  components: { LocalSwitcher },
}
</script>
