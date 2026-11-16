<template>
  <div id="mobile-app">
    <router-view v-if="ready" />
    <AppLoading v-else :message="loadingMessage" />
    <MobileNotifications />
  </div>
</template>

<script>
import MobileNotifications from "@/mobile/components/MobileNotifications.vue"
import AppLoading from "@/mobile/components/AppLoading.vue"
import { getEnv } from "@/tools/getEnv"
import { formatApiAddress } from "@/tools/formatApiAddress.js"

export default {
  name: "MobileApp",
  components: { MobileNotifications, AppLoading },
  data() {
    // Until the first navigation is resolved (the guard waits for the API,
    // up to the healthcheck timeout), nothing would be shown.
    return { ready: false }
  },
  computed: {
    loadingMessage() {
      return this.$t("mobile.boot.connecting", {
        address: formatApiAddress(
          getEnv("VUE_APP_CONVO_API"),
          window.location.href,
        ),
      })
    },
  },
  created() {
    this.$router.onReady(this.showPage, this.showPage)
  },
  methods: {
    showPage() {
      this.ready = true
    },
  },
}
</script>

<style>
#mobile-app {
  min-height: 100dvh;
  background: var(--m-bg);
  color: var(--m-text);
}
</style>
