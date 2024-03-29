<template>
  <div id="app" v-if="dataLoaded || noOrganization">
    <div id="app-view" class="flex col flex1">
      <!-- HEADER -->
      <keep-alive>
        <router-view
          name="AppHeader"
          v-if="!editorView"
          :currentOrganizationScope="currentOrganizationScope"
          :noOrganization="noOrganization"
          :userInfo="userInfo"
          :userOrganizations="userOrganizations"
          :currentOrganization="currentOrganization"></router-view>
      </keep-alive>
      <div class="app-view-content flex col flex1" v-if="!error">
        <!-- MAIN VIEW -->
        <!-- <loading-overlay></loading-overlay> -->
        <router-view
          v-if="!noOrganization"
          :userInfo="userInfo"
          :currentOrganizationScope="currentOrganizationScope"
          :userOrganizations="userOrganizations"
          :currentOrgaPersonal="currentOrgaPersonal"
          :currentOrganization="currentOrganization"
          :key="resetKey"></router-view>

        <NoOrganizationComponent v-else />
      </div>
      <ErrorView v-else />

      <router-view name="AppNotif"></router-view>
    </div>
  </div>
  <div v-else>
    <div
      class="flex col flex1 align-center justify-center"
      style="height: 100vh">
      <Loading />
    </div>
  </div>
</template>
<script>
import { bus } from "./main.js"
import LoadingOverlay from "@/components/LoadingOverlay.vue"
import ErrorView from "./views/Error.vue"
import Loading from "./components/Loading.vue"
import PUBLIC_ROUTES from "./const/publicRoutes.js"
import NoOrganizationComponent from "./views/NoOrganization.vue"
export default {
  data() {
    return {
      appMounted: false,
      orgasLoaded: false,
      userOrgasLoaded: false,
      currentRoute: {},
      convosLoaded: false,
      error: false,
      resetKey: 0,
      noOrganization: false,
    }
  },
  mounted() {
    this.appMounted = true
    bus.$on("set_organization_scope", async (data) => {
      this.setOrganizationScope(data.organizationId)
      await this.dispatchUserOrganizations()
    })
    bus.$on("user_settings_update", async () => {
      await this.getuserInfo()
      await this.dispatchUserOrganizations()
    })
    bus.$on("user_orga_update", async () => {
      await this.dispatchUserOrganizations()
    })

    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("currentTheme") || "light"
    )
  },
  beforeDestroy() {
    bus.$off("set_organization_scope")
    bus.$off("user_settings_update")
    bus.$off("user_orga_update")
  },
  watch: {
    $route(to, from) {
      this.resetKey++
      this.error = false
      bus.$emit("navigation", to)
    },
    async isPrivateRoute(isPrivate) {
      if (isPrivate) {
        await this.getuserInfo()
        await this.dispatchUserOrganizations()
      }
    },
  },
  computed: {
    isPrivateRoute() {
      if (
        this.$route.name !== null &&
        !PUBLIC_ROUTES.includes(this.$route.name)
      ) {
        return true
      }
      return false
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    dataLoaded() {
      if (this.isPrivateRoute) {
        return (
          !!this.userInfo &&
          this.appMounted &&
          this.userOrgasLoaded &&
          this.currentOrganizationScope &&
          this.currentOrganization._id
        )
      }
      return true
    },
    userOrganizations() {
      return this.$store.state.userOrganizations
    },
    currentOrganizationScope() {
      if (this.userOrgasLoaded) {
        try {
          const orgaScopeId = this.$store.getters.getCurrentOrganizationScope()
          return orgaScopeId
        } catch (error) {
          console.error("err: ", error)
          this.noOrganization = true
          return null
        }
      }
      return null
    },
    currentOrganization() {
      if (this.currentOrganizationScope !== null) {
        return this.$store.state.currentOrganization
      }
      return {}
    },
    currentOrgaPersonal() {
      return false
    },
    editorView() {
      return (
        [
          "conversations transcription",
          "conversations overview",
          "conversations publish",
          "conversations subtitle",
        ].indexOf(this.$route.name) > -1
      )
    },
    listView() {
      return ["inbox", "explore"].indexOf(this.$route.name) > -1
    },
  },
  methods: {
    async setOrganizationScope(organizationId) {
      this.$options.filters.setCookie("cm_orga_scope", organizationId, 7)
      if (!this.listView) {
        this.$router.push({ name: "inbox" })
      }
    },
    async getuserInfo() {
      try {
        const req = await this.$store.dispatch("getPersonalInfo")
        if (!req) {
          this.$options.filters.logout()
        }
      } catch (error) {
        console.error("err: ", error)
        return
      }
    },
    async dispatchUserOrganizations() {
      try {
        this.userOrgasLoaded = await this.$options.filters.dispatchStore(
          "getUserOrganizations"
        )
        const orgaScopeId = this.$store.getters.getCurrentOrganizationScope()
        await this.$store.dispatch("getCurrentOrganizationById", orgaScopeId)
      } catch (error) {
        console.error("err: ", error)
        return
      }
    },
  },
  components: {
    LoadingOverlay,
    Loading,
    ErrorView,
    NoOrganizationComponent,
  },
  errorCaptured(error) {},
}
</script>
<style lang="scss">
@import "../public/sass/styles.scss";
</style>
