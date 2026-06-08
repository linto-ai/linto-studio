import { ref, shallowRef } from "vue"
import type {
  Core,
  CorePlugin,
  LivePluginApi,
  TranslationStore,
} from "../../core/types"
import type {
  LivePartialEvent,
  LiveFinalEvent,
  LiveTranslationEvent,
} from "./types"
import type { Turn } from "../../types/editor"
import { CROSS_TRANSLATION_ID } from "../../core/stores"
import { isSameLanguage } from "../../utils/isSameLanguage"

export type { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent }
export type { LivePluginApi }

function finalEventToSourceTurn(event: LiveFinalEvent): Turn {
  const hasWords = event.words.length > 0
  return {
    id: event.turnId,
    speakerId: event.speakerId,
    text: hasWords ? null : (event.text ?? null),
    words: event.words,
    startTime: event.startTime,
    endTime: event.endTime,
    startDate: event.startDate,
    endDate: event.endDate,
    language: event.language,
    sourceLanguage: event.language,
  }
}

function finalEventToTranslationTurn(
  event: LiveFinalEvent,
  tr: { text: string; language: string; sourceLanguage: string },
): Turn {
  return {
    id: event.turnId,
    speakerId: event.speakerId,
    text: tr.text,
    words: [],
    startTime: event.startTime,
    endTime: event.endTime,
    startDate: event.startDate,
    endDate: event.endDate,
    language: tr.language,
    sourceLanguage: tr.sourceLanguage,
  }
}

export function createLivePlugin(): CorePlugin {
  return {
    name: "live",

    install(core: Core) {
      const partial = shallowRef<string | null>(null)
      const hasLiveUpdate = ref(false)
      // Segment of the last original partial. Cross mode shows each segment in
      // the *other* language, so we only display a translated partial whose
      // segment matches this one.
      let lastOriginalPartialEvent: LivePartialEvent | null = null

      hasLiveUpdate.value = true

      function clearPartial(): void {
        // shallowRef detects the change on its own, no triggerRef needed
        partial.value = null
        lastOriginalPartialEvent = null
      }

      function isTranslationTrackFor(
        active: { languages: string[]; isSource: boolean },
        language: string,
      ): boolean {
        if (active.isSource) return false
        return active.languages.some((l) => isSameLanguage(l, language))
      }

      function onPartial(event: LivePartialEvent, channelId: string): void {
        if (core.activeChannelId.value !== channelId) return
        const channel = core.activeChannel.value
        if (!channel) return

        lastOriginalPartialEvent = event

        const activeTranslation = channel.activeTranslation.value

        // Only the original (source-language) partial flows through here.
        // Translated partials arrive via onTranslation, one per translation.
        if (activeTranslation.isSource && event.text != null) {
          partial.value = event.text
        }
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

      function updateOrCreateTurn(store: TranslationStore, turn: Turn): void {
        if (store.hasTurn(turn.id)) store.updateTurn(turn.id, turn)
        else store.addTurn(turn)
      }

      function onFinal(event: LiveFinalEvent, channelId: string): void {
        if (event.speakerId) core.speakers.ensure(event.speakerId)

        const channel = core.channels.get(channelId)
        if (!channel) {
          immediateClearPartial()
          return
        }

        if (event.text != null) {
          updateOrCreateTurn(
            channel.sourceTranslation,
            finalEventToSourceTurn(event),
          )
        }

        if (event.translations) {
          for (const tr of event.translations) {
            const trStore = channel.translations.get(tr.translationId)
            if (trStore)
              updateOrCreateTurn(
                trStore,
                finalEventToTranslationTurn(event, {
                  ...tr,
                  sourceLanguage: event.language,
                }),
              )
          }
        }

        const active = core.activeChannel.value?.activeTranslation.value
        if (active?.isSource) {
          immediateClearPartial()
        }
      }

      function prependFinal(event: LiveFinalEvent, channelId: string): void {
        prependFinalBatch([event], channelId)
      }

      function prependFinalBatch(
        events: LiveFinalEvent[],
        channelId: string,
      ): void {
        const channel = core.channels.get(channelId)
        if (!channel) return

        // Ensure all speakers at once
        const seen = new Set<string>()
        for (const event of events) {
          if (event.speakerId && !seen.has(event.speakerId)) {
            seen.add(event.speakerId)
            core.speakers.ensure(event.speakerId)
          }
        }

        // 1. Source turns — batch prepend
        const sourceTurns: Turn[] = []
        for (const event of events) {
          if (event.text != null) {
            sourceTurns.push(finalEventToSourceTurn(event))
          }
        }
        if (sourceTurns.length > 0) {
          channel.sourceTranslation.prependTurns(sourceTurns)
        }

        // 2. Translations — group by translationId, batch prepend each
        const translationTurns = new Map<string, Turn[]>()
        for (const event of events) {
          if (!event.translations) continue
          for (const tr of event.translations) {
            let list = translationTurns.get(tr.translationId)
            if (!list) {
              list = []
              translationTurns.set(tr.translationId, list)
            }
            list.push(
              finalEventToTranslationTurn(event, {
                ...tr,
                sourceLanguage: event.language,
              }),
            )
          }
        }
        for (const [translationId, turns] of translationTurns) {
          const trStore = channel.translations.get(translationId)
          if (trStore) trStore.prependTurns(turns)
        }
      }

      function immediateClearPartial(): void {
        cancelDeferredClear()
        clearPartial()
      }

      function onTranslation(_event: LiveTranslationEvent): void {
        const channel = core.activeChannel.value
        if (!channel) return
        const activeTranslation = channel.activeTranslation.value

        if (!_event.final) {
          if (activeTranslation.id === CROSS_TRANSLATION_ID) {
            if (
              _event.turnId === lastOriginalPartialEvent?.turnId &&
              !isSameLanguage(
                _event.language,
                lastOriginalPartialEvent?.language,
              )
            ) {
              partial.value = _event.text
            }
          } else if (isTranslationTrackFor(activeTranslation, _event.language)) {
            partial.value = _event.text
          }
          return
        }

        const trStore = channel.translations.get(_event.language)
        if (trStore) {
          const turn = finalEventToTranslationTurn(
            { ..._event, words: [] },
            _event,
          )
          // Emit (non-silent) when the track is visible: either it's the active
          // translation, or cross is active and relays this track's events.
          if (
            trStore === activeTranslation ||
            activeTranslation.id === CROSS_TRANSLATION_ID
          ) {
            updateOrCreateTurn(trStore, turn)
          } else {
            trStore.updateOrCreateTurnSilent(turn)
          }
        }
        if (
          isTranslationTrackFor(activeTranslation, _event.language) ||
          activeTranslation.id === CROSS_TRANSLATION_ID
        ) {
          immediateClearPartial()
        }
      }

      const api: LivePluginApi = {
        partial,
        hasLiveUpdate,
        onPartial,
        onFinal,
        prependFinal,
        prependFinalBatch,
        onTranslation,
      }

      const unsubChannelChange = core.on(
        "channel:change",
        immediateClearPartial,
      )
      const unsubTranslationChange = core.on(
        "translation:change",
        immediateClearPartial,
      )
      const unsubTranslationSync = core.on(
        "translation:sync",
        deferredClearPartial,
      )
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
