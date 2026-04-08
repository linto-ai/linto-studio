import { ref, computed, watchEffect } from "vue"
import type { Core, CorePlugin, AudioPluginApi } from "../../core/types"
import { findActiveWord, hasWordTimestamps } from "../../utils/words"

export type { AudioPluginApi }

export function createAudioPlugin(): CorePlugin {
  return {
    name: "audio",

    install(core: Core) {
      const currentTime = ref(0)
      const isPlaying = ref(false)
      const activeWordId = ref<string | null>(null)
      const activeTurnId = ref<string | null>(null)
      let seekHandler: ((time: number) => void) | null = null

      const src = computed(
        () => core.activeChannel.value?.activeTranslation.value.audio?.src ?? null,
      )

      // Source de vérité unique : calcule activeTurnId / activeWordId à chaque tick.
      // Pas de reset à null en pause : on conserve la dernière position connue.
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

      const api: AudioPluginApi = {
        currentTime,
        isPlaying,
        src,
        activeWordId,
        activeTurnId,
        seekTo,
        setSeekHandler,
      }

      core.audio = api

      return () => {
        stopTracker()
        core.audio = undefined
      }
    },
  }
}
