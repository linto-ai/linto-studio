<template>
  <span class="app-name">
    <template v-if="isDefaultName">
      <span class="app-name__brand">LinTO</span>
      <span class="app-name__rest"> Studio</span>
    </template>
    <template v-else>{{ name }}</template>
  </span>
</template>

<script>
import { getEnv } from "@/tools/getEnv"
import defaultEnv from "@/const/defaultEnv"

export default {
  name: "AppName",
  computed: {
    name() {
      return getEnv("VUE_APP_NAME")
    },
    // Only the product's own default name gets the "LinTO" emphasis — a
    // whitelabel customer's custom name (e.g. "Super Transcriber") is never split.
    isDefaultName() {
      return this.name === defaultEnv.VUE_APP_NAME
    },
  },
}
</script>

<style lang="scss" scoped>
.app-name__brand {
  font-weight: 700;
  color: var(--primary-color);
}

.app-name__rest {
  font-weight: 400;
  color: var(--text-primary);
}
</style>
