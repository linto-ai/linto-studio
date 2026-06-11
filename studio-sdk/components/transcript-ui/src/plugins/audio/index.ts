import { ref, computed, watch, watchEffect } from "vue"
import type { Core, CorePlugin, AudioPluginApi } from "../../core/types"
import type { AudioSource } from "../../types/editor"
import { findActiveWord, hasWordTimestamps } from "../../utils/words"

export type { AudioPluginApi }

export interface AudioPluginOptions {
  /**
   * Resolves an `AudioSource` into a playable URL. Lets the host add a
   * bearer token, fetch as a blob then `URL.createObjectURL`, etc.
   * When absent, `source.src` is used as is.
   *
   * Any returned `blob:` URL is revoked automatically when the source
   * changes or the plugin is destroyed.
   */
  resolveSrc?: (source: AudioSource) => string | Promise<string>

  /**
   * Resolves precomputed waveform peaks for an `AudioSource` (e.g. fetched
   * from the API). Raw amplitude values, any scale — the player normalizes
   * them. Return null (or throw) to fall back to client-side decoding.
   */
  resolveWaveform?: (
    source: AudioSource,
  ) => number[] | null | Promise<number[] | null>
}

export function createAudioPlugin(
  options: AudioPluginOptions = {},
): CorePlugin {
  return {
    name: "audio",

    install(core: Core) {
      const currentTime = ref(0)
      const isPlaying = ref(false)
      const activeWordId = ref<string | null>(null)
      const activeTurnId = ref<string | null>(null)
      let seekHandler: ((time: number) => void) | null = null
      let pauseHandler: (() => void) | null = null

      const rawSource = computed(
        () => core.activeChannel.value?.activeTranslation.value.audio ?? null,
      )

      const resolvedSrc = ref<string | null>(null)
      const waveform = ref<number[] | null>(null)
      let ownedObjectUrl: string | null = null

      function revokeOwned() {
        if (ownedObjectUrl) {
          URL.revokeObjectURL(ownedObjectUrl)
          ownedObjectUrl = null
        }
      }

      const stopSourceWatch = watch(
        rawSource,
        async (source) => {
          revokeOwned()
          resolvedSrc.value = null
          waveform.value = null
          if (!source) return

          // Resolved alongside the src; a failure here only disables the
          // precomputed waveform, never the audio itself.
          const waveformPromise = options.resolveWaveform
            ? Promise.resolve(options.resolveWaveform(source)).catch((err) => {
                console.warn("[audio] resolveWaveform failed", err)
                return null
              })
            : Promise.resolve(null)

          try {
            const [url, peaks] = await Promise.all([
              options.resolveSrc
                ? options.resolveSrc(source)
                : Promise.resolve(source.src),
              waveformPromise,
            ])
            // Peaks are set before the src: the player creates WaveSurfer
            // when the src changes and reads the waveform at that point.
            waveform.value = peaks?.length ? peaks : null
            resolvedSrc.value = url
            if (url.startsWith("blob:")) ownedObjectUrl = url
          } catch (err) {
            console.error("[audio] resolveSrc failed", err)
          }
        },
        { immediate: true },
      )

      const src = computed(() => resolvedSrc.value)

      // Single source of truth: computes activeTurnId / activeWordId on every tick.
      // No reset to null on pause: the last known position is kept.
      const stopTracker = watchEffect(() => {
        if (!isPlaying.value) return
        const time = currentTime.value
        const translation = core.activeChannel.value?.activeTranslation.value
        if (!translation) return

        for (const turn of translation.turns.value) {
          if (
            turn.startTime != null &&
            turn.endTime != null &&
            time >= turn.startTime &&
            time <= turn.endTime
          ) {
            activeTurnId.value = turn.id
            activeWordId.value = hasWordTimestamps(turn.words)
              ? findActiveWord(turn.words, time)
              : null
            return
          }
        }
      })

      function seekTo(time: number) {
        seekHandler?.(time)
      }

      function setSeekHandler(fn: ((time: number) => void) | null) {
        seekHandler = fn
      }

      function pause() {
        pauseHandler?.()
      }

      function setPauseHandler(fn: (() => void) | null) {
        pauseHandler = fn
      }

      const api: AudioPluginApi = {
        currentTime,
        isPlaying,
        src,
        waveform,
        activeWordId,
        activeTurnId,
        seekTo,
        setSeekHandler,
        pause,
        setPauseHandler,
      }

      core.audio = api

      return () => {
        stopSourceWatch()
        stopTracker()
        revokeOwned()
        core.audio = undefined
      }
    },
  }
}
