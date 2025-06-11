<template>
  <div id="app">
    <div id="app-view" class="flex col flex1">
      <!-- <keep-alive>
        <router-view
          v-if="isAuthenticated"
          name="AppHeader"
          :currentOrganizationScope="currentOrganizationScope"
          :userInfo="user"
          :userOrganizations="userOrganizations"
          :currentOrganization="currentOrganization"></router-view> 
      </keep-alive> -->
      <div class="app-view-content flex col flex1">
        <router-view
          :userInfo="user"
          :userOrganizations="userOrganizations"
          :currentOrganizationScope="currentOrganizationScope"
          :currentOrganization="currentOrganization" />
      </div>
      <AppSettingsModal />
      <PopupHost />
      <AppNotifications />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main"

import { customDebug } from "@/tools/customDebug.js"
import isAuthenticated from "@/tools/isAuthenticated.js"
import AppSettingsModal from "@/components/AppSettingsModal.vue"
import PopupHost from "@/components/PopupHost.vue"
import AppNotifications from "@/components/AppNotifications.vue"
export default {
  props: {},
  data() {
    return {
      appDebug: customDebug("vue:debug:app"),
      noOrganization: false,
    }
  },
  methods: {
    ...mapActions("user", ["fetchUser"]),
    ...mapActions("organizations", ["fetchOrganizations"]),
  },
  computed: {
    ...mapGetters("user", { user: "getUserInfos" }),
    ...mapGetters("organizations", {
      userOrganizations: "getOrganizationsAsArray",
      currentOrganization: "getCurrentOrganization",
    }),
    currentOrganizationScope: function () {
      return this.$route.params.organizationId
    },
    isPublicPage: function () {
      return this.$route.meta.public
    },
    isAuthenticated: function () {
      return isAuthenticated()
    },
  },
  mounted() {
    // notification usage
    // this.$store.dispatch("system/addNotification", {
    //   message: "Hello, world!",
    //   type: "success",
    //   timeout: 5000,
    // })

    // keep compatibility with old notification system (don't use bus for new notifications)
    bus.$on("app_notif", (data) => {
      this.$store.dispatch("system/addNotification", {
        message: data.message,
        type: data.status,
        timeout: data.timeout,
      })
    })
  },
  components: {
    AppSettingsModal,
    PopupHost,
    AppNotifications,
  },
}
</script>
<style lang="scss">
@import "@/style/style.scss";
</style>
