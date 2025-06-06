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
      <portal-target name="body"></portal-target>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { customDebug } from "@/tools/customDebug.js"
import isAuthenticated from "@/tools/isAuthenticated.js"
import AppSettingsModal from "@/components/AppSettingsModal.vue"

export default {
  props: {},
  data() {
    return {
      appDebug: customDebug("vue:debug:app"),
      noOrganization: false,
    }
  },
  async mounted() {},
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
  components: {
    AppSettingsModal,
  },
}
</script>
<style lang="scss">
@import "@/style/style.scss";
</style>
