<template>
  <div
    class="popover-wrapper"
    :style="popoverStyle"
    ref="wrapper"
    @mouseenter="controller.onContentEnter"
    @mouseleave="controller.onContentLeave"
  >
    <div class="popover-content" :class="[position, contentClass]" ref="content" :style="computedContentStyle">
      <VNodeRenderer :nodes="renderedSlots" />
    </div>
  </div>
</template>

<script>
import VNodeRenderer from "@/components/atoms/VNodeRenderer.vue";

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
    /**
     * Maximum height for the popover content. If set to "auto" the component
     * will compute the available space based on viewport and popover position.
     */
    maxHeight: { type: [String, Number], default: "auto" },
  },
  computed: {
    popoverStyle() {
      return {
        position: "fixed",
        left: `${this.popoverCoords.left}px`,
        top: `${this.popoverCoords.top}px`,
        zIndex: this.zIndex,
        width: this.computedWidth,
      };
    },
    renderedSlots() {
      // Evaluate the slot function each time to maintain reactivity
      return typeof this.slots.default === 'function' 
        ? this.slots.default() 
        : this.slots.default || [];
    },
    computedWidth() {
      if (this.width === "auto") {
        return "auto";
      }

      if (this.width === "ref") {
        // use the width of the trigger element
        return this.controller.$refs.trigger.offsetWidth + 'px'
      }

      return this.width
    },
    computedMaxHeight() {
      // explicit value provided
      if (this.maxHeight !== 'auto') {
        return typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight
      }

      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
      const margin = 12 // space from viewport edges

      let available
      if (this.position === 'bottom') {
        available = viewportHeight - this.popoverCoords.top - margin
      } else if (this.position === 'top') {
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
        maxHeight: this.computedMaxHeight,
        overflowY: 'auto',
      }
    },
  },
  methods: {
    closeOnClickOutside() {
      // Popovers always close on outside click
      this.controller.closeOnClickOutside();
    },
    closeOnEscape() {
      this.controller.closeOnEscape();
    },
  },
};
</script>

<style lang="scss">
.popover-wrapper {
  position: absolute;
}

.popover-content {
  background: var(--neutral-10);
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}
</style> 