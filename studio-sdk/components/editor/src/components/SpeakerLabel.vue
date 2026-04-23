<script setup lang="ts">
import { computed } from "vue"
import SpeakerIndicator from "./atoms/SpeakerIndicator.vue"
//import EditorBadge from "./atoms/EditorBadge.vue"
import { useI18n } from "../i18n"
import * as utils from "../utils"
import type { Speaker } from "../types/editor"

const props = defineProps<{
  speaker?: Speaker
  startTime?: number
  startDate?: number
  language: string
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
</script>

<template>
  <div class="speaker-label">
    <SpeakerIndicator v-if="speaker" :color="speakerColor" />
    <span v-if="speaker" class="speaker-name">{{ speaker.name }}</span>
    <time v-if="timestamp" class="timestamp" :datetime="timestamp.datetime">{{
      timestamp.text
    }}</time>
    <span class="lang">{{ languageName }}</span>
  </div>
</template>

<style scoped>
.speaker-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.speaker-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.timestamp {
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  /*not supported on firefox yet */
  text-box: trim-both cap alphabetic;
}

.lang {
  font-size: var(--font-size-xs);
  font-weight: 400;
  /* not supported on firefox yet */
  text-box: trim-both cap alphabetic;
}
</style>
