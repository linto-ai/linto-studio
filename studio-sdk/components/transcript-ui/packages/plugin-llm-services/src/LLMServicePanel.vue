<script setup lang="ts">
import {
  MarkdownEditor,
  Button,
  EditorIcon,
  DocumentArticle,
  type DocumentArticleStatus,
} from "@linto-ai/transcript-ui-ui"
import { computed, ref, watch } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { useCore } from "@linto-ai/transcript-ui-core"
import type { LLMService } from "@linto-ai/transcript-ui-core"

const props = defineProps<{
  service: LLMService
  split?: boolean
}>()

const emit = defineEmits<{
  "update:split": [value: boolean]
}>()

const core = useCore()
const { t } = useI18n()

function toggleSplit(): void {
  emit("update:split", !props.split)
}

const articleStatus = computed<DocumentArticleStatus>(() => {
  const s = props.service.status.value
  if (s === "queued" || s === "processing") return "processing"
  if (s === "error") return "error"
  return "done"
})

const progress = computed(() => props.service.progress.value)
const content = computed(() => props.service.content.value)
const busy = computed(() => props.service.busy.value)
const dirty = computed(() => props.service.dirty.value)
const versions = computed(() => props.service.versions.value)
const activeVersionNumber = computed(
  () => props.service.activeVersionNumber.value,
)

// Nothing generated yet AND no saved version to fall back to — regardless
// of status (covers "error" with nothing generated too, not just "done").
// Download has nothing to export in this case.
const hasContent = computed<boolean>(
  () => !!content.value || versions.value.length > 0,
)

// Empty = no content has been generated yet AND no saved versions exist.
// We surface a CTA in place of an empty editor.
const isEmpty = computed<boolean>(() => {
  if (articleStatus.value !== "done") return false
  return !hasContent.value
})

// "Up to date" = the current version is more recent than the transcription's
// last edit. When either date is missing, default to up to date (no negative
// signal to show).
const isUpdated = computed<boolean>(() => {
  // Resolve the real backing store; the virtual cross translation isn't in the
  // map (no lastModifiedAt) → treated as up to date.
  const channel = core.activeChannel.value
  const activeId = channel?.activeTranslation.value.id
  const realStore = activeId ? channel?.translations.get(activeId) : undefined
  const transcriptionLastModified = realStore?.lastModifiedAt.value ?? null
  if (transcriptionLastModified == null) return true
  const activeVersion = versions.value.find(
    (v) => v.versionNumber === activeVersionNumber.value,
  )
  const versionTs = activeVersion?.createdAt ?? props.service.lastUpdate.value
  if (versionTs == null) return true
  return versionTs >= transcriptionLastModified
})

const draft = ref(content.value)

watch(content, (next) => {
  draft.value = next
  core.llmServices?.setDirty(props.service.id, false)
})

watch(draft, (next) => {
  const isDirty = next !== content.value
  if (props.service.dirty.value !== isDirty) {
    core.llmServices?.setDirty(props.service.id, isDirty)
  }
})

function onRegenerate(): void {
  core.emit("llmService:regenerate", { id: props.service.id })
}

function onExport(): void {
  core.emit("llmService:export", { id: props.service.id })
}

function onSave(): void {
  core.emit("llmService:saveVersion", {
    id: props.service.id,
    content: draft.value,
  })
}
</script>

<template>
  <section class="llm-service-panel">
    <DocumentArticle
      :status="articleStatus"
      :progress="progress"
      @retry="onRegenerate">
      <template #toolbar-left>
        <Button
          variant="primary"
          icon="save"
          :disabled="!dirty || busy"
          :aria-label="t('llmService.save')"
          :title="t('llmService.save')"
          @click="onSave" />
        <Button
          variant="secondary"
          icon="refresh-cw"
          :loading="articleStatus === 'processing'"
          :disabled="isUpdated || busy || articleStatus === 'processing'"
          :aria-label="t('llmService.regenerate')"
          :title="t('llmService.regenerate')"
          @click="onRegenerate" />
      </template>

      <template #toolbar-center>
        <span
          class="llm-service-panel__status"
          :class="[
            isUpdated
              ? 'llm-service-panel__status--ok'
              : 'llm-service-panel__status--warn',
          ]">
          <EditorIcon :name="isUpdated ? 'check' : 'warning'" :size="14" />
          <span>{{
            isUpdated
              ? t("llmService.statusUpdated")
              : t("llmService.statusOutdated")
          }}</span>
        </span>
      </template>

      <template #toolbar-right>
        <Button
          variant="primary"
          icon="download"
          :disabled="articleStatus === 'processing' || !hasContent"
          :aria-label="t('llmService.download')"
          :title="t('llmService.download')"
          @click="onExport">
          {{ t("llmService.download") }}
        </Button>
        <Button
          :variant="split ? 'primary' : 'secondary'"
          icon="panel-right"
          :aria-pressed="!!split"
          :aria-label="t('llmService.split')"
          :title="t('llmService.split')"
          @click="toggleSplit" />
      </template>

      <div v-if="isEmpty" class="llm-service-panel__empty" role="status">
        <p class="llm-service-panel__empty-text">{{ t("llmService.empty") }}</p>
        <Button
          variant="primary"
          icon="sparkles"
          :disabled="busy"
          @click="onRegenerate">
          {{ t("llmService.generate") }}
        </Button>
      </div>
      <MarkdownEditor v-else v-model="draft" :disabled="busy" />
    </DocumentArticle>
  </section>
</template>

<style scoped>
.llm-service-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}

.llm-service-panel__status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.llm-service-panel__status--ok {
  color: var(--color-success, #2e7d32);
}

.llm-service-panel__status--warn {
  color: var(--color-warning, #ed6c02);
}

.llm-service-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
}

.llm-service-panel__empty-text {
  margin: 0;
  max-width: 400px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 767px) {
  .llm-service-panel {
    padding: var(--spacing-md);
  }
}
</style>
