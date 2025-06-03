<template>
  <div class="session-content__subtitle" :style="style">
    <div :style="style" id="scroller-container">
      <canvas id="scroller" width="100%" :height="canvaHeight"></canvas>
    </div>
    <div
      id="session-content__subtitle__watermark"
      class="hidden-watermark"
      v-html="watermarkWithImages"></div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { SubtitleScroller } from "@/models/SubtitleDrawer.js"
import { getEnv } from "@/tools/getEnv"

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
    fontSize: {
      type: String,
      default: "40",
    },
    previousTurns: {
      type: Array,
      default: () => [],
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
      canvas: null,
      lineHeight: 1.2 * this.fontSize,
      subtitleDrawer: null,
      canvaHeight: 2.4 * this.fontSize,
      watermarkInterval: null,
      isUnmounted: false,
      watermarkShowTimeout: null,
      watermarkHideTimeout: null,
    }
  },
  async mounted() {
    this.canvas = document.getElementById("scroller")
    this.subtitleDrawer = new SubtitleScroller(this.canvas, {
      fontSize: Number(this.fontSize),
      lineHeight: this.lineHeight,
    })

    if (this.displayWatermark && !this.watermarkPinned) {
      this.watermarkShowTimeout = setTimeout(
        this.drawWatermark.bind(this),
        this.watermarkFrequency * 1000,
      )
    }

    if (this.displayWatermark && this.watermarkPinned) {
      this.drawWatermark()
    }

    bus.$on("clear-session-subtitles", this.reset)
  },
  beforeDestroy() {
    bus.$off("clear-session-subtitles", this.reset)
  },
  watch: {
    partialText: function (newVal, oldVal) {
      if (newVal.trim().length > 0) this.subtitleDrawer.newPartial(newVal)
    },
    finalText: function (newVal, oldVal) {
      this.subtitleDrawer.newFinal(newVal)
    },
    displayWatermark: function (newVal, oldVal) {
      clearTimeout(this.watermarkShowTimeout)
      clearTimeout(this.watermarkHideTimeout)
      this.hideWatermark()
    },
    watermarkFrequency: function (newVal, oldVal) {
      clearTimeout(this.watermarkShowTimeout)
      clearTimeout(this.watermarkHideTimeout)
      if (!this.watermarkPinned) {
        this.hideWatermark()
      }
    },
    watermarkDuration: function (newVal, oldVal) {
      clearTimeout(this.watermarkShowTimeout)
      clearTimeout(this.watermarkHideTimeout)
      if (!this.watermarkPinned) {
        this.hideWatermark()
      }
    },
    watermarkPinned: function (newVal, oldVal) {
      clearTimeout(this.watermarkShowTimeout)
      clearTimeout(this.watermarkHideTimeout)
      if (newVal) {
        this.drawWatermark()
      } else {
        this.hideWatermark()
      }
    },
  },
  computed: {
    style() {
      return {
        height: this.canvaHeight + "px",
        //lineHeight: this.lineHeight,
      }
    },
    watermarkWithImages() {
      // <img id="logo-linto-inline" src="/img/linto.svg" />
      // <img src="/img/linagora.png" id="logo-linagora-inline" />
      // replace $linto and $linagora with the images and sanitize the string
      return this.watermarkContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(
          "$linto",
          '<img id="logo-linto-inline" src="/img/linto.svg" />',
        )
        .replace(
          "$linagora",
          '<img src="/img/linagora.png" id="logo-linagora-inline" />',
        )
    },
  },

  methods: {
    reset() {
      this.subtitleDrawer.resetDrawing()
      this.subtitleDrawer.resetAll()
    },
    drawWatermark() {
      if (this.isUnmounted) return

      const watermark = document.getElementById(
        "session-content__subtitle__watermark",
      )
      const scrollerContainer = document.getElementById("scroller-container")

      if (!watermark || !scrollerContainer || !this.displayWatermark) return

      watermark.classList.add("displayed-watermark")
      watermark.classList.remove("hidden-watermark")
      scrollerContainer.classList.add("scroller-smaller")
      scrollerContainer.classList.remove("scroller-bigger")

      if (!this.watermarkPinned) {
        this.watermarkHideTimeout = setTimeout(
          this.hideWatermark.bind(this),
          this.watermarkDuration * 1000,
        )
      }
    },
    hideWatermark() {
      if (this.isUnmounted) return

      const watermark = document.getElementById(
        "session-content__subtitle__watermark",
      )
      const scrollerContainer = document.getElementById("scroller-container")

      if (!watermark || !scrollerContainer) return

      watermark.classList.add("hidden-watermark")
      watermark.classList.remove("displayed-watermark")
      scrollerContainer.classList.add("scroller-bigger")
      scrollerContainer.classList.remove("scroller-smaller")

      this.watermarkShowTimeout = setTimeout(
        this.drawWatermark.bind(this),
        this.watermarkFrequency * 1000,
      )
    },
  },
  components: { Fragment },
}
</script>
