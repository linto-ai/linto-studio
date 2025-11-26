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
          :key="$route.fullPath"
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
import getCurrentTheme from "@/tools/getCurrentTheme.js"
import { getEnv } from "@/tools/getEnv"

import AppSettingsModal from "@/components/AppSettingsModal.vue"
import PopupHost from "@/components/PopupHost.vue"
import AppNotifications from "@/components/AppNotifications.vue"

import "@/style/style.scss"

export default {
  props: {},
  data() {
    return {
      appDebug: customDebug("vue:debug:app"),
      noOrganization: false,
      loader: null,
    }
  },
  methods: {
    ...mapActions("user", ["fetchUser"]),
    ...mapActions("organizations", ["fetchOrganizations"]),
    ...mapActions("system", ["setIsMobile"]),
    _checkIsMobile() {
      this.setIsMobile(window.matchMedia(`(max-width: ${1100}px)`).matches)
    },
  },
  computed: {
    ...mapGetters("user", { user: "getUserInfos" }),
    ...mapGetters("system", { isLoading: "isLoading" }),
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
  beforeCreate() {
    // Limit the dynamic import context so that webpack only considers SCSS files inside the "themes" directory.
    // This avoids having it try to parse unrelated files at the project root (Dockerfile, README.md, ...).
    /* eslint-disable-next-line import/no-dynamic-require */
    import(
      /* webpackInclude: /themes\/.*\/style\/style\.scss$/ */
      `../${getCurrentTheme()["stylePath"]}`
    )
  },
  mounted() {
    // notification usage
    // this.$store.dispatch("system/addNotification", {
    //   message: "Hello, world!",
    //   type: "success",
    //   timeout: 5000,
    // })

    this._checkIsMobile()
    this._onResize = () => {
      window.requestAnimationFrame(this._checkIsMobile)
    }
    window.addEventListener("resize", this._onResize, { passive: true })
    // keep compatibility with old notification system (don't use bus for new notifications)
    bus.$on("app_notif", (data) => {
      this.$store.dispatch("system/addNotification", {
        message: data.message,
        type: data.status,
        timeout: data.timeout ?? 5000,
        closable: data.cantBeClosed ?? true,
      })
    })

    if (this.isAuthenticated) {
      this.$apiEventWS.connect()
    }
  },
  watch: {
    isLoading: {
      handler(value) {
        if (value) {
          this.loader = this.$loading.show({
            // Optional parameters
            canCancel: true,
          })
        } else {
          this.loader.hide()
        }
      },
      immediate: true,
    },
  },
  components: {
    AppSettingsModal,
    PopupHost,
    AppNotifications,
  },
}
</script>
<style lang="scss">
// @use "@/style/style.scss";
// TODO: import from env variable instead of hardcoding
// @use "../themes/LinTO-green/style/style.scss" as style-theme;
</style>
