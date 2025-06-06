<template>
  <div>
    <slot
      name="trigger"
      :open="openModal"
      :close="close"
      :is-open="isModalOpen"
    ></slot>
  </div>
</template>

<script>
import popupManager from "@/tools/popupManager";
import ModalRenderer from "./ModalRenderer.vue";

export default {
  name: "Modal",
  props: {
    loading: { type: Boolean, default: false },
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    withActions: { type: Boolean, default: true },
    withActionDelete: { type: Boolean, default: false },
    withActionCancel: { type: Boolean, default: true },
    withActionApply: { type: Boolean, default: true },
    withClose: { type: Boolean, default: true },
    customModalClass: { type: String, default: "" },
    isForm: { type: Boolean, default: false },
    size: { type: String, default: "md" },
    value: { type: Boolean, default: undefined },
    overlay: { type: Boolean, default: true },
    overlayClose: { type: Boolean, default: true },
    textActionApply: { type: String, default: "Apply" },
    textActionCancel: { type: String, default: "Cancel" },
    textActionDelete: { type: String, default: "Delete" },
    customClassClose: { type: String, default: "" },
    customClassActionApply: { type: String, default: "" },
    customClassActionCancel: { type: String, default: "" },
    customClassActionDelete: { type: String, default: "" },
    disabledActions: { type: Boolean, default: false },
    disabledActionDelete: { type: Boolean, default: false },
    disabledActionCancel: { type: Boolean, default: false },
    disabledActionApply: { type: Boolean, default: false },
    disabledClose: { type: Boolean, default: false },
    iconActionApply: { type: String, default: "ph-icon-check" },
    iconActionCancel: { type: String, default: "ph-icon-x" },
    iconActionDelete: { type: String, default: "ph-icon-trash" },
    colorActionApply: { type: String, default: "primary" },
    colorActionCancel: { type: String, default: "var(--neutral-40)" },
    colorActionDelete: { type: String, default: "var(--danger-color)" },
  },
  data() {
    return {
      internalOpen: false,
      triggerEl: null,
    };
  },
  computed: {
    isModalOpen: {
      get() {
        return typeof this.value === "undefined"
          ? this.internalOpen
          : this.value;
      },
      set(value) {
        if (typeof this.value === "undefined") {
          this.internalOpen = value;
        } else {
          this.$emit("input", value);
        }
      },
    },
    hasTrigger() {
      return !!(this.$scopedSlots && this.$scopedSlots.trigger);
    },
  },
  watch: {
    isModalOpen(isOpen) {
      if (isOpen) {
        popupManager.register({
          id: this._uid,
          controller: this,
          component: ModalRenderer,
          props: this.$props,
          slots: {
            default: this.$scopedSlots.content
              ? this.$scopedSlots.content()
              : this.$slots.content || this.$slots.default || [],
          },
          triggerEl: this.triggerEl,
        });
      } else {
        popupManager.unregister(this);
      }
    },
  },
  methods: {
    openModal(e) {
      if (this.isModalOpen) return;
      e?.preventDefault();
      this.triggerEl = e.currentTarget;
      this.isModalOpen = true;
    },
    close(e) {
      if (!this.isModalOpen) return;
      this.$emit("on-close", e);
      this.$emit("close", e);
      e?.preventDefault();
      this.isModalOpen = false;
    },
    apply(e) {
      this.$emit("submit", e);
      this.$emit("on-confirm", e);
      this.$emit("confirm", e);
      this.close(e);
      e?.preventDefault();
    },
    deleteHandler(e) {
      this.$emit("on-delete", e);
      this.$emit("delete", e);
      this.close(e);
      e?.preventDefault();
    },
  },
  beforeDestroy() {
    if (this.isModalOpen) {
      popupManager.unregister(this);
    }
  },
};
</script>

<style lang="scss" scoped>
/* The controller is a simple inline-block wrapper */
div {
  display: inline-block;
}
</style>
