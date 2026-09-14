<template>
  <div>
    <slot
      name="trigger"
      :open="openModal"
      :close="close"
      :is-open="isModalOpen"></slot>
  </div>
</template>

<script>
import popupManager from "@/tools/popupManager"
import BareModalRenderer from "./BareModalRenderer.vue"

export default {
  name: "BareModal",
  props: {
    // No visible title, so this is the dialog's only accessible name.
    ariaLabel: { type: String, required: true },
    customModalClass: { type: String, default: "" },
    size: { type: String, default: "md" },
    value: { type: Boolean, default: undefined },
    overlay: { type: Boolean, default: true },
    overlayClose: { type: Boolean, default: false },
    cancelOnEscape: { type: Boolean, default: false },
  },
  data() {
    return {
      internalOpen: false,
      triggerEl: null,
    }
  },
  computed: {
    isModalOpen: {
      get() {
        return typeof this.value === "undefined"
          ? this.internalOpen
          : this.value
      },
      set(value) {
        if (typeof this.value === "undefined") {
          this.internalOpen = value
        } else {
          this.$emit("input", value)
        }
      },
    },
  },
  watch: {
    isModalOpen: {
      handler(isOpen) {
        if (isOpen) {
          popupManager.register({
            id: this._uid,
            controller: this,
            component: BareModalRenderer,
            props: this.$props,
            slots: {
              default: () =>
                this.$scopedSlots.content
                  ? this.$scopedSlots.content()
                  : this.$slots.content || this.$slots.default || [],
            },
            triggerEl: this.triggerEl,
          })
        } else {
          popupManager.unregister(this)
        }
      },
      immediate: true,
    },
  },
  updated() {
    if (this.isModalOpen) {
      const popup = popupManager.stack.find((p) => p.id === this._uid)
      if (popup && popup.rendererInstance) {
        popup.slots = {
          default: () =>
            this.$scopedSlots.content
              ? this.$scopedSlots.content()
              : this.$slots.content || this.$slots.default || [],
        }
        popup.rendererInstance.$forceUpdate()
      }
    }
  },
  methods: {
    openModal(e) {
      if (this.isModalOpen) return
      e?.preventDefault()
      this.triggerEl = e.currentTarget
      this.isModalOpen = true
    },
    close(e) {
      if (!this.isModalOpen) return
      this.$emit("on-close", e)
      this.$emit("close", e)
      e?.preventDefault()
      this.isModalOpen = false
    },
  },
  beforeDestroy() {
    if (this.isModalOpen) {
      popupManager.unregister(this)
    }
  },
}
</script>

<style lang="scss" scoped>
/* The controller is a simple inline-block wrapper */
div {
  display: inline-block;
}
</style>
