<template>
  <form @submit="update">
    <section>
      <h2>
        {{ $t("usersettings.change_password_label") }}
      </h2>
      <div class="flex row" v-if="userInfo.accountNotifications.updatePassword">
        <div class="user-settings-notification">
          <span class="content">
            {{ $t("usersettings.update_pswd_notif") }}
          </span>
          <button class="btn black" @click="dismissForgottenPswdNotif">
            <span class="icon close"></span>
            <span class="label">{{
              $t("usersettings.update_pswd_notif_dismiss_btn")
            }}</span>
          </button>
        </div>
      </div>

      <div class="form-field flex col">
        <label class="form-label" for="password">
          {{ $t("usersettings.new_password_label") }}
        </label>
        <input type="password" v-model="newPassword.value" id="password" />
        <span class="error-field" v-if="newPassword.error !== null">
          {{ newPassword.error }}
        </span>
      </div>
      <div class="form-field flex col">
        <label class="form-label" for="newPasswordConfirm">
          {{ $t("usersettings.new_password_confirmation_label") }}
        </label>
        <input
          type="password"
          v-model="newPasswordConfirm.value"
          id="newPasswordConfirm" />
        <span class="error-field" v-if="newPasswordConfirm.error !== null">
          {{ newPasswordConfirm.error }}
        </span>
      </div>
      <div class="flex row">
        <button type="submit">
          {{ $t("usersettings.update_password_button") }}
        </button>
      </div>
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { apiUpdateUserInfo } from "@/api/user.js"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newPassword: {
        value: "",
        error: null,
        valid: false,
      },
      newPasswordConfirm: {
        value: "",
        error: null,
        valid: false,
      },
    }
  },
  mounted() {},
  methods: {
    async update(event) {
      event?.preventDefault()
      this.$options.filters.testPassword(this.newPassword)
      this.$options.filters.testPasswordConfirm(
        this.newPasswordConfirm,
        this.newPassword
      )
      if (this.newPassword.valid && this.newPasswordConfirm.valid) {
        await this.updatePassword()
      }
      return false
    },

    async updatePassword() {
      let req = await apiUpdateUserInfo(
        { password: this.newPassword.value },
        {
          timeout: 3000,
          redirect: false,
        }
      )

      if (req.status === "success") {
        this.newPassword = {
          value: "",
          error: null,
          valid: false,
        }
        this.newPasswordConfirm = {
          value: "",
          error: null,
          valid: false,
        }
        bus.$emit("user_settings_update", {})
      }
    },
    async dismissForgottenPswdNotif(e) {
      await apiUpdateUserInfo({
        accountNotifications: {
          updatePassword: false,
        },
      })
      bus.$emit("user_settings_update", {})
      e.preventDefault()
    },
  },
  components: { Fragment },
}
</script>
