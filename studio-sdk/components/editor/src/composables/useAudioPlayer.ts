import {
  ref,
  computed,
  watch,
  onBeforeUnmount,
  type Ref,
  shallowRef,
} from 'vue'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { hexToRgba } from '../utils/color'
import { formatTime } from '../utils/time'
import { renderWaveform } from '../utils/waveform'
import type { Turn, Speaker } from '../types/editor'

export interface UseAudioPlayerOptions {
  containerRef: Ref<HTMLElement | null>
  audioSrc: Ref<string | undefined>
  turns: Ref<Turn[]>
  speakers: Ref<Map<string, Speaker>>
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export function useAudioPlayer(options: UseAudioPlayerOptions) {
  const { containerRef, audioSrc, turns, speakers } = options

  const wavesurfer = shallowRef<WaveSurfer | null>(null)
  const regions = shallowRef<RegionsPlugin | null>(null)

  const currentTime = ref(0)
  const duration = ref(0)
  const isPlaying = ref(false)
  const isReady = ref(false)
  const isLoading = ref(false)
  const volume = ref(1)
  const playbackRate = ref(1)
  const isMuted = ref(false)

  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))

  function initWaveSurfer(container: HTMLElement, src: string) {
    destroy()

    isLoading.value = true
    isReady.value = false

    const regionsPlugin = RegionsPlugin.create()
    regions.value = regionsPlugin

    const player = WaveSurfer.create({
      container,
      height: 32,
      waveColor: '#000000ff',
      progressColor: '#5f5f5fff',
      cursorColor: 'red',
      cursorWidth: 2,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      barHeight: 0.8,
      normalize: true,
      backend: 'MediaElement',
      renderFunction: renderWaveform,
      url: src,
      plugins: [regionsPlugin],
    })

    player.on('ready', () => {
      isReady.value = true
      isLoading.value = false
      duration.value = player.getDuration()
      syncRegions()
    })

    player.on('timeupdate', (time: number) => {
      currentTime.value = time
    })

    player.on('play', () => {
      isPlaying.value = true
    })

    player.on('pause', () => {
      isPlaying.value = false
    })

    player.on('finish', () => {
      isPlaying.value = false
    })

    wavesurfer.value = player
  }

  function syncRegions() {
    const regionsPlugin = regions.value
    if (!regionsPlugin) return

    regionsPlugin.clearRegions()

    for (const turn of turns.value) {
      const speaker = speakers.value.get(turn.speakerId)
      if (!speaker) continue

      const region = regionsPlugin.addRegion({
        start: turn.startTime,
        end: turn.endTime,
        color: hexToRgba(speaker.color, 0.25),
        drag: false,
        resize: false,
      })
      region.element?.style.setProperty('--region-color', speaker.color)
    }
  }

  function play() {
    wavesurfer.value?.play()
  }

  function pause() {
    wavesurfer.value?.pause()
  }

  function togglePlay() {
    wavesurfer.value?.playPause()
  }

  function seekTo(time: number) {
    const player = wavesurfer.value
    if (!player || duration.value === 0) return
    player.setTime(time)
  }

  function skip(seconds: number) {
    seekTo(Math.max(0, Math.min(currentTime.value + seconds, duration.value)))
  }

  function setVolume(v: number) {
    const player = wavesurfer.value
    if (!player) return
    volume.value = v
    player.setVolume(v)
    if (v > 0 && isMuted.value) {
      isMuted.value = false
      player.setMuted(false)
    }
  }

  function toggleMute() {
    const player = wavesurfer.value
    if (!player) return
    isMuted.value = !isMuted.value
    player.setMuted(isMuted.value)
  }

  function setPlaybackRate(rate: number) {
    const player = wavesurfer.value
    if (!player) return
    playbackRate.value = rate
    player.setPlaybackRate(rate)
  }

  function cyclePlaybackRate() {
    const currentIndex = PLAYBACK_RATES.indexOf(
      playbackRate.value as (typeof PLAYBACK_RATES)[number],
    )
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length
    setPlaybackRate(PLAYBACK_RATES[nextIndex] ?? 1)
  }

  function destroy() {
    if (wavesurfer.value) {
      wavesurfer.value.destroy()
      wavesurfer.value = null
      regions.value = null
    }
  }

  watch(
    [containerRef, audioSrc],
    ([container, src]) => {
      if (container && src) {
        initWaveSurfer(container, src)
      }
    },
    { immediate: true },
  )

  watch([turns, speakers], () => {
    if (isReady.value) {
      syncRegions()
    }
  })

  onBeforeUnmount(() => {
    destroy()
  })

  return {
    currentTime,
    duration,
    isPlaying,
    isReady,
    isLoading,
    volume,
    playbackRate,
    isMuted,
    formattedCurrentTime,
    formattedDuration,
    play,
    pause,
    togglePlay,
    seekTo,
    skip,
    setVolume,
    setPlaybackRate,
    cyclePlaybackRate,
    toggleMute,
  }
}
