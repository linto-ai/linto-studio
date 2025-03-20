<template>
  <div class="subtitle-fullscreen-container" ref="fullscreenContainer">
    <div class="subtitle-fullscreen__rotate">
      <header class="subtitle-fullscreen__header">
        <button class="transparent">
          <span class="icon close large" @click="close"></span>
        </button>
      </header>
      <div class="subtitle-fullscreen__content">
        <SessionSubtitle
          :partialText="partialText"
          :finalText="finalText"
          :fontSize="fontSize"></SessionSubtitle>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"

import SessionSubtitle from "@/components/SessionSubtitle.vue"

export default {
  props: {
    partialText: {
      type: String,
      required: true,
    },
    finalText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fontSize: "32",
    }
  },
  mounted() {
    const container = this.$refs.fullscreenContainer

    container.requestFullscreen().catch((err) => {
      console.log(err)
    })
  },
  methods: {
    close() {
      document.exitFullscreen().catch((err) => {
        console.log(err)
      })

      this.$emit("close")
    },
  },
  components: {
    SessionSubtitle,
  },
}
</script>
