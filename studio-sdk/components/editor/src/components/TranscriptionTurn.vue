<script setup lang="ts">
import { computed } from 'vue'
import SpeakerLabel from './SpeakerLabel.vue'
import { useAudioContext } from '../composables/useAudioContext'
import { findActiveWord, hasWordTimestamps } from '../utils/words'
import type { Turn, Speaker } from '../types/editor'

const props = defineProps<{
  turn: Turn
  speaker?: Speaker
  partial?: boolean
}>()

const playback = useAudioContext()

const hasWords = computed(() => props.turn.words.length > 0)

const activeWordId = computed(() => {
  if (!playback || !hasWords.value) return null
  const time = playback.currentTime.value
  const { startTime, endTime, words } = props.turn
  if (startTime == null || endTime == null) return null
  if (time < startTime || time > endTime) return null
  return findActiveWord(words, time)
})

const isTurnActive = computed(() => {
  if (!playback) return false
  if (props.turn.startTime == null || props.turn.endTime == null) return false
  if (hasWordTimestamps(props.turn.words)) return false
  const time = playback.currentTime.value
  return time >= props.turn.startTime && time <= props.turn.endTime
})

const speakerColor = computed(() => props.speaker?.color ?? 'transparent')
</script>

<template>
  <section
    class="turn"
    :class="{ 'turn--active': isTurnActive, 'turn--partial': partial }"
    :data-turn-active="isTurnActive || undefined"
    :style="{ '--speaker-color': speakerColor }"
  >
    <SpeakerLabel
      v-if="!partial"
      :speaker="speaker"
      :start-time="turn.startTime"
      :language="turn.language" />
    <p class="turn-text">
      <template v-if="hasWords">
        <template v-for="(word, i) in turn.words" :key="word.id">
          <span
            :class="{ 'word--active': word.id === activeWordId }"
            :data-word-active="word.id === activeWordId || undefined"
          >{{ word.text }}</span
          >{{ i < turn.words.length - 1 ? " " : "" }}
        </template>
      </template>
      <template v-else-if="turn.text">{{ turn.text }}</template>
    </p>
  </section>
</template>

<style scoped>
.turn {
  padding: var(--spacing-md) var(--spacing-lg);
}

.turn + .turn {
  margin-top: var(--spacing-sm);
}

.turn-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-secondary);
}

.turn--active {
  border-left: 3px solid var(--speaker-color);
  background-color: color-mix(in srgb, var(--speaker-color) 8%, transparent);
}

.word--active {
  text-decoration: underline;
  text-decoration-color: var(--speaker-color);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: var(--speaker-color);
}

.turn--partial .turn-text {
  font-style: italic;
  color: var(--color-text-muted);
  animation: partial-fade-in 200ms ease;
}

@keyframes partial-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .turn--partial .turn-text {
    animation: none;
  }
}

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
