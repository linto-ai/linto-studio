<template>
  <form @submit="updateNotifications">
    <section>
      <h2>{{ $t("usersettings.notifications.title") }}</h2>
      <fieldset class="small-margin">
        <legend>
          {{ $t("usersettings.notifications.conversations.title") }}
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
          {{ $t("usersettings.notifications.organizations.title") }}
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

      <button type="submit" class="btn small-margin">
        <span class="icon apply"></span>
        <span class="label">{{
          $t("usersettings.notifications.submit_button")
        }}</span>
      </button>
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import FormCheckbox from "./FormCheckbox.vue"
import { apiUpdateUserInfo } from "../api/user"
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
        label: this.$t("usersettings.notifications.conversations.add_label"),
      },
      fieldConvShareDel: {
        value:
          this.userInfo?.emailNotifications?.conversations?.share?.delete ||
          false,
        error: null,
        valid: false,
        label: this.$t("usersettings.notifications.conversations.del_label"),
      },
      fieldConvShareUpdate: {
        value:
          this.userInfo?.emailNotifications?.conversations?.share?.update ||
          false,
        error: null,
        valid: false,
        label: this.$t("usersettings.notifications.conversations.update_label"),
      },
      fieldOrgaAdd: {
        value: this.userInfo?.emailNotifications?.organizations?.add || false,
        error: null,
        valid: false,
        label: this.$t("usersettings.notifications.organizations.add_label"),
      },
      fieldOrgaDel: {
        value:
          this.userInfo?.emailNotifications?.organizations?.delete || false,
        error: null,
        valid: false,
        label: this.$t("usersettings.notifications.organizations.del_label"),
      },
      fieldOrgaUpdate: {
        value:
          this.userInfo?.emailNotifications?.organizations?.update || false,
        error: null,
        valid: false,
        label: this.$t("usersettings.notifications.organizations.update_label"),
      },
    }
  },
  mounted() {},
  methods: {
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

      let req = await apiUpdateUserInfo(payload, {
        timeout: 3000,
        redirect: false,
      })

      if (req.status === "success") {
        bus.$emit("user_settings_update", {})
      }

      return false
    },
  },
  components: { Fragment, FormCheckbox },
}
</script>
