<template>
  <div>
    <div
      v-if="isOverlayVisible"
      class="popup-host-overlay"
      :style="{ zIndex: overlayZIndex }"></div>
    <component
      v-for="popup in stack"
      :key="popup.id"
      :is="popup.component"
      v-bind="{ ...popup.props, slots: popup.slots, scopedSlots: popup.slots }"
      :controller="popup.controller"
      :z-index="popup.zIndex"
      :ref="setRef(popup.id)"></component>
  </div>
</template>

<script>
import popupManager from "@/tools/popupManager"

export default {
  name: "PopupHost",
  data() {
    return {
      stack: popupManager.stack,
    }
  },
  computed: {
    isOverlayVisible() {
      // An overlay is visible if any modal in the stack requires it.
      return this.stack.some((instance) => instance.props.overlay)
    },
    overlayZIndex() {
      const overlayInstances = this.stack.filter(
        (instance) => instance.props && instance.props.overlay,
      )

      if (!overlayInstances.length) {
        return 0
      }

      const topOverlayInstance = overlayInstances[overlayInstances.length - 1]

      return topOverlayInstance.zIndex - 1
    },
  },
  created() {
    document.addEventListener("click", this.handleGlobalClick, true)
    document.addEventListener("keydown", this.handleGlobalKeydown, true)
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleGlobalClick, true)
    document.removeEventListener("keydown", this.handleGlobalKeydown, true)
  },
  methods: {
    handleGlobalClick(event) {
      popupManager.handleGlobalClick(event)
    },
    handleGlobalKeydown(event) {
      popupManager.handleGlobalKeydown(event)
    },
    // This is a bit of a hack to get the instance of the dynamically rendered component
    // and pass it to the popupManager.
    setRef(id) {
      return (el) => {
        if (el) {
          popupManager.setRendererInstance(id, el)
        }
      }
    },
  },
}
</script>

<style lang="scss">
.popup-host-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(1px);

  @media (max-width: 1100px) {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
