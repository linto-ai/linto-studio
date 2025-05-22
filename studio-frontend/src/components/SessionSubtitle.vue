<template>
  <div class="session-content__subtitle" :style="style">
    <div :style="style" id="scroller-container">
      <canvas id="scroller" width="100%" :height="canvaHeight"></canvas>
    </div>
    <div id="session-content__subtitle__watermark" class="hidden-watermark">
      {{ $t("session.detail_page.subtitle.watermark_1") }}
      <img id="logo-linto-inline" src="/img/linto.svg" />,
      {{ $t("session.detail_page.subtitle.watermark_2") }}
      <img src="/img/linagora.png" id="logo-linagora-inline" />
    </div>
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
  },
  data() {
    return {
      canvas: null,
      lineHeight: 1.2 * this.fontSize,
      subtitleDrawer: null,
      canvaHeight: 2.4 * this.fontSize,
      watermarkInterval: null,
      isUnmounted: false,
    }
  },
  async mounted() {
    this.canvas = document.getElementById("scroller")
    this.subtitleDrawer = new SubtitleScroller(this.canvas, {
      fontSize: Number(this.fontSize),
      lineHeight: this.lineHeight,
    })
    setTimeout(
      this.drawWatermark.bind(this),
      getEnv("VUE_APP_WATERMARK_FREQUENCY") * 1000,
    )
  },
  watch: {
    partialText: function (newVal, oldVal) {
      if (newVal.trim().length > 0) this.subtitleDrawer.newPartial(newVal)
    },
    finalText: function (newVal, oldVal) {
      this.subtitleDrawer.newFinal(newVal)
    },
  },
  computed: {
    style() {
      return {
        height: this.canvaHeight + "px",
        //lineHeight: this.lineHeight,
      }
    },
  },

  methods: {
    drawWatermark() {
      if (this.isUnmounted) return

      const watermark = document.getElementById(
        "session-content__subtitle__watermark",
      )
      const scrollerContainer = document.getElementById("scroller-container")

      if (!watermark || !scrollerContainer) return

      watermark.classList.add("displayed-watermark")
      watermark.classList.remove("hidden-watermark")
      scrollerContainer.classList.add("scroller-smaller")
      scrollerContainer.classList.remove("scroller-bigger")
      setTimeout(
        this.hideWatermark.bind(this),
        getEnv("VUE_APP_WATERMARK_DURATION") * 1000,
      )
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
      setTimeout(
        this.drawWatermark.bind(this),
        getEnv("VUE_APP_WATERMARK_FREQUENCY") * 1000,
      )
    },
  },
  components: { Fragment },
}
</script>
