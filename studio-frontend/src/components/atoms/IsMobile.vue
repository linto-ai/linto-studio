<template>
  <component :is="tag" v-if="isMobile" style="display: contents">
    <slot />
  </component>
  <component :is="tag" v-else-if="hasDesktopSlot" style="display: contents">
    <slot name="desktop" />
  </component>
</template>

<script>
export default {
  name: "IsMobile",
  /**
   * Props
   * @prop {Number} maxWidth - viewport width (px) under which the slot is displayed. Default: 768
   * @prop {String} tag - HTML tag used for the wrapper. Default: "div"
   *
   * Usage example:
   * <is-mobile :max-width="1100" tag="span">
   *  Mobile or tablet only content
   *  <template #desktop>
   *    Desktop content
   *  </template>
   * </is-mobile>
   */
  props: {
    maxWidth: {
      type: Number,
      default: 1100,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  data() {
    return {
      isMobile: false,
    }
  },
  mounted() {
    if (typeof window === "undefined") return // SSR guard
    this._checkIsMobile()
    // Throttle resize handler with requestAnimationFrame – lightweight, avoids flood.
    this._onResize = () => {
      window.requestAnimationFrame(this._checkIsMobile)
    }
    window.addEventListener("resize", this._onResize, { passive: true })
  },
  beforeDestroy() {
    if (typeof window === "undefined") return
    window.removeEventListener("resize", this._onResize)
  },
  methods: {
    /**
     * Updates `isMobile` depending on current viewport width.
     */
    _checkIsMobile() {
      this.isMobile = window.matchMedia(
        `(max-width: ${this.maxWidth}px)`,
      ).matches
    },
  },
  computed: {
    /**
     * Returns true if a named slot "desktop" has been provided.
     */
    hasDesktopSlot() {
      return Boolean(this.$slots.desktop || this.$scopedSlots.desktop)
    },
  },
}
</script>
