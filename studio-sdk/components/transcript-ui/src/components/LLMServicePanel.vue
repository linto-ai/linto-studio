<script setup lang="ts">
import { computed } from "vue"
import MarkdownView from "./atoms/MarkdownView.vue"
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
// keep generic message
// const errorMessage = computed(() => props.service.error.value ?? undefined)
const content = computed(() => props.service.content.value)

function onRegenerate(): void {
  core.emit("llmService:regenerate", { id: props.service.id })
}

function onExport(): void {
  core.emit("llmService:export", { id: props.service.id })
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
      <MarkdownView v-if="content" :source="content" />
      <div v-else class="llm-service-panel__empty">
        <Button variant="primary" icon="sparkles" @click="onRegenerate">
          {{ t("llmService.generate") }}
        </Button>
      </div>
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
  /* padding: var(--spacing-lg); */
}

.llm-service-panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

@media (max-width: 767px) {
  .llm-service-panel {
    padding: var(--spacing-md);
  }
}
</style>
