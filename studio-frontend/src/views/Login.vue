<template>
  <MainContentPublic>
    <form
      class="flex col login-page__form gap-small"
      @submit="handleForm"
      v-if="hasLocalLogin">
      <h2 class="login-title">{{ $t("login.title") }}</h2>

      <FormInput :field="email" v-model="email.value" focus inputFullWidth />
      <FormInput :field="password" v-model="password.value" inputFullWidth>
        <template #content-bottom-input>
          <router-link
            to="/reset-password"
            class="toggle-login-link underline"
            >{{ $t("login.recover_password") }}</router-link
          >
        </template>
      </FormInput>

      <div class="form-field flex col gap-tiny">
        <Button
          type="submit"
          :label="$t('login.login_button')"
          block
          class="login-page__form__submit"></Button>
        <div class="login-page__form__create-account">
          <span>{{ $t("login.not_registered") }}</span>
          <router-link
            to="/create-account"
            id="create-account-link"
            class="underline"
            v-if="enable_inscription">
            {{ $t("login.create_account_button") }}
          </router-link>
        </div>
      </div>
    </form>

    <div class="oidc-form flex col gap-medium">
      <div class="flex align-center gap-small">
        <hr class="oidc-form__separator flex1" />
        <div>{{ $t("login.or_continue_with") }}</div>
        <hr class="oidc-form__separator flex1" />
      </div>
      <div class="flex justify-center oidc-form__buttons">
        <OidcLoginButton
          v-for="oidcInfo of oidcList"
          :key="oidcInfo.name"
          :path="oidcInfo.path"
          :name="oidcInfo.name"></OidcLoginButton>
      </div>
    </div>
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
import { apiLoginUser, getLoginMethods } from "@/api/user"
import MainContentPublic from "@/components/MainContentPublic.vue"
import { testEmail } from "@/tools/fields/testEmail"
import { testFieldEmpty } from "@/tools/fields/testEmpty"
import FormInput from "@/components/molecules/FormInput.vue"
import OidcLoginButton from "@/components/OidcLoginButton.vue"

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
      loginMethodsIndexedByPath: {},
      BASE_AUTH: getEnv("VUE_APP_CONVO_AUTH"),
    }
  },
  mounted() {
    this.fetchLoginMethods()
    //this.$refs.email.focus()
  },
  computed: {
    formValid() {
      return this.email.valid && this.password.valid
    },
    enable_inscription() {
      return getEnv("VUE_APP_DISABLE_USER_CREATION") !== "true"
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
    hasLocalLogin() {
      return (
        this.loginMethodsIndexedByPath?.local &&
        this.loginMethodsIndexedByPath?.local?.length > 0
      )
    },
    oidcList() {
      return this.loginMethodsIndexedByPath?.oidc
    },
  },
  methods: {
    async handleForm(event) {
      event?.preventDefault()
      try {
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
        if (process.env.VUE_APP_DEBUG === "*") {
          console.error(error)
        }
        this.$store.dispatch("system/addNotification", {
          message: this.$t("login.error"),
          type: "error",
        })
      }
      return false
    },
    testEmail() {
      return testEmail(this.email, (key) => this.$t(key))
    },
    testPasswordEmpty() {
      return testFieldEmpty(this.password, (key) => this.$t(key))
    },
    setCookie(name, value, exdays) {
      return this.$options.filters.setCookie(name, value, exdays)
    },
    async fetchLoginMethods() {
      const loginList = await getLoginMethods()
      const indexedByPath = { local: [], oidc: [] }
      for (const login of loginList) {
        if (login.path.startsWith("oidc")) {
          indexedByPath["oidc"].push(login)
        } else {
          indexedByPath[login.path].push(login)
        }
      }
      this.loginMethodsIndexedByPath = indexedByPath
    },
  },
  components: { LocalSwitcher, MainContentPublic, FormInput, OidcLoginButton },
}
</script>

<style lang="scss">
.login-page__form__submit .label {
  display: inline-block;
  text-align: center;
  width: 100%;
}

.login-page__form__create-account {
  text-align: center;
}

.oidc-form {
  color: var(--text-secondary);
  margin-top: 1rem;
}

.oidc-form__separator {
  border: 0;
  border-top: var(--border-block);
  height: 0;
  padding: 0;
  margin: 0;
}

.oidc-form__buttons {
  gap: 1.5rem;
}
</style>
