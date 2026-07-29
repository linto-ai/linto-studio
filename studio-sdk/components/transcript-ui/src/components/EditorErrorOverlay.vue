<script setup lang="ts">
import EditorIcon from "./atoms/EditorIcon.vue"
import { useI18n } from "../i18n"

defineProps<{
  /** Technical reason (server message), shown as a muted detail line. */
  message?: string | null
}>()

const { t } = useI18n()
</script>

<template>
  <div class="editor-error" role="alert">
    <EditorIcon name="warning" :size="40" class="editor-error__icon" />
    <p class="editor-error__title">{{ t("editor.loadError") }}</p>
    <p v-if="message" class="editor-error__detail">{{ message }}</p>
  </div>
</template>

<style scoped>
.editor-error {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  text-align: center;
  /* Opaque so the half-built layout never shows behind. No backdrop-filter:
     it is banned in this package (WebRender GTT freeze). */
  background-color: var(--color-background);
  font-family: var(--font-family);
}

.editor-error__icon {
  color: var(--color-danger);
}

.editor-error__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.editor-error__detail {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
