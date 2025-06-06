import Vue from "vue"

const popupManager = new Vue({
  data: {
    stack: [],
  },
  methods: {
    register(popup) {
      if (this.stack.some(p => p.id === popup.id)) return
      console.log('[popupManager] Registering popup:', popup.id, 'Component:', popup.component.name);
      this.stack.push(popup)
      console.log('[popupManager] New stack:', this.stack.map(p => ({id: p.id, name: p.component.name})));
      this.updateZIndexes()
    },

    unregister(controller) {
      const index = this.stack.findIndex(p => p.id === controller._uid)
      console.log('[popupManager] Unregistering popup:', controller._uid, 'at index:', index);
      if (index !== -1) {
        this.stack.splice(index, 1)
      }
      console.log('[popupManager] New stack:', this.stack.map(p => ({id: p.id, name: p.component.name})));
      this.updateZIndexes()
    },

    handleGlobalClick(event) {
      let topPopupObject = null

      for (let i = this.stack.length - 1; i >= 0; i--) {
        const popup = this.stack[i]

        // Check 1: Is click inside the rendered content?
        const renderer = popup.rendererInstance
        if (renderer && renderer.$el && renderer.$el.contains(event.target)) {
          topPopupObject = popup
          break
        }

        // Check 2: Is click on the popup's registered trigger?
        if (popup.triggerEl && popup.triggerEl.contains(event.target)) {
          topPopupObject = popup
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
        if (popup.rendererInstance && popup.rendererInstance.closeOnClickOutside) {
          popup.rendererInstance.closeOnClickOutside()
        }
      }
    },

    handleGlobalKeydown(event) {
      if (event.key !== "Escape") {
        return
      }

      const topPopup = this.stack[this.stack.length - 1]
      if (topPopup && topPopup.rendererInstance && topPopup.rendererInstance.closeOnEscape) {
        event.preventDefault()
        event.stopPropagation()
        topPopup.rendererInstance.closeOnEscape()
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
      const popup = this.stack.find(p => p.id === id);
      if (popup) {
        Vue.set(popup, 'rendererInstance', instance);
      }
    }
  },
})

export default popupManager 