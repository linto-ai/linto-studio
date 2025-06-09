<template>
  <div
    class="popover-wrapper"
    :style="popoverStyle"
    ref="wrapper"
    @mouseenter="controller.onContentEnter"
    @mouseleave="controller.onContentLeave"
  >
    <div class="popover-content" :class="[position, contentClass]" ref="content">
      <VNodeRenderer :nodes="slots.default" />
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
  },
  computed: {
    popoverStyle() {
      return {
        position: "fixed",
        left: `${this.popoverCoords.left}px`,
        top: `${this.popoverCoords.top}px`,
        zIndex: this.zIndex,
      };
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