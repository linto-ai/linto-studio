<script setup lang="ts">
import EditorIcon from "../atoms/EditorIcon.vue"
import Button from "../atoms/Button.vue"
import DownloadMenu, { type DownloadFormat } from "./DownloadMenu.vue"
import { resolveIcon } from "../atoms/icons"
import { useI18n } from "../../i18n"

export type DocumentArticleStatus = "done" | "processing" | "error"

const props = withDefaults(
  defineProps<{
    metaLabel: string
    metaIcon?: string
    metaProgress?: number
    status?: DocumentArticleStatus
    showRegenerate?: boolean
    formats: DownloadFormat[]
  }>(),
  {
    status: "done",
    showRegenerate: false,
  },
)

const emit = defineEmits<{
  regenerate: []
  export: [format: string]
}>()

const { t } = useI18n()
</script>

<template>
  <article class="document-article" :data-status="props.status">
    <div class="document-article__toolbar" role="toolbar">
      <span class="document-article__meta">
        <EditorIcon
          v-if="resolveIcon(props.metaIcon)"
          :name="props.metaIcon!"
          :size="16" />
        <span class="document-article__meta-label">{{ props.metaLabel }}</span>
        <progress
          v-if="props.metaProgress !== undefined"
          class="document-article__progress"
          :max="100"
          :value="props.metaProgress" />
      </span>
      <div class="document-article__actions">
        <Button
          v-if="props.showRegenerate"
          variant="tertiary"
          icon="refresh-cw"
          :loading="props.status === 'processing'"
          :disabled="props.status === 'processing'"
          @click="emit('regenerate')">
          {{ t("llmService.regenerate") }}
        </Button>
        <DownloadMenu
          :formats="props.formats"
          :disabled="props.status === 'processing'"
          @select="emit('export', $event)" />
      </div>
    </div>

    <div class="document-article__body">
      <div
        v-if="props.status === 'processing'"
        class="document-article__loading">
        <EditorIcon name="spinner" spin :size="20" />
      </div>
      <slot v-else />
    </div>
  </article>
</template>

<style scoped>
.document-article {
  width: 100%;
  max-width: 760px;
  margin: var(--spacing-lg) auto;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  /* min-height: 0;
  overflow: auto; */
}

.document-article__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background-color: var(--color-surface);
}

.document-article__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 0;
}

.document-article[data-status="processing"] .document-article__meta {
  color: var(--color-primary);
}

.document-article[data-status="error"] .document-article__meta {
  color: var(--color-danger, #d33);
}

.document-article__meta-label {
  text-box: cap alphabetic;
}

.document-article__progress {
  width: 80px;
  height: 4px;
  margin-left: var(--spacing-sm);
}

.document-article__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.document-article__body {
  padding: var(--spacing-lg) var(--spacing-xl);
  flex: 1;
  min-height: 0;
}

.document-article__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}

@media (max-width: 767px) {
  .document-article__body {
    padding: var(--spacing-md);
  }
}
</style>
