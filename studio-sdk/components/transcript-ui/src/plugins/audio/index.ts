import { ref, computed, watch, watchEffect } from "vue"
import type { Core, CorePlugin, AudioPluginApi } from "../../core/types"
import type { AudioSource } from "../../types/editor"
import { findActiveWord, firstWordStart, lastWordEnd } from "../../utils/words"

export type { AudioPluginApi }

/**
 * Minimum playback progress (in seconds of media time) between two
 * activeWordId computations. Playback ticks ~60 Hz but the active word only
 * changes at word boundaries (~4 Hz), so recomputing every frame is wasted
 * work. Keep it well under a spoken word's duration so the highlight never
 * lags perceptibly.
 */
const WORD_TRACK_INTERVAL = 0.05

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

      // Media time of the last activeWordId computation, used to throttle.
      // -Infinity forces a compute on the first tick after playback starts.
      let lastComputeTime = Number.NEGATIVE_INFINITY

      // Single source of truth: computes activeTurnId / activeWordId.
      // No reset to null on pause: the last known position is kept.
      const stopTracker = watchEffect(() => {
        // Read BOTH refs unconditionally so the effect tracks currentTime even
        // while paused — otherwise seeking/scrubbing (e.g. clicking a word)
        // while paused would never move the highlight.
        const time = currentTime.value
        const playing = isPlaying.value

        // Throttle only during continuous playback (the word can't have changed
        // within WORD_TRACK_INTERVAL). A backward jump is negative and falls
        // through; while paused, any seek recomputes.
        if (playing) {
          const elapsed = time - lastComputeTime
          if (elapsed >= 0 && elapsed < WORD_TRACK_INTERVAL) return
        }
        lastComputeTime = time

        const translation = core.activeChannel.value?.activeTranslation.value
        if (!translation) return

        for (const turn of translation.turns.value) {
          // Derive the turn's span from its words: after a split, the turn
          // attrs go stale (the first half keeps the whole original span, the
          // second half has none), which would overlap and pick the wrong turn.
          // The words carry the correct per-wid timestamps, so trust them and
          // only fall back to the turn attrs for word-less (live) turns.
          // First/last DEFINED word times: robust to words with no timestamp
          // (freshly typed, or split/merge products) sitting anywhere, and to
          // the stale turn attrs after a split. Fall back to the turn attrs for
          // fully word-less (live text-only) turns.
          const words = turn.words
          const start = firstWordStart(words) ?? turn.startTime
          const end = lastWordEnd(words) ?? turn.endTime
          if (start != null && end != null && time >= start && time <= end) {
            activeTurnId.value = turn.id
            // Returns null when no timestamped word matches (e.g. the playhead
            // sits over an untimed, just-typed word) — no stale highlight.
            activeWordId.value = findActiveWord(words, time)
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
