<template>
  <div id="mobile-app">
    <router-view />
    <MobileNotifications />
  </div>
</template>

<script>
import MobileNotifications from "@/mobile/components/MobileNotifications.vue"

export default {
  name: "MobileApp",
  components: { MobileNotifications },
}
</script>

<style>
#mobile-app {
  min-height: 100dvh;
  background: var(--m-bg);
  color: var(--m-text);
}
</style>
