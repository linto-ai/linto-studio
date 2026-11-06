<template>
  <div
    class="popover-trigger"
    :class="{ 'popover-trigger--full-width': fullWidth }"
    ref="trigger"
    v-on="triggerHandlers">
    <slot name="trigger" :open="isOpen"></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import popupManager from "@/tools/popupManager"
import PopoverRenderer from "./PopoverRenderer.vue"
import POPOVER_MARGIN from "@/const/popoverMargin.js"
import { computePopoverPlacement } from "@/tools/computePopoverPlacement.js"
import PopoverPlacementTracker from "@/lib/PopoverPlacementTracker.js"

// Space between the trigger and the popover.
const POPOVER_GAP = 4
// Room that is enough to stay on the preferred side and scroll the content,
// rather than moving to the other side of the trigger.
const POPOVER_COMFORTABLE_HEIGHT = 350

// The content scrolls inside its maximum height: its scroll height is the
// height it would take without it.
function measureNaturalSize(content) {
  return {
    width: content.getBoundingClientRect().width,
    height: content.scrollHeight,
  }
}

function isSamePlacement(placement, other) {
  return Object.keys(placement).every((key) => placement[key] === other[key])
}

export default {
  name: "Popover",
  props: {
    // The trigger doesn't open the popover anymore.
    disabled: {
      type: Boolean,
      default: false,
    },
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
      validator: (value) => ["top", "bottom", "left", "right"].includes(value),
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
    contentClass: {
      type: String,
      default: "",
    },
    /**
     * If true, clicking on the trigger will close the popover (useful for tooltips)
     */
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * width of the popover
     * "auto", width of the content
     * "ref", width of the trigger element
     * a number, width in pixels
     */
    width: {
      type: [String, Number],
      default: "auto",
    },
    /**
     * If true, the popover will take the full width of the trigger element.
     * Shorthand for width="ref".
     */
    fullWidth: {
      type: Boolean,
      default: false,
    },
    /**
     * Height in pixels never exceeded by the popover, even with more room:
     * its content scrolls. Without it, only the room left beside the trigger
     * limits the popover.
     */
    maxHeight: {
      type: Number,
      default: null,
    },
  },
  created() {
    // Not reactive: see trackPlacement.
    this.placementTracker = null
  },
  data() {
    return {
      isOpen: false,
      mouseInside: false,
      // Measured once the content is rendered, see computePopoverPlacement.
      placement: {
        side: null,
        top: 0,
        bottom: null,
        left: 0,
        maxHeight: null,
      },
      hoverTimeout: null,
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
      if (isOpen) {
        popupManager.register({
          id: this._uid,
          controller: this,
          component: PopoverRenderer,
          props: {
            ...this.$props,
            contentClass: [
              this.$props.contentClass,
              this.isMobile ? "popover-mobile-sheet" : "",
            ]
              .filter(Boolean)
              .join(" "),
            placement: this.placement,
            widthRef: this.triggerElement || this.$refs.trigger,
          },
          slots: {
            default: () =>
              this.$scopedSlots.content
                ? this.$scopedSlots.content()
                : this.$slots.default || [],
          },
          triggerEl: this.triggerElement || this.$refs.trigger,
        })

        this.$nextTick(() => {
          this.trackPlacement()
          // Focus the popover content for keyboard navigation
          this.focusContent()
        })
      } else {
        // The next opening chooses its side again.
        this.placement = { ...this.placement, side: null }
        this.stopTrackingPlacement()
        popupManager.unregister(this)
      }
    },
    placement() {
      if (this.isOpen) {
        const popup = popupManager.stack.find((p) => p.id === this._uid)
        if (popup) {
          popup.props.placement = this.placement
        }
      }
    },
    isMobile() {
      if (this.isOpen) {
        const popup = popupManager.stack.find((p) => p.id === this._uid)
        if (popup) {
          popup.props.contentClass = [
            this.$props.contentClass,
            this.isMobile ? "popover-mobile-sheet" : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
      }
    },
  },
  computed: {
    triggerHandlers() {
      const handlers = {}
      if (this.disabled) return handlers
      if (this.trigger === "click") {
        handlers.click = (event) => {
          event.stopPropagation()
          this.handleClick(event)
        }
      } else if (this.trigger === "contextmenu") {
        handlers.contextmenu = this.handleContextmenu
      } else if (this.trigger === "hover") {
        handlers.mouseenter = this.handleMouseenter
        handlers.mouseleave = this.handleMouseleave
        handlers.click = this.handleClickOnHover
      }
      return handlers
    },
    ...mapGetters("system", ["isMobile"]),
    style() {
      return {
        borderSize: this.borderSize,
        padding: this.padding,
      }
    },
  },
  methods: {
    toggle(newState) {
      if (this.isOpen === newState) return
      this.isOpen = newState
      this.$emit("input", this.isOpen)
    },
    close() {
      this.toggle(false)
    },
    open() {
      this.toggle(true)
    },
    handleClick(event) {
      //event.preventDefault()
      if (this.closeOnClick) {
        this.toggle(!this.isOpen)
      } else {
        this.toggle(true)
      }
    },
    handleContextmenu(event) {
      event.preventDefault()
      this.toggle(!this.isOpen)
    },
    handleMouseenter() {
      if (this.trigger === "hover") {
        // Clear any pending close timeout
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout)
          this.hoverTimeout = null
        }

        this.hoverTimeout = setTimeout(() => {
          if (!this.isOpen) {
            this.toggle(true)
          }
          this.hoverTimeout = null
        }, 50)
      }
    },
    handleMouseleave() {
      if (this.trigger === "hover") {
        // Clear any pending open timeout
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout)
          this.hoverTimeout = null
        }

        this.hoverTimeout = setTimeout(() => {
          if (!this.mouseInside) {
            this.toggle(false)
          }
          this.hoverTimeout = null
        }, 50)
      }
    },
    onContentEnter() {
      this.mouseInside = true
    },
    onContentLeave() {
      this.mouseInside = false
      this.handleMouseleave()
    },
    closeOnClickOutside() {
      this.toggle(false)
    },
    closeOnEscape() {
      this.toggle(false)
    },
    onContentKeydown(event) {
      this.$emit("keydown", event)
    },
    focusContent(attempts = 0) {
      const maxAttempts = 5
      const popup = popupManager.stack.find((p) => p.id === this._uid)
      if (popup && popup.rendererInstance && popup.rendererInstance.focus) {
        popup.rendererInstance.focus()
      } else if (attempts < maxAttempts) {
        // Renderer not ready yet, retry after a frame
        requestAnimationFrame(() => this.focusContent(attempts + 1))
      }
    },
    // Places the popover now, then again whenever something can move it.
    trackPlacement(attempts = 0) {
      if (!this.isOpen || this.placementTracker) return
      const content = this.findContent()
      if (!content) {
        // Renderer not ready yet, retry after a frame
        if (attempts < 5) {
          requestAnimationFrame(() => this.trackPlacement(attempts + 1))
        }
        return
      }

      this.updatePopoverPosition()
      this.placementTracker = new PopoverPlacementTracker(
        content,
        this.updatePopoverPosition,
      )
    },
    stopTrackingPlacement() {
      this.placementTracker?.destroy()
      this.placementTracker = null
    },
    findContent() {
      const popup = popupManager.stack.find((p) => p.id === this._uid)
      return popup?.rendererInstance?.$refs.content ?? null
    },
    updatePopoverPosition() {
      if (!this.isOpen) return

      const triggerElement = this.triggerElement || this.$refs.trigger
      if (!triggerElement) return

      const content = this.findContent()
      if (!content) return

      const placement = computePopoverPlacement({
        triggerRect: triggerElement.getBoundingClientRect(),
        contentSize: measureNaturalSize(content),
        // The viewport of fixed elements, without the scrollbars.
        viewport: {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        },
        // Once open, the popover keeps its side while it has room there:
        // it doesn't jump from one side to the other on scroll.
        side: this.placement.side ?? this.position,
        margin: POPOVER_MARGIN,
        gap: POPOVER_GAP,
        comfortableHeight: POPOVER_COMFORTABLE_HEIGHT,
        maxHeight: this.maxHeight,
      })

      if (!isSamePlacement(placement, this.placement)) {
        this.placement = placement
      }
    },
  },
  beforeDestroy() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }
    this.stopTrackingPlacement()
    popupManager.unregister(this)
    this.toggle(false)
  },
}
</script>

<style lang="scss">
.popover-trigger {
  display: flex;
  width: fit-content;
  // fit-content alone lets the trigger grow past a narrow container (a table
  // cell), taking the slotted control with it: max-width gives the child
  // something finite to resolve its own 100% against.
  max-width: 100%;
  min-width: 0;

  &--full-width {
    width: 100%;
  }
}

.popover-wrapper {
  position: absolute; /* Will be positioned by 'top' and 'left' from style */
}

.popover-content:has(> div) {
  background: var(--background-app);
  border: 1px solid var(--neutral-40);
  border-radius: 2px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  border-radius: 4px;
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

.popover-mobile-sheet {
  box-sizing: border-box;
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  top: auto !important;
  width: 100vw !important;
  max-width: 100vw !important;
  max-height: 80vh !important;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.45);
  overflow-y: auto;
}
</style>
