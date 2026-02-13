<script setup lang="ts">
import { ref } from 'vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-vue-next'
import EditorButton from './atoms/EditorButton.vue'
import { useI18n } from '../i18n'

const props = defineProps<{
  isPlaying: boolean
  currentTime: string
  duration: string
  volume: number
  playbackRate: number
  isMuted: boolean
  isReady: boolean
}>()

const emit = defineEmits<{
  togglePlay: []
  skipBack: []
  skipForward: []
  'update:volume': [value: number]
  toggleMute: []
  cyclePlaybackRate: []
}>()

const { t } = useI18n()

const showVolumeSlider = ref(false)

function onVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:volume', parseFloat(target.value))
}
</script>

<template>
  <div class="player-controls">
    <div class="controls-left">
      <EditorButton
        variant="ghost"
        size="md"
        :aria-label="t('player.skipBack')"
        :disabled="!isReady"
        @click="emit('skipBack')"
      >
        <template #icon><SkipBack :size="16" /></template>
      </EditorButton>

      <EditorButton
        variant="ghost"
        size="md"
        class="play-button"
        :aria-label="isPlaying ? t('player.pause') : t('player.play')"
        :disabled="!isReady"
        @click="emit('togglePlay')"
      >
        <template #icon>
          <Pause v-if="isPlaying" :size="20" />
          <Play v-else :size="20" />
        </template>
      </EditorButton>

      <EditorButton
        variant="ghost"
        size="md"
        :aria-label="t('player.skipForward')"
        :disabled="!isReady"
        @click="emit('skipForward')"
      >
        <template #icon><SkipForward :size="16" /></template>
      </EditorButton>
    </div>

    <div class="controls-time">
      <time class="time-display">{{ currentTime }}</time>
      <span class="time-separator">/</span>
      <time class="time-display">{{ duration }}</time>
    </div>

    <div class="controls-right">
      <div
        class="volume-group"
        @mouseenter="showVolumeSlider = true"
        @mouseleave="showVolumeSlider = false"
      >
        <EditorButton
          variant="ghost"
          size="md"
          :aria-label="isMuted ? t('player.unmute') : t('player.mute')"
          :disabled="!isReady"
          @click="emit('toggleMute')"
        >
          <template #icon>
            <VolumeX v-if="isMuted" :size="16" />
            <Volume2 v-else :size="16" />
          </template>
        </EditorButton>
        <input
          v-show="showVolumeSlider"
          type="range"
          class="volume-slider"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          :aria-label="t('player.volume')"
          :disabled="!isReady"
          @input="onVolumeInput"
        >
      </div>

      <EditorButton
        variant="ghost"
        size="md"
        class="speed-button"
        :aria-label="t('player.speed')"
        :disabled="!isReady"
        @click="emit('cyclePlaybackRate')"
      >
        {{ playbackRate }}x
      </EditorButton>
    </div>
  </div>
</template>

<style scoped>
.player-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-lg);
  height: 44px;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.controls-time {
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  user-select: none;
}

.time-separator {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-left: auto;
}

.volume-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.volume-slider {
  width: 80px;
  height: 4px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.volume-slider:disabled {
  opacity: 0.5;
  cursor: default;
}

.play-button {
  width: 40px;
  height: 40px;
}

.speed-button {
  font-size: var(--font-size-sm);
  font-family: var(--font-family-mono);
}
</style>
