<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui'
import TranscriptionTurn from './TranscriptionTurn.vue'
import type { Turn, Speaker } from '../types/editor'

defineProps<{
  turns: Turn[]
  speakers: Map<string, Speaker>
}>()
</script>

<template>
  <article class="transcription-panel">
    <ScrollAreaRoot class="scroll-root">
      <ScrollAreaViewport class="scroll-viewport">
        <div class="turns-container">
          <TranscriptionTurn
            v-for="turn in turns"
            :key="turn.id"
            :turn="turn"
            :speaker="speakers.get(turn.speakerId)!"
          />
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scrollbar" orientation="vertical">
        <ScrollAreaThumb class="scrollbar-thumb" />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  </article>
</template>

<style scoped>
.transcription-panel {
  min-height: 0;
  overflow: hidden;
}

.scroll-root {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scroll-viewport {
  height: 100%;
  width: 100%;
}

/* Reka ScrollArea viewport needs explicit containment */
:deep([data-reka-scroll-area-viewport]) {
  height: 100%;
  max-height: 100%;
}

.turns-container {
  max-width: 80ch;
  margin-inline: auto;
  padding: var(--spacing-lg);
}

.scrollbar {
  display: flex;
  touch-action: none;
  user-select: none;
  padding: 2px;
  width: 8px;
  transition: background-color 150ms;
}

.scrollbar:hover {
  background-color: var(--color-border-light);
}

.scrollbar-thumb {
  flex: 1;
  background-color: var(--color-text-muted);
  border-radius: var(--radius-lg);
  opacity: 0.4;
  transition: opacity 150ms;
  position: relative;
}

.scrollbar-thumb:hover {
  opacity: 0.6;
}
</style>
