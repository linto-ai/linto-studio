import Vue from "vue"

const popupManager = new Vue({
  data: {
    stack: [],
  },
  methods: {
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

      // Close popups that are on top of the clicked one
      const stackCopy = [...this.stack]
      for (let i = stackCopy.length - 1; i >= 0; i--) {
        const popup = stackCopy[i]
        if (popup === topPopupObject) {
          break
        }

        // For tooltips clicked on trigger, always close them
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
          continue
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
        Vue.set(popup, "rendererInstance", instance)
      }
    },
  },
})

export default popupManager
