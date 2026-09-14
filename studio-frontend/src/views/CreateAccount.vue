<template>
  <MainContentPublic>
    <form
      class="flex col login-page__form gap-small"
      @submit="handlePersonalForm"
      v-if="state == 'personal-information' || state == 'sending'">
      <h2 class="login-title">{{ $t("createaccount.personal_title") }}</h2>
      <FormInput
        :field="firstname"
        v-model="firstname.value"
        @change="testName(firstname)"
        inputFullWidth />
      <FormInput
        :field="lastname"
        v-model="lastname.value"
        @change="testName(lastname)"
        inputFullWidth />
      <FormInput
        :field="email"
        v-model="email.value"
        @change="testEmail(email)"
        inputFullWidth />
      <!-- Profil picture -->
      <div class="form-field flex col">
        <label class="form-label">{{ $t("createaccount.image_label") }}</label>
        <div class="input-file-container flex row">
          <input
            type="file"
            id="file"
            ref="file"
            class="input__file"
            v-on:change="handleFileUpload()"
            accept=".png, .jpg, .jpeg" />
          <label
            for="file"
            class="input__file-label-btn"
            :class="[
              picture.error !== null ? 'error' : '',
              picture.valid ? 'valid' : '',
              'btn',
            ]">
            <span class="icon upload"></span>
            <span class="label">{{
              picture.valid
                ? $t("createaccount.picture_selected")
                : $t("createaccount.picture_upload_label")
            }}</span>
          </label>
        </div>
        <span
          class="input__file-name"
          v-if="!!picture.value['name'] && picture.value['name'] !== ''"
          >{{ picture.value.name }}</span
        >
        <span class="error-field" v-if="picture.error !== null">
          {{ picture.error }}
        </span>
      </div>
      <FormInput
        :field="password"
        v-model="password.value"
        @change="testPassword(password)"
        inputFullWidth />
      <FormInput
        :field="passwordConfirm"
        v-model="passwordConfirm.value"
        @change="testPasswordConfirm(passwordConfirm, password)"
        inputFullWidth />

      <div class="form-field flex row">
        <Button
          type="submit"
          variant="primary"
          :label="$t('createaccount.personal_button')"
          :loading="state === 'sending'" />
      </div>
      <div class="form-field" v-if="formError !== null">
        <span class="form-error">{{ formError }}</span>
      </div>
    </form>

    <div
      class="flex col login-page__form gap-small"
      v-else-if="state == 'email-verification'">
      <h2>{{ $t("createaccount.email_verification_title") }}</h2>
      <div>
        {{ $t("createaccount.email_verification_text") }}
      </div>
    </div>
    <div class="medium-margin-top">
      <router-link to="/login" class="underline">
        {{ $t("createaccount.signin_button") }}
      </router-link>
    </div>
  </MainContentPublic>
</template>
<script>
import { getEnv } from "@/tools/getEnv"

