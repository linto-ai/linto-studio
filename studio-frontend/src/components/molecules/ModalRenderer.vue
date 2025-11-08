<template>
  <div class="modal-wrapper" :style="{ zIndex: zIndex }">
    <component
      aria-modal="true"
      aria-labelledby="modal-title"
      class="modal flex col"
      :is="modalComponentType"
      :class="{ [`${size}`]: true, [customModalClass]: true, loading }"
      :style="{ zIndex: zIndex + 1 }"
      @submit.prevent="isForm ? apply() : null"
      ref="modalContent"
      @click.stop>
      <div class="modal-header flex row align-center justify-between">
        <div class="flex col">
          <span class="title flex1" id="modal-title">{{ title }}</span>
          <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
        </div>
        <template v-if="withClose">
          <Button icon="x" size="sm" @click="cancel" type="button" />
        </template>
      </div>
      <div v-if="loading" class="modal-loading">
        <ph-icon
          name="spinner"
          size="lg"
          animation="spin"
          color="primary"></ph-icon>
      </div>
      <div class="modal-body flex col flex1">
        <v-node-renderer
          v-if="renderedDefaultSlots.length"
          :nodes="renderedDefaultSlots" />
      </div>
      <div
        class="modal-footer flex row gap-small"
        v-if="withActions || actionsNodes.length">
        <template>
          <v-node-renderer
            v-if="actionsLeftNodes.length"
            :nodes="actionsLeftNodes" />
          <Button
            v-if="withActionDelete && withActionApply"
            variant="primary"
            intent="destructive"
            :disabled="disabledActionDelete || disabledActions"
            :icon="iconActionDelete"
            @click="deleteHandler"
            type="button">
            {{ textActionDelete || $t("modal.delete") }}
          </Button>
        </template>
        <div class="flex1"></div>
        <div class="flex gap-small">
          <v-node-renderer
            v-if="actionsRightNodes.length"
            :nodes="actionsRightNodes" />
          <template v-if="withActionCancel">
            <Button
              variant="tertiary"
              :disabled="disabledActionCancel || disabledActions"
              :icon="iconActionCancel"
              @click="cancel"
              type="button">
              {{ textActionCancel || $t("modal.cancel") }}
            </Button>
          </template>
          <template v-if="withActionApply">
            <Button
              variant="primary"
              :disabled="disabledActionApply || disabledActions"
              :icon="iconActionApply"
              @click="apply"
              type="submit">
              {{ textActionApply || $t("modal.apply") }}
            </Button>
          </template>
          <template v-else-if="withActionDelete">
            <Button
              variant="primary"
              intent="destructive"
              :disabled="disabledActionDelete || disabledActions"
              :icon="iconActionDelete"
              @click="deleteHandler"
              type="button">
              {{ textActionDelete || $t("modal.delete") }}
            </Button>
          </template>
        </div>
      </div>
      <template v-if="actionsNodes.length">
        <div class="modal-footer">
          <v-node-renderer :nodes="actionsNodes" />
        </div>
      </template>
    </component>
  </div>
</template>

<script>
import VNodeRenderer from "@/components/atoms/VNodeRenderer.vue"
import i18n from "../../i18n"
export default {
  name: "ModalRenderer",
  components: { VNodeRenderer },
  props: {
    // Controller instance
    controller: { type: Object, required: true },
    // VNodes for slots
    slots: { type: Object, required: true },
    // Style
    zIndex: { type: Number, default: 0 },
    // All the original props from Modal.vue
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
    overlay: { type: Boolean, default: true },
    overlayClose: { type: Boolean, default: true },
    textActionApply: { type: String, default: i18n.t("modal.apply") },
    textActionCancel: { type: String, default: i18n.t("modal.cancel") },
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
    iconActionApply: { type: String, default: "check" },
    iconActionCancel: { type: String, default: "x-circle" },
    iconActionDelete: { type: String, default: "trash" },
    colorActionApply: { type: String, default: "primary" },
    colorActionCancel: { type: String, default: "var(--neutral-40)" },
    colorActionDelete: { type: String, default: "var(--danger-color)" },
  },
  computed: {
    defaultNodes() {
      return this.slots && this.slots.default ? this.slots.default() : []
    },
    actionsNodes() {
      return this.slots && this.slots.actions ? this.slots.actions() : []
    },
    actionsLeftNodes() {
      return this.slots && this.slots["actions-left"]
        ? this.slots["actions-left"]()
        : []
    },
    actionsRightNodes() {
      return this.slots && this.slots["actions-right"]
        ? this.slots["actions-right"]()
        : []
    },
    modalComponentType() {
      return this.isForm ? "form" : "div"
    },
    renderedDefaultSlots() {
      // Note: Vue 3 has better reactivity tracking, so explicit $parent access is not needed
      // The controller's reactive properties are automatically tracked
      return typeof this.slots.default === "function"
        ? this.slots.default()
        : this.slots.default || []
    },
  },
  methods: {
    // Delegate events to the controller
    close(e) {
      this.controller.close(e)
    },
    apply(e) {
      this.controller.apply(e)
    },
    deleteHandler(e) {
      this.controller.deleteHandler(e)
    },
    cancel(e) {
      this.controller.cancel(e)
    },
    closeOnClickOutside() {
      if (this.overlayClose) {
        this.controller.cancel()
      }
    },
    closeOnEscape() {
      if (this.withClose) {
        this.controller.cancel()
      }
    },
  },
}
</script>

// We keep the styles from Modal.vue, but they might need adjustments. // For
now, let's copy them over.
<style lang="scss" scoped>
.modal-wrapper {
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

.modal {
  pointer-events: all;
  background: var(--background-secondary);
  max-height: calc(100% - 4rem);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
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

    @media (max-width: 1100px) {
      .modal-body {
        padding: 1em 0.5em;
        overflow-y: auto;
      }
    }
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
