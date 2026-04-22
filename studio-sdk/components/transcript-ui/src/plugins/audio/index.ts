import { ref, computed, watch, watchEffect } from "vue"
import type { Core, CorePlugin, AudioPluginApi } from "../../core/types"
import type { AudioSource } from "../../types/editor"
import { findActiveWord, hasWordTimestamps } from "../../utils/words"

export type { AudioPluginApi }

export interface AudioPluginOptions {
  /**
   * Résout une `AudioSource` en URL jouable. Permet à l'hôte d'ajouter un
   * bearer token, de fetch en blob puis `URL.createObjectURL`, etc.
   * Si absent, `source.src` est utilisé tel quel.
   *
   * Toute URL `blob:` retournée est révoquée automatiquement au changement
   * de source ou au destroy du plugin.
   */
  resolveSrc?: (source: AudioSource) => string | Promise<string>
}

export function createAudioPlugin(options: AudioPluginOptions = {}): CorePlugin {
  return {
    name: "audio",

    install(core: Core) {
      const currentTime = ref(0)
      const isPlaying = ref(false)
      const activeWordId = ref<string | null>(null)
      const activeTurnId = ref<string | null>(null)
      let seekHandler: ((time: number) => void) | null = null

      const rawSource = computed(
        () => core.activeChannel.value?.activeTranslation.value.audio ?? null,
      )

      const resolvedSrc = ref<string | null>(null)
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
          if (!source) return

          try {
            const url = options.resolveSrc
              ? await options.resolveSrc(source)
              : source.src
            resolvedSrc.value = url
            if (url.startsWith("blob:")) ownedObjectUrl = url
          } catch (err) {
            console.error("[audio] resolveSrc failed", err)
          }
        },
        { immediate: true },
      )

      const src = computed(() => resolvedSrc.value)

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
        stopSourceWatch()
        stopTracker()
        revokeOwned()
        core.audio = undefined
      }
    },
  }
}
