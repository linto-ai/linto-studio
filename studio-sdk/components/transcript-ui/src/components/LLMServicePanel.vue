<script setup lang="ts">
import { computed, ref, watch } from "vue"
import MarkdownEditor from "./atoms/MarkdownEditor.vue"
import Button from "./atoms/Button.vue"
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

@media (max-width: 767px) {
  .llm-service-panel {
    padding: var(--spacing-md);
  }
}
</style>
