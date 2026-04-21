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

const formattedTime = computed(() =>
  props.startTime != null ? utils.formatTime(props.startTime) : null,
)

const isoDuration = computed(() =>
  props.startTime != null ? `PT${props.startTime.toFixed(1)}S` : undefined,
)

const speakerColor = computed(() => props.speaker?.color ?? "transparent")
</script>

<template>
  <div class="speaker-label">
    <SpeakerIndicator v-if="speaker" :color="speakerColor" />
    <span v-if="speaker" class="speaker-name">{{ speaker.name }}</span>
    <time v-if="formattedTime" class="timestamp" :datetime="isoDuration">{{
      formattedTime
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
