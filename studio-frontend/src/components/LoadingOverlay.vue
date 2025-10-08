<template>
  <div id="loading-overlay" :visible="visible" v-if="visible">
    <h1 class="loadind-overlay__title">{{ title }}</h1>
    <span class="icon loading loadind-overlay__icon"></span>
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  data() {
    return {
      queue: {},
      title: "Loading",
      visible: false,
    }
  },
  mounted() {
    bus.$on("loading", (data) => {
      this.title = data.title
      this.visible = true
    })
    bus.$on("loaded", () => {
      this.visible = false
    })
  },

  beforeDestroy() {
    bus.$off("loading")
    bus.$off("loaded")
  },
}
</script>
