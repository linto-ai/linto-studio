<template>
  <MainContentPublic>
    <form class="flex col login-page__form gap-small" @submit="handleForm">
      <h2 class="login-title">{{ $t("login.title") }}</h2>

      <FormInput :field="email" v-model="email.value" focus />
      <FormInput :field="password" v-model="password.value" />

      <div class="form-field flex row">
        <button class="btn green fullwidth" type="submit">
          <span class="label">{{ $t("login.login_button") }}</span>
          <span class="icon apply"></span>
        </button>
      </div>
      <div class="form-field" v-if="formError !== null">
        <span class="form-error">{{ formError }}</span>
      </div>
      <router-link to="/reset-password" class="toggle-login-link underline">{{
        $t("login.recover_password")
      }}</router-link>
      <router-link
        to="/create-account"
        id="create-account-link"
        class="underline"
        v-if="enable_inscription">
        {{ $t("login.create_account_button") }}
      </router-link>
      <div class="login-separator"></div>
      <button class="btn primary">
        <span class="label">EU Login</span>
      </button>
    </form>

    <!-- 
    > -->
  </MainContentPublic>

  <!--
      <footer class="login-footer flex col" v-if="show_footer">
        <div class="login-footer-text">
          {{ $t("login.footer.description") }}
        </div>
        <div class="flex gap-medium login-logo-bottom">
          <img src="/img/linagora.png" class="flex1" />
          <img src="/img/exaion.svg" class="flex1" />
        </div>
      </footer>
    </div> -->
</template>
<script>
import { getEnv } from "@/tools/getEnv"

import LocalSwitcher from "@/components/LocalSwitcher.vue"
import { apiLoginUser } from "@/api/user"
import MainContentPublic from "@/components/MainContentPublic.vue"
import { testEmail } from "@/tools/fields/testEmail"
import FormInput from "@/components/FormInput.vue"

export default {
  data() {
    return {
      email: {
        value: "",
        error: null,
        valid: false,
        label: this.$t("login.email_label"),
        testField: testEmail,
      },
      password: {
        value: "",
        error: null,
        valid: false,
        label: this.$t("login.password_label"),
        type: "password",
      },
      formError: null,
    }
  },
  mounted() {
    //this.$refs.email.focus()
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
    show_footer() {
      return getEnv("VUE_APP_SHOW_LOGIN_FOOTER") === "true"
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
  components: { LocalSwitcher, MainContentPublic, FormInput },
}
</script>
