<template>
  <div>
    <div
      class="popover-trigger"
      ref="trigger"
      v-on="triggerHandlers"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <slot name="trigger"></slot>
    </div>
    <portal to="body">
      <div v-if="isOpen">
        <div
          class="popover-wrapper"
          ref="wrapper"
          :style="popoverStyle"
          @mouseenter="onPopoverMouseEnter"
          @mouseleave="onPopoverMouseLeave">
          <div class="popover-content" :class="position" ref="content">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
import popupManager from "@/tools/popupManager"
import PopoverRenderer from "./PopoverRenderer.vue"

export default {
  name: "Popover",
  props: {
    /**
     * If true, an overlay will be displayed on the page when the popover is open
     */
    overlay: {
      type: Boolean,
      default: false,
    },
    /**
     * Event that triggers the popover: 'click', 'contextmenu', or 'hover'
     */
    trigger: {
      type: String,
      default: "click",
      validator: (value) => ["click", "contextmenu", "hover"].includes(value),
    },
    /**
     * Position of the popover when not tracking the mouse
     * Possible values: 'top', 'bottom', 'left', 'right'
     */
    position: {
      type: String,
      default: "bottom",
      validator: (value) =>
        ["top", "bottom", "left", "right"].includes(value),
    },
    /**
     * Use v-model to control the popover visibility
     */
    value: {
      type: Boolean,
      default: false,
    },
    triggerElement: {
      type: HTMLElement,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
      mouseInside: false,
      popoverCoords: { top: 0, left: 0 },
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal !== this.isOpen) {
          this.toggle(newVal)
        }
      },
      immediate: true,
    },
    isOpen(isOpen) {
      console.log(`[Popover.vue _uid:${this._uid}] isOpen watcher fired. New state:`, isOpen);
      if (isOpen) {
        popupManager.register({
          id: this._uid,
          controller: this,
          component: PopoverRenderer,
          props: {
            ...this.$props,
            popoverCoords: this.popoverCoords,
          },
          slots: {
            default: this.$scopedSlots.content
              ? this.$scopedSlots.content()
              : this.$slots.default || [],
          },
          triggerEl: this.triggerElement || this.$refs.trigger,
        });

        this.$nextTick(() => {
          this.updatePopoverPosition();
        });

        window.addEventListener("resize", this.updatePopoverPosition, { passive: true });
        window.addEventListener("scroll", this.updatePopoverPosition, true);
      } else {
        popupManager.unregister(this);
        window.removeEventListener("resize", this.updatePopoverPosition);
        window.removeEventListener("scroll", this.updatePopoverPosition, true);
      }
    },
    popoverCoords() {
      if (this.isOpen) {
        const popup = popupManager.stack.find(p => p.id === this._uid)
        if (popup) {
          popup.props.popoverCoords = this.popoverCoords
        }
      }
    },
  },
  computed: {
    triggerHandlers() {
      const handlers = {}
      if (this.trigger === "click") {
        handlers.click = this.handleClick
      } else if (this.trigger === "contextmenu") {
        handlers.contextmenu = this.handleContextmenu
      } else if (this.trigger === "hover") {
        handlers.mouseenter = this.handleMouseenter
        handlers.mouseleave = this.handleMouseleave
      }
      return handlers
    },
    popoverStyle() {
      return {
        position: "fixed",
        left: `${this.popoverCoords.left}px`,
        top: `${this.popoverCoords.top}px`,
      }
    },
  },
  methods: {
    toggle(newState) {
      if (this.isOpen === newState) return;
      this.isOpen = newState;
      this.$emit("input", this.isOpen);
      this.mouseInside = false;
      this.handleMouseleave(); // Re-check if we should close
    },
    handleClick(event) {
      event.preventDefault()
      this.toggle(!this.isOpen)
    },
    handleContextmenu(event) {
      event.preventDefault()
      this.toggle(!this.isOpen)
    },
    handleMouseenter() {
      if (this.trigger === 'hover') this.toggle(true)
    },
    handleMouseleave() {
      if (this.trigger === 'hover') {
        setTimeout(() => {
          if (!this.mouseInside) this.toggle(false)
        }, 150)
      }
    },
    onPopoverMouseEnter() {
      this.mouseInside = true
    },
    onPopoverMouseLeave() {
      this.mouseInside = false
      this.handleMouseleave()
    },
    closeOnClickOutside() {
      this.toggle(false);
    },
    closeOnEscape() {
      this.toggle(false)
    },
    updatePopoverPosition() {
      if (!this.isOpen) return;
      const trigger = this.$refs.trigger;
      if (!trigger) return;

      const popup = popupManager.stack.find(p => p.id === this._uid);
      let popoverRect = { width: 0, height: 0 };

      if (popup && popup.rendererInstance && popup.rendererInstance.$refs.content) {
        popoverRect = popup.rendererInstance.$refs.content.getBoundingClientRect();
      }

      const rect = trigger.getBoundingClientRect();
      const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
      let top = 0, left = 0;

      switch (this.position) {
        case "top":
          top = rect.top - popoverRect.height;
          left = rect.left + rect.width / 2 - popoverRect.width / 2;
          break;
        case "bottom":
          top = rect.bottom;
          left = rect.left + rect.width / 2 - popoverRect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - popoverRect.height / 2;
          left = rect.left - popoverRect.width;
          break;
        case "right":
          top = rect.top + rect.height / 2 - popoverRect.height / 2;
          left = rect.right;
          break;
      }

      const margin = 8;
      left = Math.max(margin, Math.min(left, viewportWidth - popoverRect.width - margin));
      top = Math.max(margin, Math.min(top, viewportHeight - popoverRect.height - margin));

      const newCoords = { top: Math.round(top), left: Math.round(left) };
      if (this.popoverCoords.top !== newCoords.top || this.popoverCoords.left !== newCoords.left) {
        this.popoverCoords = newCoords;
      }
    },
  },
  beforeDestroy() {
    this.toggle(false)
  },
}
</script>

<style lang="scss">
.popover-trigger {
  display: inline-block;
}

.popover-wrapper {
  position: absolute; /* Will be positioned by 'top' and 'left' from style */
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

.popover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(0.5px);
}
</style>
