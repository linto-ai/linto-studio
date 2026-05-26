<script setup lang="ts">
import { computed } from "vue"
import EditorIcon from "../atoms/EditorIcon.vue"
import Button from "../atoms/Button.vue"
import { useI18n } from "../../i18n"

export type DocumentArticleStatus = "done" | "processing" | "error"

const props = withDefaults(
  defineProps<{
    status?: DocumentArticleStatus
    progress?: number
    errorMessage?: string
  }>(),
  { status: "done" },
)

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()

const errorText = computed(
  () => props.errorMessage || t("llmService.errorTemporary"),
)

const progressValue = computed(() => {
  const v = props.progress
  if (v == null || !Number.isFinite(v)) return null
  return Math.max(0, Math.min(100, Math.round(v)))
})
</script>

<template>
  <article class="document-article" :data-status="props.status">
    <div class="document-article__toolbar" role="toolbar">
      <div class="document-article__toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="document-article__toolbar-center">
        <slot name="toolbar-center" />
      </div>
      <div class="document-article__toolbar-right">
        <slot name="toolbar-right" />
      </div>
    </div>

    <div class="document-article__body">
      <div
        v-if="props.status === 'processing'"
        class="document-article__center document-article__center--processing"
        role="status"
        aria-live="polite">
        <EditorIcon name="spinner" spin :size="24" />
        <progress
          class="document-article__progress"
          :max="100"
          :value="progressValue ?? undefined" />
        <span
          v-if="progressValue !== null"
          class="document-article__progress-value">
          {{ progressValue }}%
        </span>
      </div>
      <div
        v-else-if="props.status === 'error'"
        class="document-article__center document-article__center--error"
        role="alert">
        <p class="document-article__error-text">{{ errorText }}</p>
        <Button
          variant="primary"
          icon="refresh-cw"
          @click="emit('retry')">
          {{ t("llmService.retry") }}
        </Button>
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
}

.document-article__toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-surface);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  z-index: 1;
}

.document-article__toolbar-left,
.document-article__toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.document-article__toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.document-article__body {
  flex: 1;
  min-height: 0;
}

.document-article__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
}

.document-article__center--processing {
  color: var(--color-primary);
}

.document-article__center--error {
  color: var(--color-danger, #d33);
}

.document-article__progress {
  width: min(280px, 100%);
  height: 6px;
}

.document-article__progress-value {
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.document-article__error-text {
  margin: 0;
  max-width: 480px;
  font-size: var(--font-size-sm);
  line-height: var(--line-height);
  color: var(--color-text-secondary);
}
</style>
