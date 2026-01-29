<template>
  <div
    class="popover-wrapper"
    :style="popoverStyle"
    ref="wrapper"
    tabindex="-1"
    @mouseenter="controller.onContentEnter"
    @mouseleave="controller.onContentLeave"
    @click="handleClickInside"
    @keydown="handleKeydown">
    <div
      class="popover-content"
      :class="[position, contentClass]"
      ref="content"
      :style="computedContentStyle">
      <VNodeRenderer :nodes="renderedSlots" />
    </div>
  </div>
</template>

<script>
import VNodeRenderer from "@/components/atoms/VNodeRenderer.vue"
import POPOVER_MARGIN from "@/const/popoverMargin.js"

export default {
  name: "PopoverRenderer",
  components: { VNodeRenderer },
  props: {
    controller: { type: Object, required: true },
    slots: { type: Object, required: true },
    zIndex: { type: Number, default: 0 },
    position: { type: String, default: "bottom" },
    popoverCoords: { type: Object, required: true },
    contentClass: { type: String, default: "" },
    width: { type: [String, Number], default: "auto" },
    widthRef: { type: HTMLElement, default: null },
    /**
     * Maximum height for the popover content. If set to "auto" the component
     * will compute the available space based on viewport and popover position.
     */
    maxHeight: { type: [String, Number], default: "auto" },
  },
  data() {
    return {
      computedWidth: null,
    }
  },
  mounted() {
    this.computeWidth()
  },
  computed: {
    popoverStyle() {
      return {
        position: "fixed",
        left: `${this.popoverCoords.left}px`,
        top: `${this.popoverCoords.top}px`,
        zIndex: this.zIndex,
        width: this.computedWidth,
      }
    },
    renderedSlots() {
      // Evaluate the slot function each time to maintain reactivity
      return typeof this.slots.default === "function"
        ? this.slots.default()
        : this.slots.default || []
    },
    computedMaxHeight() {
      // explicit value provided
      if (this.maxHeight !== "auto") {
        return typeof this.maxHeight === "number"
          ? `${this.maxHeight}px`
          : this.maxHeight
      }

      const viewportHeight =
        typeof window !== "undefined" ? window.innerHeight : 800
      const margin = POPOVER_MARGIN // space from viewport edges

      let available
      if (this.position === "bottom") {
        available = viewportHeight - this.popoverCoords.top - margin
      } else if (this.position === "top") {
        available = this.popoverCoords.top - margin
      } else {
        // left / right / other positions: default to full viewport minus margin
        available = viewportHeight - margin * 2
      }

      // guarantee a reasonable minimum height
      return `${Math.max(120, available)}px`
    },
    computedContentStyle() {
      return {
        width: this.computedWidth,
        minWidth: this.widthRef.offsetWidth + "px",
        maxHeight: this.computedMaxHeight,
        overflowY: "auto",
      }
    },
  },
  methods: {
    computeWidth() {
      if (this.width === "auto") {
        this.computedWidth = "auto"
        return
      }

      if (this.width === "ref" && this.widthRef) {
        this.computedWidth = this.widthRef.offsetWidth + "px"
      } else {
        this.computedWidth = this.width
      }
    },
    /**
     * Close the popover when clicking inside its content if the parent Popover
     * has the `closeOnClick` option enabled. This is particularly useful for
     * tooltips opened on hover that should disappear once the user interacts
     * with their content (e.g. selecting a tag).
     */
    handleClickInside(event) {
      if (
        this.controller &&
        this.controller.$props &&
        this.controller.$props.closeOnClick === true
      ) {
        // Prevent the click from bubbling further to avoid unintended side-effects
        // then ask the parent Popover to close itself.
        event.stopPropagation()
        this.controller.close()
      }
    },
    closeOnClickOutside() {
      // Popovers always close on outside click
      this.controller.closeOnClickOutside()
    },
    closeOnEscape() {
      this.controller.closeOnEscape()
    },
    handleKeydown(event) {
      // Forward keydown to controller if it has a handler
      if (this.controller && typeof this.controller.onContentKeydown === "function") {
        this.controller.onContentKeydown(event)
      }
    },
    focus() {
      this.$refs.wrapper && this.$refs.wrapper.focus()
    },
  },
}
</script>

<style lang="scss">
.popover-wrapper {
  position: absolute;
  outline: none;
}

.popover-content:has(> div) {
  background: var(--neutral-10);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}
</style>
