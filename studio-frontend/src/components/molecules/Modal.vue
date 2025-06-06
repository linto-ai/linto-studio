<template>
  <div>
    <template v-if="hasTrigger">
      <div>
        <slot name="trigger" :open="openModal">
          <template v-if="$scopedSlots.trigger">
            {{$scopedSlots.trigger({ open: openModal })}}
          </template>
        </slot>
      </div>
    </template>
    <div class="modal-wrapper" :class="{ open: isModalOpen }">
      <div
        class="modal-overlay"
        v-if="overlay"
        @click.stop="overlayClose ? close() : null"></div>
      <component
        aria-modal="true"
        aria-labelledby="modal-title"
        class="modal flex col"
        :is="modalComponentType"
        :class="{ [`${size}`]: true, [customModalClass]: true, loading }"
        @submit.prevent="isForm ? apply() : null"
        @click.stop>
        <div class="modal-header flex row align-center justify-between">
          <div class="flex col">
            <span class="title flex1" id="modal-title">{{ title }}</span>
            <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
          </div>
          <template v-if="withClose">
            <button
              class="btn outline only-icon sm"
              :class="[customClassClose, { disabled: disabledClose }]"
              @click="close()"
              type="button">
              <ph-icon name="x" size="sm"></ph-icon>
            </button>
          </template>
        </div>
        <div v-if="loading" class="modal-loading">
          <ph-icon name="spinner" size="lg" animation="spin" color="primary"></ph-icon>
        </div>
        <div class="modal-body flex col flex1">
          <slot name="content">
            <slot></slot>
          </slot>
        </div>
        <div class="modal-footer flex row gap-small" v-if="withActions">
          <template v-if="withActionDelete">
            <button
              class="btn tertiary"
              :class="[customClassActionDelete, { disabled: disabledActionDelete || disabledActions }]"
              :disabled="disabledActionDelete || disabledActions"
              @click="deleteHandler()"
              type="button">
              <span class="label">{{
                textActionDelete || $t("modal.delete")
              }}</span>
            </button>
          </template>
          <div class="flex1"></div>
          <div class="button-group">
            <template v-if="withActionCancel">
              <button
                class="btn neutral outline"
                :class="[customClassActionCancel, colorActionCancel, { disabled: disabledActionCancel || disabledActions }]"
                :disabled="disabledActionCancel || disabledActions"
                @click="close()"
                type="button">
                <ph-icon v-if="iconActionCancel" :name="iconActionCancel"></ph-icon>
                <span class="label">{{
                  textActionCancel || $t("modal.cancel")
                }}</span>
              </button>
            </template>
            <template v-if="withActionApply">
              <button
                class="btn"
                :class="[customClassActionApply, colorActionApply, { disabled: disabledActionApply || disabledActions }]"
                :disabled="disabledActionApply || disabledActions"
                @click="apply"
                type="submit">
                <ph-icon :name="iconActionApply"></ph-icon>
                <span class="label">{{
                  textActionApply || $t("modal.apply")
                }}</span>
              </button>
            </template>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script>
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
      isClickOutsideEnabled: false,
      internalOpen: false,
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
    isModalOpen: {
      get() {
        if (typeof this.value === 'undefined') {
          return this.internalOpen
        }
        return this.value
      },
      set(value) {
        if (typeof this.value === 'undefined') {
          this.internalOpen = value
        } else {
          this.$emit("input", value)
        }
      },
    },
    modalComponentType() {
      return this.isForm ? "form" : "div"
    },
    hasTrigger() {
      return !!(this.$scopedSlots && this.$scopedSlots.trigger)
    },
  },
  methods: {
    openModal(e) {
      this.isModalOpen = true
      e?.preventDefault()
    },
    close(e) {
      console.log("close", e)
      this.$emit("on-close", e)
      this.$emit("close", e);
      this.isModalOpen = false
      e?.preventDefault()
    },
    apply(e) {
      this.$emit("submit", e)
      this.$emit("on-confirm", e)
      this.$emit("confirm", e);
      this.close(e)
      e?.preventDefault()
    },
    deleteHandler(e) {
      this.$emit("on-delete", e)
      this.$emit("delete", e);
      this.close(e)
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

  &.loading {
    position: relative;

    .modal-header,
    .modal-body,
    .modal-footer {
      filter: blur(1px);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--background-secondary);
      opacity: 0.5;
      z-index: 10;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--background-secondary);
      opacity: 0.5;
      z-index: 11;
    }
  }

  .modal-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--background-secondary);
    border-radius: 4px;
    padding: 1rem;
    box-shadow: var(--shadow-block);
    border: 1px solid var(--primary-hard);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;
  }

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
