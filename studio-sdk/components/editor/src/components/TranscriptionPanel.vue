<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui'
import { ArrowDown } from 'lucide-vue-next'
import TranscriptionTurn from './TranscriptionTurn.vue'
import EditorButton from './atoms/EditorButton.vue'
import { useAudioContext } from '../composables/useAudioContext'
import { useAutoScroll } from '../composables/useAutoScroll'
import { useI18n } from '../i18n'
import type { Turn, Speaker } from '../types/editor'

defineProps<{
  turns: Turn[]
  speakers: Map<string, Speaker>
}>()

const { t } = useI18n()
const playback = useAudioContext()
const panelRef = useTemplateRef<HTMLElement>('panel')

const { isFollowing, resumeFollow } = useAutoScroll({
  panelRef,
  playback,
})
</script>

<template>
  <article ref="panel" class="transcription-panel">
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

      <Transition name="fade-slide">
        <EditorButton
          v-if="!isFollowing && playback?.isPlaying.value"
          size="sm"
          class="resume-scroll-btn"
          :aria-label="t('transcription.resumeScroll')"
          @click="resumeFollow"
        >
          <template #icon><ArrowDown :size="14" /></template>
          {{ t('transcription.resumeScroll') }}
        </EditorButton>
      </Transition>
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
  padding: var(--spacing-xxs);
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

/* Resume scroll button */
.resume-scroll-btn {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  translate: -50% 0;
  z-index: 10;
  background: var(--glass-background);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 200ms ease, translate 200ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  translate: -50% 8px;
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}
</style>