import LocalSwitcher from "@/components/LocalSwitcher.vue"
import EMPTY_FIELD from "@/const/emptyField.js"
import { apiCreateUser } from "@/api/user.js"
import MainContentPublic from "@/components/MainContentPublic.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import { testEmail } from "@/tools/fields/testEmail.js"
import { testName } from "@/tools/fields/testName.js"
import { testPassword } from "@/tools/fields/testPassword.js"
import { testPasswordConfirm } from "@/tools/fields/testPasswordConfirm.js"
export default {
  data() {
    return {
      firstname: {
        ...EMPTY_FIELD,
        label: this.$t("createaccount.first_name_label"),
      },
      lastname: {
        ...EMPTY_FIELD,
        label: this.$t("createaccount.last_name_label"),
      },
      email: {
        ...EMPTY_FIELD,
        label: this.$t("createaccount.email_label"),
      },
      password: {
        ...EMPTY_FIELD,
        label: this.$t("createaccount.password_label"),
        type: "password",
        autocomplete: "new-password",
      },
      passwordConfirm: {
        ...EMPTY_FIELD,
        label: this.$t("createaccount.password_confirmation_label"),
        type: "password",
        autocomplete: "new-password",
      },
      picture: { ...EMPTY_FIELD },
      formError: null,
      state: "personal-information",
    }
  },
  mounted() {
    if (!this.enable_inscription) {
      this.$router.push("/login")
    }
  },
  computed: {
    formValid() {
      if (!this.pictureSelected) {
        return (
          this.email.valid &&
          this.firstname.valid &&
          this.lastname.valid &&
          this.password.valid &&
          this.passwordConfirm.valid
        )
      } else {
        return (
          this.email.valid &&
          this.firstname.valid &&
          this.lastname.valid &&
          this.password.valid &&
          this.passwordConfirm.valid &&
          this.picture.valid
        )
      }
    },
    pictureSelected() {
      return this.picture.value !== ""
    },
    // Default organization name a new account is created with. The
    // organization can be renamed later; there is no dedicated step for
    // it in the signup flow anymore.
    defaultOrganizationName() {
      return `${this.email.value}'s organization`
    },
    enable_inscription() {
      return getEnv("VUE_APP_DISABLE_USER_CREATION") !== "true"
    },
    title() {
      return getEnv("VUE_APP_NAME")
    },
  },

  methods: {
    // TODO: refactore with forms mixin
    async handlePersonalForm(event) {
      event.preventDefault()
      try {
        this.formError = null
        this.testName(this.firstname)
        this.testName(this.lastname)
        this.testEmail(this.email)
        this.testPassword(this.password)
        this.testPasswordConfirm(this.passwordConfirm, this.password)
        if (this.pictureSelected) {
          this.handleFileUpload()
        }
        if (this.formValid) {
          await this.createAccount()
        }
      } catch (error) {
        if (getEnv("VUE_APP_DEBUG") === "true") {
          console.error(error)
        }
      }
      return false
    },
    async createAccount() {
      this.state = "sending"
      let formData = new FormData()
      if (this.pictureSelected) {
        formData.append("file", this.picture.value)
      }
      formData.append("firstname", this.firstname.value)
      formData.append("lastname", this.lastname.value)
      formData.append("email", this.email.value)
      formData.append("password", this.password.value)
      formData.append("organizationName", this.defaultOrganizationName)

      const res = await apiCreateUser(formData, {
        timeout: null,
        redirect: false,
      })
      if (res.message === "User address already use") {
        this.state = "personal-information"
        this.email.error = this.$t("user_creation.email_already_exists")
      } else if (res.status === "success") {
        if (res.data?.organizationCreationDisabled === true) {
          this.$router.push({
            name: "login",
            query: { notice: "account_created" },
          })
          return
        }

        Object.assign(this.firstname, EMPTY_FIELD)
        Object.assign(this.lastname, EMPTY_FIELD)
        Object.assign(this.email, EMPTY_FIELD)
        Object.assign(this.password, EMPTY_FIELD)
        Object.assign(this.passwordConfirm, EMPTY_FIELD)
        Object.assign(this.picture, EMPTY_FIELD)

        this.state = "email-verification"
      } else {
        this.state = "personal-information"
        this.formError = this.$t("user_creation.error_message")
      }
    },
    handleFileUpload() {
      this.picture.value = this.$refs.file.files[0]
      const acceptedTypes = ["image/png", "image/jpeg"]
      if (
        typeof this.picture.value !== "undefined" &&
        this.picture.value !== null &&
        !!this.picture.value.type
      ) {
        const type = this.picture.value.type
        if (acceptedTypes.indexOf(type) >= 0) {
          this.picture.valid = true
          this.picture.error = null
        } else {
          this.picture.valid = false
          this.picture.error = "Invalid file type (accept .png, .jpg, .jpeg)"
        }
      } else {
        this.picture.value = ""
        this.picture.valid = false
        this.picture.error = null
      }
    },
    testName(obj) {
      return testName(obj, (key) => this.$t(key))
    },
    testEmail(obj) {
      obj.value = obj.value.toLowerCase()
      return testEmail(obj, (key) => this.$t(key))
    },
    testPassword(obj) {
      return testPassword(obj, (key) => this.$t(key))
    },
    testPasswordConfirm(obj, password) {
      return testPasswordConfirm(obj, password, (key) => this.$t(key))
    },
  },
  components: {
    LocalSwitcher,
    MainContentPublic,
    FormInput,
  },
}
</script>

<style lang="css" scoped>
input[type="file"] {
  display: none;
}
</style>
