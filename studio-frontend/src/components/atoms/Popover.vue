<template>
  <div>
    <div class="popover-wrapper" ref="wrapper">
      <!-- Trigger slot: the element that will open the popover -->
      <div
        class="popover-trigger"
        ref="trigger"
        @click="handleTrigger('click', $event)"
        @contextmenu.prevent="handleTrigger('contextmenu', $event)"
        @mouseenter="handleTrigger('mouseenter', $event)"
        @mouseleave="handleTrigger('mouseleave', $event)"
      >
        <slot name="trigger"></slot>
      </div>
    </div>
    <portal to="body">
      <div
        v-if="isOpen"
        class="popover-content"
        :class="position"
        ref="content"
        :style="popoverStyle"
      >
        <slot name="content"></slot>
      </div>
      <div v-if="isOpen && overlay" class="popover-overlay" ref="overlay"></div>
    </portal>
  </div>
</template>

<script>
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
     * If true, the popover follows the mouse position
     */
    trackMouse: {
      type: Boolean,
      default: false,
    },
    /**
     * Position of the popover when not tracking the mouse
     * Possible values: 'top', 'bottom', 'left', 'right'
     */
    position: {
      type: String,
      default: "top",
      validator: (value) => ["top", "bottom", "left", "right"].includes(value),
    },
  },
  data() {
    return {
      isOpen: false, // Controls popover visibility
      mouseInside: false, // For hover logic
      popoverCoords: { top: 0, left: 0 }, // Coordinates for fixed position
      popoverWidth: null, // Optionally set width
    };
  },
  computed: {
    popoverStyle() {
      if (!this.isOpen) return {}
      const style = {
        position: 'fixed',
        zIndex: 3000,
        minWidth: this.popoverWidth ? this.popoverWidth + 'px' : undefined,
        left: this.popoverCoords.left + 'px',
        top: this.popoverCoords.top + 'px',
      }
      return style
    },
  },
  methods: {
    handleTrigger(type, event) {
      event.stopPropagation()
      if (this.trigger === "click" && type === "click") {
        console.log("click")
        this.togglePopover(event)
      } else if (this.trigger === "contextmenu" && type === "contextmenu") {
        console.log("contextmenu")
        this.togglePopover(event)
      } else if (this.trigger === "hover") {
        if (type === "mouseenter") {
          this.openPopover(event)
        } else if (type === "mouseleave") {
          // Delay to allow moving to popover content
          setTimeout(() => {
            if (!this.mouseInside) this.closePopover()
          }, 150)
        }
      }
    },
    openPopover(event) {
      this.isOpen = true
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.updatePopoverPosition(event)
        })
      })
      document.addEventListener("mousedown", this.handleClickOutside)
      document.addEventListener("keydown", this.handleKeydown)
      window.addEventListener("resize", this.updatePopoverPosition)
      window.addEventListener("scroll", this.updatePopoverPosition, true)
    },
    closePopover() {
      console.log("closePopover")
      this.isOpen = false
      document.removeEventListener("mousedown", this.handleClickOutside)
      document.removeEventListener("keydown", this.handleKeydown)
      window.removeEventListener("resize", this.updatePopoverPosition)
      window.removeEventListener("scroll", this.updatePopoverPosition, true)
    },
    togglePopover(event) {
      if (this.isOpen) {
        this.closePopover()
      } else {
        this.openPopover(event)
      }
    },
    handleClickOutside(event) {
      const wrapper = this.$refs.wrapper;
      const content = this.$refs.content;
      if (
        (wrapper && wrapper.contains(event.target)) ||
        (content && content.contains(event.target))
      ) {
        return; // Do nothing if the click is inside the popover or the trigger
      }
      this.closePopover();
    },
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closePopover()
      }
    },
    onPopoverMouseEnter() {
      this.mouseInside = true
    },
    onPopoverMouseLeave() {
      this.mouseInside = false
      if (this.trigger === "hover") {
        setTimeout(() => {
          if (!this.mouseInside) this.closePopover()
        }, 150)
      }
    },
    updatePopoverPosition(event) {
      // Get trigger element position
      const trigger = this.$refs.trigger
      const content = this.$refs.content
      if (!trigger || !content) return
      const rect = trigger.getBoundingClientRect()
      const popoverRect = content.getBoundingClientRect()
      let top = 0, left = 0
      // Calculate position based on prop
      switch (this.position) {
        case 'top':
          top = rect.top - popoverRect.height
          left = rect.left + rect.width / 2 - popoverRect.width / 2
          break
        case 'bottom':
          top = rect.bottom
          left = rect.left + rect.width / 2 - popoverRect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - popoverRect.height / 2
          left = rect.left - popoverRect.width
          break
        case 'right':
          top = rect.top + rect.height / 2 - popoverRect.height / 2
          left = rect.right
          break
        default:
          top = rect.bottom
          left = rect.left
      }
      // Prevent overflow (optional: clamp to viewport)
      top = Math.max(0, top)
      left = Math.max(0, left)
      this.popoverCoords = { top, left }
      // Optionally set minWidth to match trigger
      this.popoverWidth = rect.width
    },
  },
  mounted() {
    // For hover: track mouse over popover content
    if (this.trigger === "hover") {
      this.$nextTick(() => {
        const content = this.$refs.content
        if (content) {
          content.addEventListener("mouseenter", this.onPopoverMouseEnter)
          content.addEventListener("mouseleave", this.onPopoverMouseLeave)
        }
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.handleClickOutside)
    document.removeEventListener("keydown", this.handleKeydown)
    window.removeEventListener("resize", this.updatePopoverPosition)
    window.removeEventListener("scroll", this.updatePopoverPosition, true)
    if (this.trigger === "hover") {
      const content = this.$refs.content
      if (content) {
        content.removeEventListener("mouseenter", this.onPopoverMouseEnter)
        content.removeEventListener("mouseleave", this.onPopoverMouseLeave)
      }
    }
  },
}
</script>

<style lang="scss">
.popover-wrapper {
  display: inline-block;
  position: relative;
}
.popover-trigger {
  display: inline-block;
}
.popover-content {
  position: fixed;
  z-index: 3000;
  background: white;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  background-color: var(--neutral-10);
  border-radius: 6px;
  min-width: 120px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  border: 1px solid var(--primary-color);
}
.popover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 2999;
  backdrop-filter: blur(0.5px);
}
</style>
