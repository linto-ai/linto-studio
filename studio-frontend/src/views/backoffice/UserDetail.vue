<template>
  <MainContentBackoffice :loading="loading">
    <UserSettingsRights :userInfo="user" />
    <UserSettingsPersonal :userInfo="user" />
    <UserSettingsPassword :userInfo="user" />
  </MainContentBackoffice>
</template>
<script>
import { apiGetPublicUserById } from "@/api/user.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserSettingsPersonal from "@/components/UserSettingsPersonal.vue"
import UserSettingsPassword from "@/components/UserSettingsPassword.vue"
import UserSettingsRights from "@/components/UserSettingsRights.vue"
export default {
  props: {},
  data() {
    return {
      loading: true,
      userId: this.$route.params.userId,
      user: null,
    }
  },
  mounted() {
    this.fetchUser()
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
  },
}
</script>
