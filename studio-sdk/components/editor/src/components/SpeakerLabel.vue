<script setup lang="ts">
import { computed } from 'vue'
import SpeakerIndicator from './atoms/SpeakerIndicator.vue'
import EditorBadge from './atoms/EditorBadge.vue'
import { useI18n } from '../i18n'
import { formatTime } from '../utils/time'
import { getLanguageDisplayName } from '../utils/intl'
import type { Speaker } from '../types/editor'

const props = defineProps<{
  speaker: Speaker
  startTime: number
  language: string
}>()

const { locale } = useI18n()

const languageName = computed(() => getLanguageDisplayName(props.language, locale.value))

const formattedTime = computed(() => formatTime(props.startTime))

const isoDuration = computed(() => `PT${props.startTime.toFixed(1)}S`)
</script>

<template>
  <div class="speaker-label">
    <SpeakerIndicator :color="speaker.color" />
    <span class="speaker-name">{{ speaker.name }}</span>
    <time class="timestamp" :datetime="isoDuration">{{ formattedTime }}</time>
    <EditorBadge>{{ languageName }}</EditorBadge>
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
}
</style>
