<script setup lang="ts">
import SpeakerLabel from './SpeakerLabel.vue'
import type { Turn, Speaker } from '../types/editor'

defineProps<{
  turn: Turn
  speaker: Speaker
}>()
</script>

<template>
  <section class="turn" :style="{ '--speaker-color': speaker.color }">
    <SpeakerLabel :speaker="speaker" :start-time="turn.startTime" :language="turn.language" />
    <p class="turn-text">{{ turn.text }}</p>
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
</style>
