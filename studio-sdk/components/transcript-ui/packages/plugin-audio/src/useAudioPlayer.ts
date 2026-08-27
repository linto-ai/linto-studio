import {
  ref,
  computed,
  watch,
  onBeforeUnmount,
  type Ref,
  shallowRef,
} from "vue"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.esm.js"
import { utils, useCore } from "@linto-ai/transcript-ui-core"
import type { CoreEventMap, Turn } from "@linto-ai/transcript-ui-core"

export interface UseAudioPlayerOptions {
  containerRef: Ref<HTMLElement | null>
  audioSrc: Ref<string | undefined>
}

interface RegionEntry {
  region: Region
  speakerId: string
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export function useAudioPlayer(options: UseAudioPlayerOptions) {
  const { containerRef, audioSrc } = options
  const core = useCore()
  if (!core.audio) {
    throw new Error("useAudioPlayer requires the audio plugin (core.audio)")
  }
  const audio = core.audio

  const wavesurfer = shallowRef<WaveSurfer | null>(null)
  const regions = shallowRef<RegionsPlugin | null>(null)

  const currentTime = audio.currentTime
  const isPlaying = audio.isPlaying

  const duration = ref(0)
  const isReady = ref(false)
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const volume = ref(1)
  const playbackRate = ref(1)
  const isMuted = ref(false)

  const formattedCurrentTime = computed(() =>
    utils.formatTime(currentTime.value),
  )
  const formattedDuration = computed(() => utils.formatTime(duration.value))

  const regionMap = new Map<string, RegionEntry>()
  const eventUnsubs: Array<() => void> = []

  // ── Region management ────────────────────────────────────────────────

  function updateOrCreateRegion(turn: Turn): void {
    const regionsPlugin = regions.value
    if (!regionsPlugin) return
    if (turn.startTime == null || turn.endTime == null) {
      removeRegion(turn.id)
      return
    }
    const speaker = turn.speakerId
      ? core.speakers.all.get(turn.speakerId)
      : undefined
    if (!speaker || !turn.speakerId) {
      removeRegion(turn.id)
      return
    }

    const color = utils.hexToRgba(speaker.color, 0.25)
    const existing = regionMap.get(turn.id)

    if (existing) {
      existing.region.setOptions({
        start: turn.startTime,
        end: turn.endTime,
        color,
      })
      existing.region.element?.style.setProperty(
        "--region-color",
        speaker.color,
      )
      existing.speakerId = turn.speakerId
      return
    }

    const region = regionsPlugin.addRegion({
      start: turn.startTime,
      end: turn.endTime,
      color,
      drag: false,
      resize: false,
    })
    region.element?.style.setProperty("--region-color", speaker.color)
    regionMap.set(turn.id, { region, speakerId: turn.speakerId })
  }

  function removeRegion(turnId: string): void {
    const entry = regionMap.get(turnId)
    if (!entry) return
    entry.region.remove()
    regionMap.delete(turnId)
  }

  function clearAllRegions(): void {
    for (const { region } of regionMap.values()) region.remove()
    regionMap.clear()
  }

  function rebuildAllRegions(): void {
    clearAllRegions()
    const turns =
      core.activeChannel.value?.activeTranslation.value.turns.value ?? []
    for (const turn of turns) updateOrCreateRegion(turn)
  }

  // ── Core event handlers ──────────────────────────────────────────────

  function onTurnAdd({ turn }: CoreEventMap["turn:add"]): void {
    updateOrCreateRegion(turn)
  }

  function onTurnUpdate({ turn }: CoreEventMap["turn:update"]): void {
    const existing = regionMap.get(turn.id)
    if (existing) {
      const sameTimes =
        existing.region.start === turn.startTime &&
        existing.region.end === turn.endTime
      const sameSpeaker = existing.speakerId === turn.speakerId
      if (sameTimes && sameSpeaker) return
    }
    updateOrCreateRegion(turn)
  }

  function onTurnRemove({ turnId }: CoreEventMap["turn:remove"]): void {
    removeRegion(turnId)
  }

  function onSpeakerUpdate({ speaker }: CoreEventMap["speaker:update"]): void {
    const color = utils.hexToRgba(speaker.color, 0.25)
    for (const [, entry] of regionMap) {
      if (entry.speakerId !== speaker.id) continue
      entry.region.setOptions({ color })
      entry.region.element?.style.setProperty("--region-color", speaker.color)
    }
  }

  function onSpeakerRemove({
    speakerId,
  }: CoreEventMap["speaker:remove"]): void {
    for (const [turnId, entry] of [...regionMap]) {
      if (entry.speakerId === speakerId) removeRegion(turnId)
    }
  }

  function onTranslationSync(): void {
    rebuildAllRegions()
  }

  function onTranslationChange(): void {
    rebuildAllRegions()
  }

  function onChannelReset(): void {
    clearAllRegions()
  }

  function attachEventListeners(): void {
    eventUnsubs.push(core.onActiveTranslation("turn:add", onTurnAdd))
    eventUnsubs.push(core.onActiveTranslation("turn:update", onTurnUpdate))
    eventUnsubs.push(core.onActiveTranslation("turn:remove", onTurnRemove))
    eventUnsubs.push(core.on("speaker:update", onSpeakerUpdate))
    eventUnsubs.push(core.on("speaker:remove", onSpeakerRemove))
    eventUnsubs.push(core.on("translation:sync", onTranslationSync))
    eventUnsubs.push(core.on("translation:change", onTranslationChange))
    eventUnsubs.push(core.on("channel:reset", onChannelReset))
  }

  function detachEventListeners(): void {
    for (const u of eventUnsubs) u()
    eventUnsubs.length = 0
  }

  // ── WaveSurfer event handlers ────────────────────────────────────────

  function onPlayerReady(): void {
    const player = wavesurfer.value
    if (!player) return
    isReady.value = true
    isLoading.value = false
    loadError.value = null
    duration.value = player.getDuration()
    rebuildAllRegions()
    attachEventListeners()
  }

  function onPlayerTimeUpdate(time: number): void {
    currentTime.value = time
  }

  function onPlayerPlay(): void {
    isPlaying.value = true
  }

  function onPlayerPause(): void {
    isPlaying.value = false
  }

  function onPlayerFinish(): void {
    isPlaying.value = false
  }

  function onPlayerError(err: Error): void {
    isLoading.value = false
    isReady.value = false
    loadError.value = err?.message ?? "Failed to load audio"
  }

  // ── Player lifecycle ─────────────────────────────────────────────────

  function initWaveSurfer(container: HTMLElement, src: string): void {
    destroy()

    isLoading.value = true
    isReady.value = false
    loadError.value = null

    const regionsPlugin = RegionsPlugin.create()
    regions.value = regionsPlugin

    // Precomputed peaks (resolved by the audio plugin) let WaveSurfer draw
    // the waveform without fetching and decoding the whole audio file.
    // The duration comes from the document metadata; without it WaveSurfer
    // waits for the media metadata before the first render.
    const precomputed = audio.waveform.value
    const peaks = precomputed?.length
      ? [utils.normalizePeaks(precomputed)]
      : undefined
    const channelDuration = core.activeChannel.value?.duration

    const player = WaveSurfer.create({
      peaks,
      duration: peaks && channelDuration ? channelDuration : undefined,
      container,
      height: 32,
      waveColor: "#000000ff",
      progressColor: "#5f5f5fff",
      cursorColor: "red",
      cursorWidth: 2,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      barHeight: 0.8,
      normalize: true,
      backend: "MediaElement",
      renderFunction: utils.renderWaveform,
      url: src,
      plugins: [regionsPlugin],
    })

    player.setVolume(volume.value)
    player.setPlaybackRate(playbackRate.value)
    player.setMuted(isMuted.value)

    player.on("ready", onPlayerReady)
    player.on("timeupdate", onPlayerTimeUpdate)
    player.on("play", onPlayerPlay)
    player.on("pause", onPlayerPause)
    player.on("finish", onPlayerFinish)
    player.on("error", onPlayerError)

    wavesurfer.value = player
  }

  function destroy(): void {
    detachEventListeners()
    clearAllRegions()
    if (wavesurfer.value) {
      wavesurfer.value.destroy()
      wavesurfer.value = null
      regions.value = null
    }
  }

  // ── Public controls ──────────────────────────────────────────────────

  function play(): void {
    wavesurfer.value?.play()
  }

  function pause(): void {
    wavesurfer.value?.pause()
  }

  function togglePlay(): void {
    wavesurfer.value?.playPause()
  }

  function seekTo(time: number): void {
    const player = wavesurfer.value
    if (!player || duration.value === 0) return
    player.setTime(Math.max(0, Math.min(time, duration.value)))
  }

  function skip(seconds: number): void {
    seekTo(currentTime.value + seconds)
  }

  function setVolume(v: number): void {
    const player = wavesurfer.value
    if (!player) return
    volume.value = v
    player.setVolume(v)
    if (v > 0 && isMuted.value) {
      isMuted.value = false
      player.setMuted(false)
    }
  }

  function toggleMute(): void {
    const player = wavesurfer.value
    if (!player) return
    isMuted.value = !isMuted.value
    player.setMuted(isMuted.value)
  }

  function setPlaybackRate(rate: number): void {
    const player = wavesurfer.value
    if (!player) return
    playbackRate.value = rate
    player.setPlaybackRate(rate)
  }

  function cyclePlaybackRate(): void {
    const currentIndex = PLAYBACK_RATES.indexOf(
      playbackRate.value as (typeof PLAYBACK_RATES)[number],
    )
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length
    setPlaybackRate(PLAYBACK_RATES[nextIndex] ?? 1)
  }

  // ── Wiring ───────────────────────────────────────────────────────────

  watch(
    [containerRef, audioSrc],
    ([container, src]) => {
      if (container && src) {
        initWaveSurfer(container, src)
      }
    },
    { immediate: true },
  )

  audio.setSeekHandler(seekTo)
  audio.setPauseHandler(pause)

  onBeforeUnmount(() => {
    audio.setSeekHandler(null)
    audio.setPauseHandler(null)
    destroy()
  })

  return {
    currentTime,
    duration,
    isPlaying,
    isReady,
    isLoading,
    loadError,
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
