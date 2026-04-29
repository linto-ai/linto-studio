<script setup lang="ts">
import { computed } from "vue"
import MarkdownView from "./atoms/MarkdownView.vue"
import DocumentArticle, {
  type DocumentArticleStatus,
} from "./molecules/DocumentArticle.vue"
import type { DownloadFormat } from "./molecules/DownloadMenu.vue"
import { useI18n } from "../i18n"
import { useCore } from "../core"
import * as utils from "../utils"
import type { LLMService } from "../core"

const props = defineProps<{
  service: LLMService
}>()

const core = useCore()
const { t, locale } = useI18n()

const formats: DownloadFormat[] = [
  { format: "docx", labelKey: "format.docx" },
  { format: "pdf", labelKey: "format.pdf" },
]

const articleStatus = computed<DocumentArticleStatus>(() => {
  const s = props.service.status.value
  if (s === "queued" || s === "processing") return "processing"
  if (s === "error") return "error"
  return "done"
})

const metaLabel = computed(() => {
  const s = props.service.status.value
  if (s === "error") {
    return props.service.error.value || t("llmService.error")
  }
  if (s === "queued") return t("llmService.queued")
  if (s === "processing") return t("llmService.processing")
  const lastUpdate = props.service.lastUpdate.value
  if (lastUpdate != null) {
    const rel = utils.formatRelativeFromNow(lastUpdate, locale.value)
    return `${t("llmService.generated")} · ${rel}`
  }
  return t("llmService.generated")
})

const metaProgress = computed(() => {
  if (articleStatus.value !== "processing") return undefined
  const value = props.service.progress.value
  return value > 0 ? value : undefined
})

const content = computed(() => props.service.content.value)

function onRegenerate(): void {
  core.emit("llmService:regenerate", { id: props.service.id })
}

function onExport(format: string): void {
  core.emit("llmService:export", { id: props.service.id, format })
}
</script>

<template>
  <section class="llm-service-panel">
    <DocumentArticle
      :meta-label="metaLabel"
      meta-icon="sparkles"
      :meta-progress="metaProgress"
      :status="articleStatus"
      show-regenerate
      :formats="formats"
      @regenerate="onRegenerate"
      @export="onExport">
      <MarkdownView v-if="content" :source="content" />
      <div v-else class="llm-service-panel__placeholder">
        <p>{{ t("llmService.empty") }}</p>
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

.llm-service-panel__placeholder {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xl) 0;
}

@media (max-width: 767px) {
  .llm-service-panel {
    padding: var(--spacing-md);
  }
}
</style>
