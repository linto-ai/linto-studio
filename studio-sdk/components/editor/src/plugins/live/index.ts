import type { EditorCore, EditorPlugin } from '../../core/types'
import type { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent, LivePluginApi } from './types'

export type { LivePluginApi, LivePartialEvent, LiveFinalEvent, LiveTranslationEvent }

export function createLivePlugin(): EditorPlugin & LivePluginApi {
  let editor: EditorCore | null = null

  function onPartial(event: LivePartialEvent): void {
    if (!editor) return
    editor.ensureSpeaker(event.speakerId)
    editor.setPartial(event.turnId, event.text)
  }

  function onFinal(event: LiveFinalEvent): void {
    if (!editor) return
    editor.ensureSpeaker(event.speakerId)

    const existingIdx = editor.activeDocument.value.turns.findIndex(
      t => t.id === event.turnId,
    )

    if (existingIdx !== -1) {
      editor.updateTurn(event.turnId, {
        speakerId: event.speakerId,
        text: event.text,
        rawText: event.text,
        words: event.words,
        startTime: event.startTime,
        endTime: event.endTime,
        language: event.language,
      })
    } else {
      editor.addTurn({
        id: event.turnId,
        speakerId: event.speakerId,
        text: event.text,
        rawText: event.text,
        words: event.words,
        startTime: event.startTime,
        endTime: event.endTime,
        language: event.language,
      })
    }

    editor.clearPartial(event.turnId)
  }

  function onTranslation(_event: LiveTranslationEvent): void {
    // Placeholder — translation handling will be implemented later
    console.warn('[live-plugin] onTranslation not yet implemented')
  }

  const plugin: EditorPlugin & LivePluginApi = {
    name: 'live',

    install(core: EditorCore) {
      editor = core
      return () => {
        editor = null
      }
    },

    onPartial,
    onFinal,
    onTranslation,
  }

  return plugin
}
