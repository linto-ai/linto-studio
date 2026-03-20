import { ref, shallowRef, triggerRef } from "vue"
import type { EditorStore, EditorPlugin, LivePluginApi } from "../../core/types"
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

    install(core: EditorStore) {
      const partial = shallowRef<string | null>(null)
      const hasLiveUpdate = ref(false)

      hasLiveUpdate.value = true

      function clearPartial(): void {
        partial.value = null
        triggerRef(partial)
      }

      function onPartial(event: LivePartialEvent, channelId: string): void {
        if (core.activeChannelId.value !== channelId) return

        const activeTranslation = core.activeChannel.value.activeTranslation.value

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

      let clearPartialTimeout: ReturnType<typeof setTimeout> | null = null

      function deferredClearPartial(): void {
        if (clearPartialTimeout !== null) return
        clearPartialTimeout = setTimeout(() => {
          clearPartialTimeout = null
          clearPartial()
        }, 150)
      }

      function cancelDeferredClear(): void {
        if (clearPartialTimeout !== null) {
          clearTimeout(clearPartialTimeout)
          clearPartialTimeout = null
        }
      }

      function onFinal(event: LiveFinalEvent, channelId: string): void {
        if (event.speakerId) core.speakers.ensure(event.speakerId)

        const channel = core.channels.get(channelId)

        // 1. Source turn — only if text is provided
        if (event.text != null && channel) {
          const hasWords = event.words.length > 0
          const turnData = {
            speakerId: event.speakerId,
            text: hasWords ? null : event.text,
            words: event.words,
            startTime: event.startTime,
            endTime: event.endTime,
            language: event.language,
          }

          const sourceStore = channel.sourceTranslation
          const exists = sourceStore.turns.value.some(
            (t) => t.id === event.turnId,
          )
          if (exists) sourceStore.updateTurn(event.turnId, turnData)
          else sourceStore.addTurn({ id: event.turnId, ...turnData })
        }

        // 2. Translations
        if (event.translations && channel) {
          for (const tr of event.translations) {
            const trStore = channel.translations.get(tr.translationId)
            if (!trStore) continue

            const trTurnData = {
              speakerId: event.speakerId,
              text: tr.text,
              words: [],
              startTime: event.startTime,
              endTime: event.endTime,
              language: tr.language,
            }

            const exists = trStore.turns.value.some(
              (t) => t.id === event.turnId,
            )
            if (exists) trStore.updateTurn(event.turnId, trTurnData)
            else trStore.addTurn({ id: event.turnId, ...trTurnData })
          }
        }

        immediateClearPartial()
      }

      function immediateClearPartial(): void {
        cancelDeferredClear()
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

      const unsubChannelChange = core.on("channel:change", immediateClearPartial)
      const unsubTranslationChange = core.on("translation:change", immediateClearPartial)
      const unsubTranslationSync = core.on("translation:sync", deferredClearPartial)
      const unsubChannelSync = core.on("channel:sync", deferredClearPartial)

      core.live = api

      return () => {
        immediateClearPartial()
        unsubChannelChange()
        unsubTranslationChange()
        unsubTranslationSync()
        unsubChannelSync()
        core.live = undefined
      }
    },
  }
}
