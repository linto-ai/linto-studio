<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import AudioPlayerControls from './AudioPlayerControls.vue'
import { useAudioPlayer } from '../composables/useAudioPlayer'
import type { Turn, Speaker } from '../types/editor'

const props = defineProps<{
  audioSrc?: string
  turns: Turn[]
  speakers: Map<string, Speaker>
}>()

const emit = defineEmits<{
  timeupdate: [time: number]
  playStateChange: [playing: boolean]
}>()

const waveformRef = ref<HTMLElement | null>(null)

const {
  isPlaying,
  isReady,
  isLoading,
  volume,
  playbackRate,
  isMuted,
  currentTime,
  formattedCurrentTime,
  formattedDuration,
  togglePlay,
  seekTo,
  pause,
  skip,
  setVolume,
  cyclePlaybackRate,
  toggleMute,
} = useAudioPlayer({
  containerRef: waveformRef,
  audioSrc: toRef(() => props.audioSrc),
  turns: toRef(() => props.turns),
  speakers: toRef(() => props.speakers),
})

watch(currentTime, (t) => emit('timeupdate', t))
watch(isPlaying, (v) => emit('playStateChange', v))

defineExpose({ seekTo, pause })
</script>

<template>
  <footer class="audio-player">
    <div
      ref="waveformRef"
      class="waveform-container"
      :class="{ 'waveform-container--loading': isLoading }" />
    <AudioPlayerControls
      :is-playing="isPlaying"
      :current-time="formattedCurrentTime"
      :duration="formattedDuration"
      :volume="volume"
      :playback-rate="playbackRate"
      :is-muted="isMuted"
      :is-ready="isReady"
      @toggle-play="togglePlay"
      @skip-back="skip(-10)"
      @skip-forward="skip(10)"
      @update:volume="setVolume"
      @toggle-mute="toggleMute"
      @cycle-playback-rate="cyclePlaybackRate" />
  </footer>
</template>

<style scoped>
.audio-player {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
  flex-shrink: 0;
}

.waveform-container {
  /* padding: var(--spacing-md) var(--spacing-lg); */
  min-height: 32px;
}

.waveform-container--loading {
  background: linear-gradient(
    90deg,
    var(--color-border-light, var(--color-border)) 25%,
    var(--color-border) 50%,
    var(--color-border-light, var(--color-border)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .waveform-container--loading {
    animation: none;
  }
}
</style>

<!-- Unscoped: ::part() cannot pierce Shadow DOM from Vue scoped styles -->
<style>
.waveform-container ::part(region) {
  backdrop-filter: blur(0.5px);
  -webkit-backdrop-filter: blur(0.5px);
  border-top: 2px solid var(--region-color, rgba(255, 255, 255, 0.4));
  border-bottom: 1px solid var(--region-color, rgba(255, 255, 255, 0.4));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
