import { reactive } from "vue"

// Vue 3: Use reactive() instead of new Vue()
const popupManager = reactive({
  stack: [],

  register(popup) {
    if (this.stack.some((p) => p.id === popup.id)) return
    this.stack.push(popup)
    this.updateZIndexes()
  },

  unregister(controller) {
    const index = this.stack.findIndex((p) => p.id === controller._uid)
    if (index !== -1) {
      this.stack.splice(index, 1)
    }
    this.updateZIndexes()
  },

    handleGlobalClick(event) {
      let topPopupObject = null
      let clickedOnTooltipTrigger = false

      for (let i = this.stack.length - 1; i >= 0; i--) {
        const popup = this.stack[i]

        const renderer = popup.rendererInstance
        if (renderer && renderer.$el && renderer.$el.contains(event.target)) {
          topPopupObject = popup
          break
        }

        if (popup.triggerEl && popup.triggerEl.contains(event.target)) {
          // Special case for tooltips: if this is a tooltip (hover trigger with closeOnClick),
          // we want to close it even when clicking on the trigger
          if (popup.props.trigger === "hover" && popup.props.closeOnClick) {
            clickedOnTooltipTrigger = true
            // Don't set topPopupObject so it will be closed
          } else {
            topPopupObject = popup
          }
          break
        }
      }

      // If the click occurred outside any popup/trigger (topPopupObject is null),
      // we should only close the top-most popup instead of every popup in the stack.
      if (!topPopupObject) {
        const topOfStack = this.stack[this.stack.length - 1]
        if (
          topOfStack &&
          topOfStack.rendererInstance &&
          topOfStack.rendererInstance.closeOnClickOutside
        ) {
          topOfStack.rendererInstance.closeOnClickOutside()
        }
        return
      }

      // Otherwise, close popups that are above the clicked one.
      const stackCopy = [...this.stack]
      for (let i = stackCopy.length - 1; i >= 0; i--) {
        const popup = stackCopy[i]
        if (popup === topPopupObject) {
          break
        }

        // For tooltips clicked on the trigger, always close them.
        if (
          clickedOnTooltipTrigger &&
          popup.props.trigger === "hover" &&
          popup.props.closeOnClick
        ) {
          if (
            popup.rendererInstance &&
            popup.rendererInstance.closeOnClickOutside
          ) {
            popup.rendererInstance.closeOnClickOutside()
          }
          // Skip closing underlying popups that are not tooltips.
          // When we hit the first non-tooltip popup, stop processing.
          continue
        }

        // If the click was on a tooltip trigger, we only want to close
        // the tooltip(s) themselves. Once we encounter a popup that is not
        // a close-on-click tooltip, exit the loop to avoid closing parent modals.
        if (clickedOnTooltipTrigger) {
          break
        }

        if (
          popup.rendererInstance &&
          popup.rendererInstance.closeOnClickOutside
        ) {
          popup.rendererInstance.closeOnClickOutside()
        }
      }
    },

    handleGlobalKeydown(event) {
      if (event.key !== "Escape") {
        return
      }

      // Find the topmost popup first, giving priority to the most recent one
      let targetPopup = null

      // Take the topmost popup (most recently opened)
      if (this.stack.length > 0) {
        targetPopup = this.stack[this.stack.length - 1]
      }

      if (
        targetPopup &&
        targetPopup.rendererInstance &&
        targetPopup.rendererInstance.closeOnEscape
      ) {
        event.preventDefault()
        event.stopPropagation()
        targetPopup.rendererInstance.closeOnEscape()
      }
    },

    updateZIndexes() {
      const baseZIndex = 2000 // Base z-index for all popups
      this.stack.forEach((popup, i) => {
        // We increment by 10 to leave room for internal elements like overlays
        popup.zIndex = baseZIndex + i * 10
      })
    },

  setRendererInstance(id, instance) {
    const popup = this.stack.find((p) => p.id === id)
    if (popup) {
      popup["rendererInstance"] = instance
    }
  },
})

export default popupManager
