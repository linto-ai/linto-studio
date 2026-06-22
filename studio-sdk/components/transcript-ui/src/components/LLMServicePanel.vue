<script setup lang="ts">
import { computed, ref, watch } from "vue"
import MarkdownEditor from "./atoms/MarkdownEditor.vue"
import Button from "./atoms/Button.vue"
import EditorIcon from "./atoms/EditorIcon.vue"
import DocumentArticle, {
  type DocumentArticleStatus,
} from "./molecules/DocumentArticle.vue"
import { useI18n } from "../i18n"
import { useCore } from "../core"
import type { LLMService } from "../core"

const props = defineProps<{
  service: LLMService
}>()

const core = useCore()
const { t } = useI18n()

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

// Empty = no content has been generated yet AND no saved versions exist.
// We surface a CTA in place of an empty editor.
const isEmpty = computed<boolean>(() => {
  if (articleStatus.value !== "done") return false
  return !content.value && versions.value.length === 0
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
          :disabled="articleStatus === 'processing'"
          :aria-label="t('llmService.download')"
          :title="t('llmService.download')"
          @click="onExport">
          {{ t("llmService.download") }}
        </Button>
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
