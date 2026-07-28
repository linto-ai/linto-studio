<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <div class="flex1 flex align-center gap-small">
        <h1 v-if="user" class="flex1">{{ userName }}</h1>
        <Button
          @click="impersonateUser(userId)"
          variant="tertiary"
          icon="user-switch"
          style="white-space: nowrap"
          :label="$t('impersonation.user_button_label')" />
      </div>
    </template>
    <UserSettingsRights :userInfo="user" />
    <UserSettingsPersonal :userInfo="user" isAdminPage />
    <UserSettingsPassword :userInfo="user" isAdminPage />
    <UserSettingsOrganization :userInfo="user" isAdminPage />
  </MainContentBackoffice>
</template>
<script>
import { apiGetPublicUserById } from "@/api/user.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { impersonationMixin } from "@/mixins/impersonation.js"
import { userName } from "@/tools/userName.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserSettingsPersonal from "@/components/UserSettingsPersonal.vue"
import UserSettingsPassword from "@/components/UserSettingsPassword.vue"
import UserSettingsRights from "@/components/UserSettingsRights.vue"
import UserSettingsOrganization from "@/components/UserSettingsOrganization.vue"
export default {
  mixins: [platformRoleMixin, impersonationMixin],
  props: {},
  data() {
    return {
      loading: true,
      userId: this.$route.params.userId,
      user: null,
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.fetchUser()
  },
  computed: {
    userName() {
      return this.user ? userName(this.user) : ""
    },
  },
  methods: {
    async fetchUser() {
      this.loading = true
      const req = await apiGetPublicUserById(this.userId)
      if (req.error) {
        this.$router.push({ name: "not_found" })
        return
      }
      this.user = req.data
      this.loading = false
    },
  },
  components: {
    MainContentBackoffice,
    UserSettingsPersonal,
    UserSettingsPassword,
    UserSettingsRights,
    UserSettingsOrganization,
  },
}
</script>
