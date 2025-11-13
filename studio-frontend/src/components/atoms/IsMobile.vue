<template>
  <component :is="tag" v-if="isMobile" style="display: contents">
    <slot />
  </component>
  <component :is="tag" v-else-if="hasDesktopSlot" style="display: contents">
    <slot name="desktop" />
  </component>
</template>

<script>
import { mapGetters } from "vuex"

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
    tag: {
      type: String,
      default: "div",
    },
  },
  computed: {
    ...mapGetters("system", ["sidebarOpen", "isMobile"]),
    /**
     * Returns true if a named slot "desktop" has been provided.
     */
    hasDesktopSlot() {
      return Boolean(this.$slots.desktop || this.$scopedSlots.desktop)
    },
  },
}
</script>
