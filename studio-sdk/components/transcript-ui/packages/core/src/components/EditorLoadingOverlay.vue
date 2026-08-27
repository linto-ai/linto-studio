<script setup lang="ts">
import { useI18n } from "@linto-ai/transcript-ui-i18n"

const { t } = useI18n()
</script>

<template>
  <div class="editor-loading" role="status" aria-live="polite">
    <span class="editor-loading__spinner" aria-hidden="true" />
    <span class="editor-loading__label">{{ t("editor.loading") }}</span>
  </div>
</template>

<style scoped>
.editor-loading {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  /* Opaque so the half-built layout never flashes behind while collab syncs.
     No backdrop-filter: it is banned in this package (WebRender GTT freeze). */
  background-color: var(--color-background);
  color: var(--color-text-secondary);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
}

.editor-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: editor-loading-spin 0.8s linear infinite;
}

@keyframes editor-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .editor-loading__spinner {
    animation: none;
  }
}
</style>
