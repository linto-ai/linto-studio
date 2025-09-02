<template>
  <form @submit="update">
    <section>
      <h2>
        {{ $t("user_settings.change_password_label") }}
      </h2>
      <!-- <div class="flex row" v-if="notificationShouldUpdatePassword">
        <div class="user-settings-notification">
          <span class="content">
            {{ $t("user_settings.update_pswd_notif") }}
          </span>
          <button class="btn black" @click="dismissForgottenPswdNotif">
            <span class="icon close"></span>
            <span class="label">{{
              $t("user_settings.update_pswd_notif_dismiss_btn")
            }}</span>
          </button>
        </div>
      </div> -->

      <div class="form-field flex col">
        <label class="form-label" for="password">
          {{ $t("user_settings.new_password_label") }}
        </label>
        <input type="password" v-model="newPassword.value" id="password" />
        <span class="error-field" v-if="newPassword.error !== null">
          {{ newPassword.error }}
        </span>
      </div>
      <div class="form-field flex col">
        <label class="form-label" for="newPasswordConfirm">
          {{ $t("user_settings.new_password_confirmation_label") }}
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
        <Button
          type="submit"
          color="primary"
          size="sm"
          :label="$t('user_settings.update_password_button')" />
      </div>
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { mapActions } from "vuex"

import { apiAdminUpdateUser } from "@/api/admin.js"
import { testPassword } from "@/tools/fields/testPassword.js"

export default {
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
    ...mapActions("user", ["updateUser"]),
    async update(event) {
      event?.preventDefault()
      testPassword(this.newPassword, (key) => this.$t(key))
      this.$options.filters.testPasswordConfirm(
        this.newPasswordConfirm,
        this.newPassword,
        (key) => this.$t(key),
      )
      if (this.newPassword.valid && this.newPasswordConfirm.valid) {
        await this.updatePassword()
      }
      return false
    },

    async updatePassword() {
      let req = null

      if (!this.isAdminPage) {
        req = await this.updateUser({ password: this.newPassword.value })
      } else {
        req = await apiAdminUpdateUser(this.userInfo._id, {
          password: this.newPassword.value,
        })
      }
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
    },
  },
  computed: {
    notificationShouldUpdatePassword() {
      return this.userInfo?.accountNotifications?.updatePassword ?? false
    },
  },
  components: { Fragment },
}
</script>
