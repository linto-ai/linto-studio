<script setup lang="ts">
import { computed } from 'vue'
import SpeakerLabel from './SpeakerLabel.vue'
import { useAudioContext } from '../composables/useAudioContext'
import { findActiveWord } from '../utils/words'
import type { Turn, Speaker } from '../types/editor'

const props = defineProps<{
  turn: Turn
  speaker: Speaker
  partialText?: string
}>()

const playback = useAudioContext()

const activeWordId = computed(() => {
  if (!playback) return null
  const time = playback.currentTime.value
  const { startTime, endTime, words } = props.turn
  if (time < startTime || time > endTime) return null
  return findActiveWord(words, time)
})
</script>

<template>
  <section class="turn" :style="{ '--speaker-color': speaker.color }">
    <SpeakerLabel
      :speaker="speaker"
      :start-time="turn.startTime"
      :language="turn.language" />
    <p class="turn-text">
      <template v-for="(word, i) in turn.words" :key="word.id">
        <span
          :class="{ 'word--active': word.id === activeWordId }"
          :data-word-active="word.id === activeWordId || undefined"
        >{{ word.text }}</span
        >{{ i < turn.words.length - 1 ? " " : "" }}
      </template>
      <span v-if="partialText" class="partial-text"> {{ partialText }}</span>
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

.word--active {
  text-decoration: underline;
  text-decoration-color: var(--speaker-color);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: var(--speaker-color);
}

.partial-text {
  font-style: italic;
  color: var(--color-text-muted);
  animation: partial-fade-in 200ms ease;
}

@keyframes partial-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .partial-text {
    animation: none;
  }
}

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
