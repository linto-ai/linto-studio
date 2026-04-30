<script setup lang="ts">
import { computed } from "vue"
import DocumentArticle from "./molecules/DocumentArticle.vue"
import type { DownloadFormat } from "./molecules/DownloadMenu.vue"
import SpeakerIndicator from "./atoms/SpeakerIndicator.vue"
import { useI18n } from "../i18n"
import { useCore } from "../core"
import * as utils from "../utils"

const core = useCore()
const { t, locale } = useI18n()

const formats: DownloadFormat[] = [
  { format: "docx", labelKey: "format.docx" },
  { format: "pdf", labelKey: "format.pdf" },
  { format: "txt", labelKey: "format.txt" },
  { format: "json", labelKey: "format.json" },
  { format: "whisperx", labelKey: "format.whisperx" },
]

const turns = computed(
  () => core.activeChannel.value?.activeTranslation.value.turns.value ?? [],
)
const speakers = core.speakers.all

const title = computed(() => core.title.value)
const date = computed(() => core.date.value)
const duration = computed(() => core.activeChannel.value?.duration ?? 0)
const speakerCount = computed(() => speakers.size)

const formattedDate = computed(() =>
  date.value != null ? utils.formatLongDate(date.value, locale.value) : "",
)
const formattedDuration = computed(() =>
  utils.formatDurationMinutes(duration.value, locale.value),
)
const formattedSpeakers = computed(() =>
  t("header.speakerCount", { count: speakerCount.value }),
)
const subtitleParts = computed(() =>
  [
    formattedDate.value,
    formattedDuration.value,
    formattedSpeakers.value,
  ].filter(Boolean),
)

function speakerName(id: string | null): string {
  if (id == null) return ""
  return speakers.get(id)?.name ?? id
}

function speakerColor(id: string | null): string | undefined {
  if (id == null) return undefined
  return speakers.get(id)?.color
}

function turnText(turn: {
  text: string | null
  words: { text: string }[]
}): string {
  if (turn.text != null) return turn.text
  return turn.words.map((w) => w.text).join(" ")
}

function onExport(format?: string): void {
  if (!format) return
  core.emit("verbatim:export", { format })
}
</script>

<template>
  <section class="verbatim-panel">
    <DocumentArticle :formats="formats" @export="onExport">
      <header class="verbatim-panel__header">
        <h1 class="verbatim-panel__doc-title">{{ title }}</h1>
        <p v-if="subtitleParts.length" class="verbatim-panel__subtitle">
          <span
            v-for="(part, i) in subtitleParts"
            :key="i"
            class="verbatim-panel__subtitle-part">
            {{ part }}
          </span>
        </p>
      </header>

      <ul class="verbatim-panel__turns">
        <li v-for="turn in turns" :key="turn.id" class="verbatim-panel__turn">
          <div class="verbatim-panel__speaker">
            <SpeakerIndicator
              v-if="turn.speakerId"
              :color="speakerColor(turn.speakerId) ?? '#888'" />
            <span class="verbatim-panel__speaker-name">
              {{ speakerName(turn.speakerId) }}
            </span>
          </div>
          <p class="verbatim-panel__text">{{ turnText(turn) }}</p>
        </li>
      </ul>
    </DocumentArticle>
  </section>
</template>

<style scoped>
.verbatim-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  /* padding: var(--spacing-lg); */
}

.verbatim-panel__header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.verbatim-panel__doc-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text-primary);
}

.verbatim-panel__subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.verbatim-panel__subtitle-part + .verbatim-panel__subtitle-part::before {
  content: "·";
  margin-right: var(--spacing-xs);
}

.verbatim-panel__turns {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.verbatim-panel__turn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.verbatim-panel__speaker {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.verbatim-panel__speaker-name {
  text-box: cap alphabetic;
}

.verbatim-panel__text {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

@media (max-width: 767px) {
  .verbatim-panel {
    padding: var(--spacing-md);
  }
}
</style>
