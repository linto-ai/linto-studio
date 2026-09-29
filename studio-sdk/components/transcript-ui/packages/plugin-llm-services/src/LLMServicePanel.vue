<script setup lang="ts">
import {
  MarkdownEditor,
  MarkdownView,
  Button,
  DocumentArticle,
  type DocumentArticleStatus,
} from "@linto-ai/transcript-ui-ui"
import { computed, ref, watch } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { useCore, useIsMobile } from "@linto-ai/transcript-ui-core"
import type { LLMService } from "@linto-ai/transcript-ui-core"
import LLMServiceStatus from "./LLMServiceStatus.vue"

const props = defineProps<{
  service: LLMService
  split?: boolean
}>()

const emit = defineEmits<{
  "update:split": [value: boolean]
}>()

const core = useCore()
const { t } = useI18n()
const { isMobile } = useIsMobile()

// Phones only read the document: editing, saving and the split view stay on
// larger screens. Downloading stays (the mobile app turns it into a PDF
// export), and regenerating is offered once the transcription has changed.
const isReadOnly = computed(() => isMobile.value)

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
      <template v-if="!isReadOnly" #toolbar-left>
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

      <template v-if="!isReadOnly" #toolbar-center>
        <LLMServiceStatus :is-updated="isUpdated" />
      </template>

      <template v-if="!isReadOnly" #toolbar-right>
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
      <MarkdownEditor v-else-if="!isReadOnly" v-model="draft" :disabled="busy" />
      <template v-else>
        <!-- Scrolls with the text: on a phone, reading gets the whole
             screen instead of a sticky toolbar. -->
        <div class="llm-service-panel__reading-status">
          <LLMServiceStatus :is-updated="isUpdated" />
          <div class="llm-service-panel__reading-actions">
            <Button
              v-if="!isUpdated"
              variant="secondary"
              icon="refresh-cw"
              :disabled="busy"
              @click="onRegenerate">
              {{ t("llmService.regenerate") }}
            </Button>
            <Button
              variant="primary"
              icon="download"
              :aria-label="t('llmService.download')"
              :title="t('llmService.download')"
              @click="onExport" />
          </div>
        </div>
        <!-- The draft, not the saved content: unsaved edits made on a wider
             screen stay visible, and come back in the editor on widening. -->
        <MarkdownView class="llm-service-panel__reading" :source="draft" />
      </template>
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
  overflow-x: hidden;
}

.llm-service-panel__reading-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.llm-service-panel__reading-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-left: auto;
}

.llm-service-panel__reading {
  padding: var(--spacing-xl) var(--spacing-lg);
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
</style>
