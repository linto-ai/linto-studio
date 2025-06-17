<template>
  <Modal
    :title="title"
    :subtitle="subtitle"
    :withActions="showActions"
    :withActionApply="showConfirm"
    :withActionCancel="showCancel"
    :textActionApply="confirmText"
    :textActionCancel="cancelText"
    :withClose="closable"
    :value="internalVisible"
    :size="size"
    :customModalClass="`alert-modal alert-${type}`"
    iconActionApply="trash"
    iconActionCancel="x-circle"
    colorActionApply="tertiary"
    colorActionCancel="primary"
    @input="internalVisible = $event"
    @confirm="onConfirm"
    @close="onCancel"
    @cancel="onCancel"
  >
    <template #trigger="{ open }">
      <span @click="(event) => handleTriggerClick(event, open)" class="alert-trigger">
        <slot></slot>
      </span>
    </template>
    <template #content>
      <div class="alert-content">
        <slot name="content">
          <div class="alert-message">{{ message }}</div>
        </slot>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/molecules/Modal.vue'

export default {
  name: 'Alert',
  components: { Modal },
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    message: { type: String, default: '' },
    type: { type: String, default: 'info' }, // info, warning, danger, success
    confirmText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Annuler' },
    showConfirm: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    showActions: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    size: { type: String, default: 'sm' },
    triggerMode: { type: String, default: 'auto' }, // 'auto' for trigger slot, 'controlled' for visible prop
  },
  data() {
    return {
      internalVisible: this.visible,
    }
  },
  watch: {
    visible(newVal) {
      this.internalVisible = newVal;
    },
    internalVisible(newVal) {
      if (newVal !== this.visible) {
        this.$emit('update:visible', newVal);
      }
    }
  },
  methods: {
    onConfirm(e) {
      this.$emit('confirm', e)
      this.internalVisible = false
    },
    onCancel(e) {
      this.$emit('cancel', e)
      this.internalVisible = false
    },
    handleTriggerClick(event, open) {
      event.stopPropagation();
      open(event);
    },
  },
}
</script>

<style lang="scss" scoped>
.alert-modal {
  .modal {
    border-left: 6px solid var(--primary-color);
  }
  &.alert-info .modal {
    border-color: var(--primary-color);
  }
  &.alert-warning .modal {
    border-color: var(--warning-color, #ffb300);
  }
  &.alert-danger .modal {
    border-color: var(--danger-color, #e53935);
  }
  &.alert-success .modal {
    border-color: var(--success-color, #43a047);
  }
}
.alert-content {
  display: flex;
  align-items: center;
  min-height: 48px;
  font-size: 1.05em;
  color: var(--text-primary);
  padding: 0.5em 0;
}
.alert-message {
  flex: 1;
}

.alert-trigger {
  display: inline-block;
  cursor: pointer;
}
</style> 