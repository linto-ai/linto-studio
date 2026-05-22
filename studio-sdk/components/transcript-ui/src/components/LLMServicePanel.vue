<script setup lang="ts">
import { computed, ref, watch } from "vue"
import MarkdownEditor from "./atoms/MarkdownEditor.vue"
import Button from "./atoms/Button.vue"
import FormInput from "./molecules/FormInput.vue"
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
const versions = computed(() => props.service.versions.value)
const activeVersionNumber = computed(
  () => props.service.activeVersionNumber.value,
)
const busy = computed(() => props.service.busy.value)
const dirty = computed(() => props.service.dirty.value)

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
})

const draft = ref(content.value)

// External content change → sync draft and clear dirty.
watch(content, (next) => {
  draft.value = next
  core.llmServices?.setDirty(props.service.id, false)
})

// Local edit → push dirty if draft diverges from the loaded content.
watch(draft, (next) => {
  const isDirty = next !== content.value
  if (props.service.dirty.value !== isDirty) {
    core.llmServices?.setDirty(props.service.id, isDirty)
  }
})

const versionOptions = computed(() =>
  versions.value
    .slice()
    .sort((a, b) => b.versionNumber - a.versionNumber)
    .map((v) => ({
      value: String(v.versionNumber),
      label: `v${v.versionNumber} — ${dateFormat.format(v.createdAt)}`,
    })),
)

const selectedVersion = computed<string>({
  get() {
    return activeVersionNumber.value !== null
      ? String(activeVersionNumber.value)
      : ""
  },
  set(value: string) {
    const n = Number(value)
    if (!Number.isFinite(n) || n === activeVersionNumber.value) return
    core.emit("llmService:selectVersion", {
      id: props.service.id,
      versionNumber: n,
    })
  },
})

const versionField = computed(() => ({
  label: t("llmService.version"),
  value: selectedVersion.value,
}))

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
    <div
      v-if="versionOptions.length > 0"
      class="llm-service-panel__controls">
      <FormInput
        v-model="selectedVersion"
        :field="versionField"
        select
        :options="versionOptions"
        :disabled="busy"
        inline
        size="sm" />
    </div>

    <DocumentArticle
      :status="articleStatus"
      :progress="progress"
      show-regenerate
      @regenerate="onRegenerate"
      @export="onExport">
      <template #toolbar-actions>
        <Button
          v-if="dirty"
          variant="primary"
          icon="check"
          :disabled="busy"
          @click="onSave">
          {{ t("llmService.save") }}
        </Button>
      </template>
      <MarkdownEditor v-model="draft" :disabled="busy" />
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

.llm-service-panel__controls {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.llm-service-panel__controls :deep(.form-field) {
  width: auto;
  min-width: 240px;
}

@media (max-width: 767px) {
  .llm-service-panel {
    padding: var(--spacing-md);
  }
}
</style>
