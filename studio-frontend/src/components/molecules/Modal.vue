<template>
  <div class="modal-wrapper" :class="{ open: value }">
    <div
      class="modal-overlay"
      v-if="overlay"
      @click="overlayClose ? close() : null"></div>
    <component
      aria-modal="true"
      aria-labelledby="modal-title"
      class="modal flex col"
      :is="modalComponentType"
      :class="{ [`${size}`]: true, [customModalClass]: true }"
      @submit.prevent="isForm ? apply() : null">
      <div class="modal-header flex row align-center justify-between">
        <div class="flex col">
          <span class="title flex1" id="modal-title">{{ title }}</span>
          <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
        </div>
        <template v-if="withClose">
          <button
            class="btn outline only-icon sm"
            @click="close()"
            type="button">
            <ph-icon name="x" size="sm"></ph-icon>
          </button>
        </template>
      </div>
      <div class="modal-body flex col flex1">
        <slot></slot>
      </div>
      <div class="modal-footer flex row gap-small" v-if="withActions">
        <template v-if="withActionDelete">
          <button class="btn tertiary" @click="deleteHandler()" type="button">
            <span class="label">{{
              textActionDelete || $t("modal.delete")
            }}</span>
          </button>
        </template>
        <div class="flex1"></div>
        <div class="button-group">
          <template v-if="withActionCancel">
            <button
              class="btn secondary outline"
              @click="close()"
              type="button">
              <span class="label">{{
                textActionCancel || $t("modal.cancel")
              }}</span>
            </button>
          </template>
          <template v-if="withActionApply">
            <button
              class="btn primary"
              :class="customClass"
              @click="apply"
              type="submit">
              <ph-icon name="check"></ph-icon>
              <span class="label">{{
                textActionApply || $t("modal.apply")
              }}</span>
            </button>
          </template>
        </div>
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
    withActions: { type: Boolean, default: true },
    withActionDelete: { type: Boolean, default: false },
    withActionCancel: { type: Boolean, default: true },
    withActionApply: { type: Boolean, default: true },
    withClose: { type: Boolean, default: true },
    customModalClass: { type: String, default: "" },
    isForm: { type: Boolean, default: false },
    size: { type: String, default: "md" },
    value: { type: Boolean, default: false },
    overlay: { type: Boolean, default: true },
    overlayClose: { type: Boolean, default: true },
    textActionApply: { type: String, default: "Apply" },
    textActionCancel: { type: String, default: "Cancel" },
    textActionDelete: { type: String, default: "Delete" },
  },
  data() {
    return {
      isClickOutsideEnabled: false,
    }
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
        primary: true,
      }
    },
    modalComponentType() {
      return this.isForm ? "form" : "div"
    },
  },
  methods: {
    close(e) {
      this.$emit("on-cancel", e)
      this.$emit("input", false)
      e?.preventDefault()
    },
    apply(e) {
      this.$emit("on-confirm", e)
      this.$emit("input", false)
      e?.preventDefault()
    },
    deleteHandler(e) {
      this.$emit("on-delete", e)
      this.$emit("input", false)
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
  display: flex;
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
  padding: 1rem;
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
  padding: 1em;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  justify-content: flex-end;
  padding: 1em;

  .modal--footer-btn-splitted {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
