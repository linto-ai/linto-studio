<script setup lang="ts">
import { DocumentArticle, DownloadMenu } from "@linto-ai/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { useCore } from "../core"
import * as utils from "../utils"

const core = useCore()
const { locale } = useI18n()

const turns = computed(
  () => core.activeChannel.value?.activeTranslation.value.turns.value ?? [],
)
const speakers = core.speakers.all

const title = computed(() => core.title.value)

const displayNames = computed(
  () => new Intl.DisplayNames([locale.value], { type: "language" }),
)

function speakerName(id: string | null): string {
  if (id == null) return ""
  return speakers.get(id)?.name ?? id
}

function languageName(code: string): string {
  if (!code) return ""
  return displayNames.value.of(code) ?? code
}

function turnText(turn: {
  text: string | null
  words: { text: string }[]
}): string {
  if (turn.text != null) return turn.text
  return turn.words.map((w) => w.text).join(" ")
}

// "txt" needs no backend — it's just the turns joined into text — so it's
// the one format the core always fulfills itself. Anything else (docx, pdf,
// whisperx…) only exists once the host lists it in verbatimFormats, and is
// then always the host's to fulfill via "verbatim:export".
function exportAsText(): void {
  const text = utils.buildVerbatimText(
    title.value,
    turns.value.map((turn) => ({
      speakerName: speakerName(turn.speakerId),
      time: turn.startTime != null ? utils.formatTime(turn.startTime) : null,
      languageName: turn.language ? languageName(turn.language) : null,
      text: turnText(turn),
    })),
  )
  utils.downloadTextFile(`${title.value || "transcript"}.txt`, text)
}

function onExport(format?: string): void {
  if (!format) return
  if (format === "txt" && core.verbatimFormatsAreDefault.value) {
    exportAsText()
    return
  }
  core.emit("verbatim:export", { format })
}
</script>

<template>
  <section class="verbatim-panel">
    <DocumentArticle>
      <template #toolbar-right>
        <DownloadMenu :formats="core.verbatimFormats.value" @select="onExport" />
      </template>

      <article class="verbatim-panel__content">
        <header class="verbatim-panel__header">
          <h1 class="verbatim-panel__doc-title">{{ title }}</h1>
        </header>

        <ul class="verbatim-panel__turns">
          <li v-for="turn in turns" :key="turn.id" class="verbatim-panel__turn">
            <header class="verbatim-panel__turn-header">
              <strong class="verbatim-panel__speaker-name">
                {{ speakerName(turn.speakerId) }}
              </strong>
              <span v-if="turn.startTime != null" class="verbatim-panel__meta">
                <span class="verbatim-panel__sep" aria-hidden="true">·</span>
                <time>{{ utils.formatTime(turn.startTime) }}</time>
              </span>
              <span v-if="turn.language" class="verbatim-panel__meta">
                <span class="verbatim-panel__sep" aria-hidden="true">·</span>
                {{ languageName(turn.language) }}
              </span>
            </header>
            <p class="verbatim-panel__text">{{ turnText(turn) }}</p>
          </li>
        </ul>
      </article>
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
}

.verbatim-panel__content {
  padding: var(--spacing-md) var(--spacing-lg);
}

.verbatim-panel__header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.verbatim-panel__doc-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.verbatim-panel__turns {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.verbatim-panel__turn {
  display: block;
}

.verbatim-panel__turn-header {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: 1.4;
}

.verbatim-panel__speaker-name {
  font-weight: 700;
  color: var(--color-text-primary);
}

.verbatim-panel__meta {
  color: var(--color-text-muted);
  font-weight: 400;
}

.verbatim-panel__sep {
  margin: 0 0.35em;
}

.verbatim-panel__text {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text-primary);
}

@media (max-width: 767px) {
  .verbatim-panel {
    padding: var(--spacing-md);
  }
}
</style>
