<template>
  <form @submit="updateNotifications" class="user-settings-notifications">
    <section>
      <h2>{{ $t("user_settings.notifications.title") }}</h2>
      <fieldset class="small-margin">
        <legend>
          {{ $t("user_settings.notifications.conversations.title") }}
        </legend>
        <FormCheckbox
          :field="fieldConvShareAdd"
          v-model="fieldConvShareAdd.value"></FormCheckbox>
        <FormCheckbox
          :field="fieldConvShareDel"
          v-model="fieldConvShareDel.value"></FormCheckbox>
        <FormCheckbox
          :field="fieldConvShareUpdate"
          v-model="fieldConvShareUpdate.value"></FormCheckbox>
      </fieldset>

      <fieldset class="small-margin">
        <legend>
          {{ $t("user_settings.notifications.organizations.title") }}
        </legend>
        <FormCheckbox
          :field="fieldOrgaAdd"
          v-model="fieldOrgaAdd.value"></FormCheckbox>
        <FormCheckbox
          :field="fieldOrgaDel"
          v-model="fieldOrgaDel.value"></FormCheckbox>
        <FormCheckbox
          :field="fieldOrgaUpdate"
          v-model="fieldOrgaUpdate.value"></FormCheckbox>
      </fieldset>

      <Button
        type="submit"
        color="primary"
        size="sm"
        :label="$t('user_settings.notifications.submit_button')" />
      <!-- <button type="submit" class="btn small-margin primary">
        <ph-icon name="check" size="md" class="icon" />
        <span class="label">{{
          $t("user_settings.notifications.submit_button")
        }}</span>
      </button> -->
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { mapActions } from "vuex"
import { bus } from "@/main.js"
import { apiUpdateUserInfo } from "@/api/user"

import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fieldConvShareAdd: {
        value:
          this.userInfo?.emailNotifications?.conversations?.share?.update ||
          false,
        error: null,
        valid: false,
        label: this.$t("user_settings.notifications.conversations.add_label"),
      },
      fieldConvShareDel: {
        value:
          this.userInfo?.emailNotifications?.conversations?.share?.delete ||
          false,
        error: null,
        valid: false,
        label: this.$t("user_settings.notifications.conversations.del_label"),
      },
      fieldConvShareUpdate: {
        value:
          this.userInfo?.emailNotifications?.conversations?.share?.update ||
          false,
        error: null,
        valid: false,
        label: this.$t(
          "user_settings.notifications.conversations.update_label",
        ),
      },
      fieldOrgaAdd: {
        value: this.userInfo?.emailNotifications?.organizations?.add || false,
        error: null,
        valid: false,
        label: this.$t("user_settings.notifications.organizations.add_label"),
      },
      fieldOrgaDel: {
        value:
          this.userInfo?.emailNotifications?.organizations?.delete || false,
        error: null,
        valid: false,
        label: this.$t("user_settings.notifications.organizations.del_label"),
      },
      fieldOrgaUpdate: {
        value:
          this.userInfo?.emailNotifications?.organizations?.update || false,
        error: null,
        valid: false,
        label: this.$t(
          "user_settings.notifications.organizations.update_label",
        ),
      },
    }
  },
  mounted() {},
  methods: {
    ...mapActions("user", ["updateUser"]),
    async updateNotifications(event) {
      event?.preventDefault()
      const payload = {
        emailNotifications: {
          conversations: {
            share: {
              add: this.fieldConvShareAdd.value,
              delete: this.fieldConvShareDel.value,
              update: this.fieldConvShareUpdate.value,
            },
          },
          organizations: {
            add: this.fieldOrgaAdd.value,
            delete: this.fieldOrgaDel.value,
            update: this.fieldOrgaUpdate.value,
          },
        },
      }
      let req = null
      if (!this.isAdminPage) {
        req = await this.updateUser(payload)
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

      return false
    },
  },
  components: { Fragment, FormCheckbox },
}
</script>

<style lang="scss" scoped>
.user-settings-notifications {
  fieldset {
    border: 1px solid #e0e0e0;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
