import { ref, shallowRef } from "vue"
import type {
  Core,
  CorePlugin,
  LivePluginApi,
  TranslationInfo,
  TranslationStore,
  Turn,
} from "@linto-ai/transcript-ui-core"
import { CROSS_TRANSLATION_ID, utils } from "@linto-ai/transcript-ui-core"
import type {
  LivePartialEvent,
  LiveFinalEvent,
  LiveTranslationEvent,
} from "./types"

const { isSameLanguage, speakText, stopTTS, unlockTTS, isTTSSupported, hasVoices } = utils

/** ASRs can go quiet for a few seconds between the last partial and the final
 *  while someone is still talking: long enough to bridge that gap, so the
 *  indicator doesn't blink in the middle of a speech. */
const DEFAULT_SILENCE_DELAY = 6000

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

export interface LivePluginOptions {
  /** Whether the voice-playback feature is offered at all. */
  tts?: boolean
  /** Milliseconds without a partial before speech counts as over. See
   *  LivePluginApi.silenceDelay — ASRs differ in how often they emit, so
   *  hosts tune it per backend. Defaults to 6s. */
  silenceDelay?: number
}

export function createLivePlugin(
  options: LivePluginOptions = {},
): CorePlugin {
  // Deployment flag: whether the voice-playback feature is offered at all.
  const ttsAvailable = options.tts ?? false

  return {
    name: "live",

    install(core: Core) {
      const partial = shallowRef<string | null>(null)
      const partialsVisible = ref(true)
      const isSpeechActive = ref(false)
      const silenceDelay = ref(options.silenceDelay ?? DEFAULT_SILENCE_DELAY)
      let silenceTimeout: ReturnType<typeof setTimeout> | null = null
      const hasLiveUpdate = ref(false)
      // Voice playback of finalized turns (browser speech synthesis).
      const ttsEnabled = ref(false)
      // Usable = supported AND a voice installed (voices load async).
      const ttsSupported = isTTSSupported()
      const ttsReady = ref(false)
      function refreshTTSReady(): void {
        ttsReady.value = hasVoices()
      }
      if (ttsSupported) {
        refreshTTSReady()
        window.speechSynthesis.addEventListener("voiceschanged", refreshTTSReady)
      }
      // Segment of the last original partial. Cross mode shows each segment in
      // the *other* language, so we only display a translated partial whose
      // segment matches this one.
      let lastOriginalPartialEvent: LivePartialEvent | null = null

      hasLiveUpdate.value = true

      // Partials are the only sign that someone is talking, and nothing on
      // the wire ever announces silence — it is only the absence of the next
      // one. Each partial pushes the deadline back, so the state doesn't
      // flicker off between two sentences.
      function markSpeechActivity(): void {
        isSpeechActive.value = true
        if (silenceTimeout !== null) clearTimeout(silenceTimeout)
        silenceTimeout = setTimeout(endSpeechActivity, silenceDelay.value)
      }

      function endSpeechActivity(): void {
        if (silenceTimeout !== null) {
          clearTimeout(silenceTimeout)
          silenceTimeout = null
        }
        isSpeechActive.value = false
      }

      function clearPartial(): void {
        // shallowRef detects the change on its own, no triggerRef needed
        partial.value = null
        lastOriginalPartialEvent = null
      }

      // The single door every partial goes through — source, translation and
      // cross alike — so one setting closes it for the transcription panel
      // and the subtitle scroller at once. Ignored while they are hidden.
      function setPartial(text: string): void {
        if (!partialsVisible.value) return
        partial.value = text
      }

      function showPartials(): void {
        partialsVisible.value = true
      }

      function hidePartials(): void {
        partialsVisible.value = false
        // Drop what is already on screen now, rather than leaving the last
        // provisional line up until a final turn happens to replace it.
        immediateClearPartial()
      }

      function isTranslationTrackFor(
        active: TranslationInfo,
        language: string,
      ): boolean {
        if (active.isSource) return false
        return active.languages.some((l) => isSameLanguage(l, language))
      }

      function onPartial(event: LivePartialEvent, channelId: string): void {
        if (core.activeChannelId.value !== channelId) return
        const channel = core.activeChannel.value
        if (!channel) return

        // Someone is talking on the channel being watched — true whichever
        // track is displayed, and whether or not the text itself is shown.
        markSpeechActivity()

        lastOriginalPartialEvent = event

        const activeTranslation = channel.activeTranslation.value

        // Only the original (source-language) partial flows through here.
        // Translated partials arrive via onTranslation, one per translation.
        if (activeTranslation.isSource && event.text != null) {
          setPartial(event.text)
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

        if (
          ttsEnabled.value &&
          active?.isSource &&
          event.text != null &&
          core.activeChannelId.value === channelId
        ) {
          speakText(event.text, event.language)
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
          markSpeechActivity()

          if (activeTranslation.id === CROSS_TRANSLATION_ID) {
            if (
              _event.turnId === lastOriginalPartialEvent?.turnId &&
              !isSameLanguage(
                _event.language,
                lastOriginalPartialEvent?.language,
              )
            ) {
              setPartial(_event.text)
            }
          } else if (isTranslationTrackFor(activeTranslation, _event.language)) {
            setPartial(_event.text)
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
          // Read the translation in its own target language.
          if (ttsEnabled.value && _event.text) {
            speakText(_event.text, _event.language)
          }
        }
      }

      function enableTTS(): void {
        ttsEnabled.value = true
        // Unlock from within the user gesture so later playback is allowed.
        unlockTTS()
      }

      function disableTTS(): void {
        ttsEnabled.value = false
        stopTTS()
      }

      const api: LivePluginApi = {
        partial,
        partialsVisible,
        isSpeechActive,
        silenceDelay,
        showPartials,
        hidePartials,
        hasLiveUpdate,
        ttsAvailable,
        ttsEnabled,
        ttsReady,
        enableTTS,
        disableTTS,
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
        endSpeechActivity()
        stopTTS()
        if (ttsSupported) {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            refreshTTSReady,
          )
        }
        unsubChannelChange()
        unsubTranslationChange()
        unsubTranslationSync()
        unsubChannelSync()
        core.live = undefined
      }
    },
  }
}
