<template>
  <div class="modal-wrapper flex col" :class="{ open: value }">
    <div class="modal-overlay"></div>
    <component
      aria-modal="true"
      aria-labelledby="modal-title"
      class="modal flex col"
      :is="modalComponentType"
      :class="{ [`${size}`]: true, [customModalClass]: true }"
      v-click-outside="close">
      <div class="modal-header flex row align-center justify-between">
        <div class="flex col">
          <span class="title flex1" id="modal-title">{{ title }}</span>
          <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
        </div>
        <button class="btn outline only-icon sm" @click="close()" type="button">
          <ph-icon name="x" size="sm"></ph-icon>
        </button>
      </div>
      <div class="modal-body flex col flex1">
        <slot></slot>
      </div>
      <div class="modal-footer flex row gap-small" v-if="noAction === false">
        <button
          class="btn tertiary"
          @click="deleteHandler()"
          v-if="deleteButton"
          type="button">
          <span class="label">{{ $t("modal.delete") }}</span>
        </button>
        <div class="flex1"></div>
        <button
          class="btn secondary outline"
          @click="close()"
          v-if="cancelButton"
          type="button">
          <span class="label">{{ $t("modal.cancel") }}</span>
        </button>
        <button
          class="btn primary"
          :class="customClass"
          @click="apply"
          v-if="!noApply"
          type="submit">
          <ph-icon name="check"></ph-icon>
          <span class="label">{{ actionBtnLabel || $t("modal.apply") }}</span>
        </button>
      </div>
    </component>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    actionBtnLabel: { type: String, required: true },
    cancelButton: { type: Boolean, default: true },
    deleteButton: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    fullHeight: { type: Boolean, default: false },
    customClassButton: { type: Object, default: () => ({}) },
    noApply: { type: Boolean, default: false },
    customModalClass: { type: String, default: "" },
    isForm: { type: Boolean, default: false },
    noAction: { type: Boolean, default: false },
    size: { type: String, default: "md" },
  },
  mounted() {
    document.addEventListener("keydown", this.attachEvents)
  },
  unmounted() {
    document.removeEventListener("keydown", this.attachEvents)
  },
  computed: {
    customClass() {
      if (
        this.customClassButton &&
        Object.keys(this.customClassButton).length > 0
      ) {
        return this.customClassButton
      }
      return {
        green: true,
      }
    },
    modalComponentType() {
      return this.isForm ? "form" : "div"
    },
  },
  methods: {
    attachEvents(e) {
      if (e.key === "Escape") {
        this.close()
      }
      if (e.key === "Enter") {
        this.apply()
      }
    },
    close(e) {
      this.$emit("on-cancel")
      e?.preventDefault()
    },
    apply(e) {
      this.$emit("on-confirm")
      e?.preventDefault()
    },
    deleteHandler(e) {
      this.$emit("on-delete")
      e?.preventDefault()
    },
  },
}
</script>

<style lang="scss">
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
  align-items: center;
  justify-content: center;
  display: none;
}

.modal-wrapper.open {
  display: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
}

.modal {
  background: var(--background-secondary);
  max-height: calc(100% - 4rem);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 991;
  border: 1px solid var(--primary-soft);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  &.fullscreen {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
  }

  &.lg {
    width: 940px;
    max-width: calc(100% - 4rem);
  }

  &.md {
    width: 640px;
    max-width: calc(100% - 4rem);
  }

  &.sm {
    width: 480px;
    max-width: calc(100% - 4rem);
  }
}

.modal-header {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  background: var(--background-secondary);
  z-index: 1;

  .title {
    display: inline-block;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    //white-space: nowrap;
    text-overflow: ellipsis;
  }

  .subtitle {
    display: inline-block;
    font-weight: 400;
    font-size: 0.8rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.modal-body {
  border-top: 1px solid var(--neutral-20);
  background: var(--primary-soft);
  padding: 0.5rem;
  overflow-y: auto;
  flex: 1;

  p {
    font-size: 1rem;
    line-height: 1.5rem;
    margin: 0.5rem 0;

    strong {
      font-size: 1rem;
      font-weight: 600;
      color: var(--red-chart);
      line-height: 1.5rem;
    }
  }
}

.modal-footer {
  justify-content: flex-end;
  padding: 0.5rem;

  .modal--footer-btn-splitted {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
