<template>
  <section>
    <h2>{{ $t("user_settings.profil_visibility.title") }}</h2>
    <FormCheckbox
      :field="profilePrivate"
      @input="updateVisibility"
      switchDisplay />
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiUpdateUserInfo, apiSendVerificationLink } from "@/api/user.js"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import { mapActions } from "vuex"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      profilePrivate: {
        value: this.userInfo.private ?? false,
        valid: true,
        error: null,
        label: this.$t("user_settings.profil_visibility.label_private"),
      },
    }
  },
  mounted() {},
  methods: {
    ...mapActions("user", ["updateUser"]),
    async updateVisibility(value) {
      let req = null

      if (!this.isAdminPage) {
        req = await this.updateUser({ private: value })
      } else {
        req = await apiAdminUpdateUser(this.userInfo._id, { private: value })
      }
      if (req.status === "success") {
        bus.emit("app_notif", {
          status: "success",
          message: this.$t("user_settings.notif_success"),
        })
      } else {
        bus.emit("app_notif", {
          status: "error",
          message: this.$t("user_settings.notif_error"),
        })
      }
    },
  },
  components: {
    FormCheckbox,
  },
}
</script>
