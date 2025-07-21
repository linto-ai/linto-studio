<template>
  <component :is="tag" v-if="isDesktop" style="display: contents">
    <slot />
  </component>
  <component :is="tag" v-else-if="hasMobileSlot" style="display: contents">
    <slot name="mobile" />
  </component>
</template>

<script>
import { mapGetters } from "vuex"

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
    tag: {
      type: String,
      default: "div",
    },
  },
  computed: {
    ...mapGetters("system", ["isDesktop"]),
    /**
     * Returns true if a named slot "mobile" has been provided.
     */
    hasMobileSlot() {
      return Boolean(this.$slots.mobile || this.$scopedSlots.mobile)
    },
  },
}
</script>
