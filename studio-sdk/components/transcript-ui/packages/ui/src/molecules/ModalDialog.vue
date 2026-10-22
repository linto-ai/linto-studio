<script setup lang="ts">
import { onMounted, useId, useTemplateRef } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import Button from "../atoms/Button.vue"

// Native modal <dialog>: header (title + close cross), scrollable body,
// optional actions. Opened on mount — the parent mounts it only while it
// should be shown, and unmounts it on "close".
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const titleId = useId()
const dialogRef = useTemplateRef<HTMLDialogElement>("dialog")

onMounted(() => {
  dialogRef.value?.showModal()
})
</script>

<template>
  <!-- Every way out (cross, actions submitting the form, Escape) ends in the
       native "close" event. Escape is stopped here so the editor's own Escape
       handlers (turn selection, chat drawer) do not also run; the native
       cancel still happens. -->
  <dialog
    ref="dialog"
    class="modal-dialog"
    :aria-labelledby="titleId"
    @keydown.esc.stop
    @close="emit('close')">
    <form method="dialog" class="modal-dialog-header">
      <h2 :id="titleId" class="modal-dialog-title">{{ title }}</h2>
      <Button
        type="submit"
        variant="transparent"
        icon="x"
        :aria-label="t('modalDialog.close')" />
    </form>
    <!-- Focusable so keyboard users can scroll a long content. -->
    <div
      class="modal-dialog-body"
      tabindex="0"
      role="region"
      :aria-labelledby="titleId">
      <slot />
    </div>
    <form v-if="$slots.actions" method="dialog" class="modal-dialog-actions">
      <slot name="actions" />
    </form>
  </dialog>
</template>

<style scoped>
.modal-dialog {
  margin: auto;
  max-width: 640px;
  width: 90vw;
  max-height: 85vh;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  box-shadow: 0 16px 48px color-mix(in srgb, var(--color-text-primary) 20%, transparent);
}

/* Only while open: a closed <dialog> must keep its native display: none. */
.modal-dialog[open] {
  display: flex;
  flex-direction: column;
  /*gap: var(--spacing-md);*/
}

.modal-dialog::backdrop {
  /* No backdrop-filter: a full-viewport backdrop blur is a large WebRender
     render target; the dim background alone is enough. */
  background-color: color-mix(in srgb, var(--color-text-primary) 35%, transparent);
}

.modal-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
}

.modal-dialog-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal-dialog-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--spacing-lg);
}

.modal-dialog-body:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.modal-dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  border-top: 1px solid var(--color-border);
}
</style>
