<script setup lang="ts">
import { X } from "lucide-vue-next"
import EditorButton from "./atoms/EditorButton.vue"
import CopyButton from "./atoms/CopyButton.vue"
import { useTurnSelection } from "../composables/useTurnSelection"
import { useI18n } from "../i18n"

const selection = useTurnSelection()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="selection.hasSelection.value"
    class="selection-bar"
    role="toolbar"
    :aria-label="t('selection.count')">
    <span class="selection-count">
      {{ selection.count.value }} {{ t("selection.count") }}
    </span>
    <div class="selection-actions">
      <CopyButton icon="copy" :copy-fn="selection.copyText">
        {{ t("selection.copyText") }}
      </CopyButton>
      <CopyButton icon="clipboard-list" :copy-fn="selection.copyWithMetadata">
        {{ t("selection.copyWithMetadata") }}
      </CopyButton>
      <EditorButton size="sm" variant="ghost" @click="selection.clear()">
        <template #icon><X :size="14" /></template>
        {{ t("selection.cancel") }}
      </EditorButton>
    </div>
  </div>
</template>

<style scoped>
.selection-bar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-lg);
  background: var(--glass-background);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--color-border);
  animation: bar-slide-down var(--transition-duration) ease;
}

.selection-count {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.selection-actions {
  display: flex;
  gap: var(--spacing-xs);
}

@keyframes bar-slide-down {
  from {
    opacity: 0;
    translate: 0 -4px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .selection-bar {
    animation: none;
  }
}

@media (max-width: 767px) {
  .selection-bar {
    padding: var(--spacing-xs) var(--spacing-md);
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
}
</style>
