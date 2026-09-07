<template>
  <div class="bare-modal-wrapper" :style="{ zIndex: zIndex }">
    <div
      class="bare-modal"
      :class="[size, customModalClass]"
      :style="{ zIndex: zIndex + 1 }"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
      ref="modalContent"
      tabindex="-1"
      @click.stop>
      <v-node-renderer
        v-if="renderedDefaultSlots.length"
        :nodes="renderedDefaultSlots" />
    </div>
  </div>
</template>

<script>
import VNodeRenderer from "@/components/atoms/VNodeRenderer.vue"

export default {
  name: "BareModalRenderer",
  components: { VNodeRenderer },
  data() {
    return {
      previouslyFocused: null,
    }
  },
  props: {
    // Controller instance
    controller: { type: Object, required: true },
    // VNodes for slots
    slots: { type: Object, required: true },
    // Style
    zIndex: { type: Number, default: 0 },
    // All the original props from BareModal.vue
    ariaLabel: { type: String, required: true },
    customModalClass: { type: String, default: "" },
    size: { type: String, default: "md" },
    overlay: { type: Boolean, default: true },
    overlayClose: { type: Boolean, default: false },
    cancelOnEscape: { type: Boolean, default: false },
  },
  computed: {
    renderedDefaultSlots() {
      // Force reactivity by accessing the controller's reactive properties
      // This creates a dependency on the parent component's data
      if (this.controller && this.controller.$parent) {
        // Access all reactive data to establish dependencies
        this.controller.$parent.$data
        this.controller.$parent.$props
      }
      return typeof this.slots.default === "function"
        ? this.slots.default()
        : this.slots.default || []
    },
  },
  mounted() {
    // Store reference to previously focused element for restoration on close
    this.previouslyFocused = document.activeElement
    // Focus first focusable element after render
    this.$nextTick(() => {
      this.focusModal()
    })
    // Add keydown listener for focus trap
    document.addEventListener("keydown", this.handleKeyDown)
  },
  beforeDestroy() {
    // Remove keydown listener
    document.removeEventListener("keydown", this.handleKeyDown)
    // Restore focus to previously focused element
    if (
      this.previouslyFocused &&
      typeof this.previouslyFocused.focus === "function"
    ) {
      this.previouslyFocused.focus()
    }
  },
  methods: {
    getFocusableElements(root) {
      const selector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      const scope = root || this.$refs.modalContent
      if (!scope) return []
      return Array.from(scope.querySelectorAll(selector)).filter(
        (el) => el.offsetParent !== null,
      )
    },
    focusModal() {
      const modal = this.$refs.modalContent
      if (!modal) return
      // There is no chrome (no header/footer buttons) to skip, so the first
      // focusable descendant is always a safe landing spot.
      const firstField = this.getFocusableElements(modal)[0]
      if (firstField) {
        firstField.focus()
        return
      }
      // No focusable content: focus the dialog container itself (tabindex="-1").
      if (typeof modal.focus === "function") {
        modal.focus()
      }
    },
    handleKeyDown(event) {
      // Only handle Tab key for focus trap
      if (event.key !== "Tab") return

      const elements = this.getFocusableElements()
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (event.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    },
    // Delegate events to the controller
    close(e) {
      this.controller.close(e)
    },
    closeOnClickOutside() {
      if (this.overlayClose) {
        this.controller.close()
      }
    },
    closeOnEscape() {
      if (this.cancelOnEscape) {
        this.controller.close()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bare-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  pointer-events: none;
}

.bare-modal {
  pointer-events: all;
  background: var(--background-primary);
  max-height: calc(100% - 4rem);
  overflow-y: auto;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--primary-soft);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  &.fullscreen {
    width: 100%;
    max-width: calc(100% - 1rem);
    height: 100%;
    max-height: calc(100% - 1rem);
  }

  &.xl {
    width: 1280px;
    max-width: calc(100% - 4rem);
    @media (max-width: 1100px) {
      max-width: calc(100% - 1rem);
    }
  }

  &.lg {
    width: 940px;
    max-width: calc(100% - 4rem);

    @media (max-width: 1100px) {
      max-width: calc(100% - 1rem);
    }
  }

  &.md {
    width: 640px;
    max-width: calc(100% - 4rem);

    @media (max-width: 1100px) {
      max-width: calc(100% - 1rem);
    }
  }

  &.sm {
    width: 480px;
    max-width: calc(100% - 4rem);

    @media (max-width: 1100px) {
      max-width: calc(100% - 1rem);
    }
  }

  &.screen {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
  }
}
</style>
