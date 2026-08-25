<script setup lang="ts">
import { SpeakerIndicator } from "@linto/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto/transcript-ui-i18n"
import * as utils from "../utils"
import type { Speaker } from "../types/editor"

const props = defineProps<{
  speaker?: Speaker
  startTime?: number
  startDate?: number
  language: string
  /** The label is wrapped in a clickable trigger (speaker assignment):
   *  show the hover affordance on the name. */
  interactive?: boolean
}>()

const { t, locale } = useI18n()

const languageName = computed(() =>
  utils.getLanguageDisplayName(
    props.language,
    locale.value,
    t("language.wildcard"),
  ),
)

const timestamp = computed<{ text: string; datetime: string } | null>(() => {
  if (props.startTime != null) {
    return {
      text: utils.formatTime(props.startTime),
      datetime: `PT${props.startTime.toFixed(1)}S`,
    }
  }
  if (props.startDate != null) {
    const date = new Date(props.startDate * 1000)
    return {
      text: utils.formatShortDateTime(props.startDate, locale.value),
      datetime: date.toISOString(),
    }
  }
  return null
})

const speakerColor = computed(() => props.speaker?.color ?? "transparent")

// A turn always shows a speaker: unnamed ones get an explicit placeholder
// (assignment lands with the speakers iteration).
const displayName = computed(() => props.speaker?.name ?? t("speaker.unknown"))
</script>

<template>
  <div
    class="speaker-label"
    :class="{ 'speaker-label--interactive': interactive }">
    <SpeakerIndicator v-if="speaker" :color="speakerColor" />
    <span class="speaker-name" :class="{ 'speaker-name--unknown': !speaker }">{{
      displayName
    }}</span>
    <time v-if="timestamp" class="timestamp" :datetime="timestamp.datetime">{{
      timestamp.text
    }}</time>
    <span v-if="languageName" class="lang">{{ languageName }}</span>
  </div>
</template>

<style scoped>
.speaker-label {
  display: flex;
  border-bottom: 2px solid transparent;
  align-items: center;
  gap: var(--spacing-sm);
}

.speaker-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.speaker-name--unknown {
  font-weight: 400;
  font-style: italic;
  color: var(--color-text-muted);
}

.speaker-label--interactive:hover .speaker-name {
  text-decoration: underline;
}

.timestamp {
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  /* not supported on firefox yet */
  text-box: trim-both cap alphabetic;
}

.lang {
  font-size: var(--font-size-xs);
  font-weight: 400;
  /* not supported on firefox yet */
  text-box: trim-both cap alphabetic;
}
</style>
