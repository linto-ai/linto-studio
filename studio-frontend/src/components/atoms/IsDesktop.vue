<template>
  <component :is="tag" v-if="isDesktop">
    <slot />
  </component>
  <component :is="tag" v-else-if="hasMobileSlot">
    <slot name="mobile" />
  </component>
</template>

<script>
export default {
  name: "IsDesktop",
  /**
   * Props
   * @prop {Number} minWidth - viewport width (px) above which the slot is displayed. Default: 1100
   * @prop {String} tag - HTML tag used for the wrapper. Default: "div"
   *
   * Usage example:
   * <is-desktop :min-width="1100" tag="span">
   *   Desktop only content
   *   <template #mobile>
   *     Mobile or tablet content
   *   </template>
   * </is-desktop>
   */
  props: {
    minWidth: {
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
      isDesktop: false,
    }
  },
  mounted() {
    if (typeof window === "undefined") return // SSR guard
    this._checkIsDesktop()
    // Throttle resize handler with requestAnimationFrame – lightweight, avoids flood.
    this._onResize = () => {
      window.requestAnimationFrame(this._checkIsDesktop)
    }
    window.addEventListener("resize", this._onResize, { passive: true })
  },
  beforeDestroy() {
    if (typeof window === "undefined") return
    window.removeEventListener("resize", this._onResize)
  },
  methods: {
    /**
     * Updates `isDesktop` depending on current viewport width.
     */
    _checkIsDesktop() {
      this.isDesktop = window.matchMedia(
        `(min-width: ${this.minWidth}px)`,
      ).matches
    },
  },
  computed: {
    /**
     * Returns true if a named slot "mobile" has been provided.
     */
    hasMobileSlot() {
      return Boolean(this.$slots.mobile || this.$scopedSlots.mobile)
    },
  },
}
</script>
