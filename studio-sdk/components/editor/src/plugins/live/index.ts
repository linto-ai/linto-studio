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

      function clearPartial(): void {
        partial.value = null
        triggerRef(partial)
      }

      function onPartial(event: LivePartialEvent, channelId: string): void {
        if (core.activeChannelId.value !== channelId) return

        const activeTranslation = core.activeChannel.activeTranslation.data.value

        if (activeTranslation.isSource) {
          if (event.text == null) return
          partial.value = event.text
        } else if (event.translations) {
          const match = event.translations.find(
            (t) => t.translationId === activeTranslation.id,
          )
          partial.value = match?.text ?? null
        } else {
          return
        }

        triggerRef(partial)
      }

      function onFinal(event: LiveFinalEvent, channelId: string): void {
        if (event.speakerId) core.speakers.ensure(event.speakerId)

        // 1. Source turn — only if text is provided
        if (event.text != null) {
          const hasWords = event.words.length > 0
          const turnData = {
            speakerId: event.speakerId,
            text: hasWords ? null : event.text,
            words: event.words,
            startTime: event.startTime,
            endTime: event.endTime,
            language: event.language,
          }

          const sourceHandle = core.withTranslation({ channelId })
          if (sourceHandle) {
            const exists = sourceHandle.turns.value.some(
              (t) => t.id === event.turnId,
            )
            if (exists) sourceHandle.updateTurn(event.turnId, turnData)
            else sourceHandle.addTurn({ id: event.turnId, ...turnData })
          }
        }

        // 2. Translations
        if (event.translations) {
          for (const tr of event.translations) {
            const handle = core.withTranslation({
              channelId,
              translationId: tr.translationId,
            })
            if (!handle) continue

            const trTurnData = {
              speakerId: event.speakerId,
              text: tr.text,
              words: [],
              startTime: event.startTime,
              endTime: event.endTime,
              language: tr.language,
            }

            const exists = handle.turns.value.some(
              (t) => t.id === event.turnId,
            )
            if (exists) handle.updateTurn(event.turnId, trTurnData)
            else handle.addTurn({ id: event.turnId, ...trTurnData })
          }
        }

        clearPartial()
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

      const unsubChannelChange = core.on("channel:change", clearPartial)
      const unsubTranslationChange = core.on("translation:change", clearPartial)
      const unsubTranslationSync = core.on("translation:sync", clearPartial)
      const unsubChannelSync = core.on("channel:sync", clearPartial)

      core.live = api

      return () => {
        unsubChannelChange()
        unsubTranslationChange()
        unsubTranslationSync()
        unsubChannelSync()
        core.live = undefined
      }
    },
  }
}
