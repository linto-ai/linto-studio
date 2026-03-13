import { ref, shallowRef, triggerRef } from "vue"
import type { EditorCore, EditorPlugin, LivePluginApi } from "../../core/types"
import type {
  LivePartialEvent,
  LiveFinalEvent,
  LiveTranslationEvent,
} from "./types"

export type {
  LivePartialEvent,
  LiveFinalEvent,
  LiveTranslationEvent,
}
export type { LivePluginApi }

export function createLivePlugin(): EditorPlugin {
  return {
    name: "live",

    install(core: EditorCore) {
      const partial = shallowRef<string | null>(null)
      const hasLiveUpdate = ref(false)

      hasLiveUpdate.value = true

      function onPartial(event: LivePartialEvent, channelId: string): void {
        if (core.activeChannelId.value !== channelId) return
        partial.value = event.text
        triggerRef(partial)
      }

      function onFinal(event: LiveFinalEvent, channelId: string): void {
        core.speakers.ensure(event.speakerId)

        const target = { channelId }
        const hasWords = event.words.length > 0

        const turnData = {
          speakerId: event.speakerId,
          text: hasWords ? null : event.text,
          words: event.words,
          startTime: event.startTime,
          endTime: event.endTime,
          language: event.language,
        }

        const handle = core.withTranslation(target)
        if (!handle) return

        const exists = handle.turns.value.some((t) => t.id === event.turnId)

        if (exists) {
          handle.updateTurn(event.turnId, turnData)
        } else {
          handle.addTurn({ id: event.turnId, ...turnData })
        }

        // Clear partial
        partial.value = null
        triggerRef(partial)
      }

      function onTranslation(_event: LiveTranslationEvent): void {
        // Placeholder — translation handling will be implemented later
        console.warn("[live-plugin] onTranslation not yet implemented")
      }

      const api: LivePluginApi = {
        partial,
        hasLiveUpdate,
        onPartial,
        onFinal,
        onTranslation,
      }

      core.live = api

      return () => {
        core.live = undefined
      }
    },
  }
}
