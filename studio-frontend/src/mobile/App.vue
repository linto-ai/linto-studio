<template>
  <div id="mobile-app">
    <router-view />
    <MobileNotifications />
  </div>
</template>

<script>
import MobileNotifications from "@/mobile/components/MobileNotifications.vue"
import {
  realtimeState,
  watchOrganizationSessions,
} from "@/mobile/services/realtime/mediaUpdates.js"

export default {
  name: "MobileApp",
  components: { MobileNotifications },
  computed: {
    // The scope picked by the user, without the default organization
    // fallback of getCurrentOrganizationScope (same as the classic App.vue).
    sessionsOrganizationId() {
      return this.$store.state.organizations.currentOrganizationScope
    },
    reconnectionCount() {
      return realtimeState().reconnectionCount
    },
  },
  watch: {
    // Pages read the sessions store and never subscribe themselves.
    sessionsOrganizationId: {
      handler(organizationId) {
        if (organizationId) watchOrganizationSessions(organizationId)
      },
      immediate: true,
    },
    // The feed only pushes changes: the end of the quick session during an
    // outage is caught up here (no-op without a quick session).
    reconnectionCount() {
      this.$store.dispatch("quickSession/syncQuickSession")
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
