<template>
  <div class="subtitle-fullscreen-container" ref="fullscreenContainer">
    <div class="subtitle-fullscreen__rotate">
      <header class="subtitle-fullscreen__header">
        <Button variant="transparent" @click="close" icon="x" size="lg" />
      </header>
      <div class="subtitle-fullscreen__content">
        <SessionSubtitle
          :partialText="partialText"
          :finalText="finalText"
          :fontSize="fontSize"
          :watermarkFrequency="watermarkFrequency"
          :watermarkDuration="watermarkDuration"
          :watermarkContent="watermarkContent"
          :watermarkPinned="watermarkPinned"
          :displayWatermark="displayWatermark"></SessionSubtitle>
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
    watermarkFrequency: {
      type: Number,
      required: true,
    },
    watermarkDuration: {
      type: Number,
      required: true,
    },
    watermarkContent: {
      type: String,
      required: true,
    },
    watermarkPinned: {
      type: Boolean,
      required: true,
    },
    displayWatermark: {
      type: Boolean,
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

    try {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch((err) => {
          console.log(err)
        })
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      } else {
        console.warn("Fullscreen API is not supported on this browser.")
      }
    } catch (err) {
      console.log(err)
    }
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
