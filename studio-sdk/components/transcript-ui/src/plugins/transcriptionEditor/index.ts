import { ref } from "vue"
import type {
  Core,
  CorePlugin,
  TranslationStore,
  TranscriptionEditorPluginApi,
} from "../../core/types"
import { wordsFromText, carryWordTimes } from "../../utils/turnWords"
import { computeTurnPlainText } from "../../utils/computeTurnPlainText"

export interface TranscriptionEditorSavePayload {
  /** Id of the edited language track — the child conversation on the backend. */
  translationId: string
  turnId: string
  text: string
}

export interface TranscriptionEditorOptions {
  /**
   * Host-provided commit: push a saved turn to the backend. The edit is
   * applied locally BEFORE this resolves (optimistic — blur must feel
   * instant); a failure is logged, the server broadcasts reconcile later.
   */
  saveTurn?: (
    payload: TranscriptionEditorSavePayload,
  ) => Promise<{ ok: boolean; reason?: string }>
}

/**
 * Per-turn plain-text editing (the lock+save model — see the "Editor v2"
 * design). One turn is edited at a time; the read view stays untouched for
 * every other turn.
 *
 * Edits are committed locally into the TurnStore, then pushed to the host's
 * saveTurn handler when provided (local-only otherwise: dev harness, viewer).
 */
export function createTranscriptionEditorPlugin(
  options: TranscriptionEditorOptions = {},
): CorePlugin {
  return {
    name: "transcriptionEditor",
    install(core: Core) {
      const editingTurnId = ref<string | null>(null)
      const editingCaretOffset = ref(0)

      // The edited text belongs to ONE language track: the active translation
      // (cross mode has no mutable store and is not editable).
      function getActiveTranslationStore(): TranslationStore | undefined {
        const channel = core.activeChannel.value
        if (!channel) return undefined
        return channel.translations.get(channel.activeTranslation.value.id)
      }

      function beginEdit(turnId: string, caretOffset = 0): void {
        if (core.capabilities.value.text !== "edit") return
        if (!getActiveTranslationStore()?.hasTurn(turnId)) return
        editingTurnId.value = turnId
        editingCaretOffset.value = caretOffset
      }

      function cancelEdit(): void {
        editingTurnId.value = null
      }

      function pushToHost(payload: {
        translationId: string
        turnId: string
        text: string
      }): void {
        if (!options.saveTurn) return
        options.saveTurn(payload).then(
          (ack) => {
            if (!ack?.ok) {
              console.error(
                `[transcriptionEditor] save rejected for turn ${payload.turnId}: ${ack?.reason ?? "unknown"}`,
              )
            }
          },
          (err) => {
            console.error(
              `[transcriptionEditor] save failed for turn ${payload.turnId}:`,
              err,
            )
          },
        )
      }

      function saveTurn(text: string): void {
        const turnId = editingTurnId.value
        if (turnId === null) return
        editingTurnId.value = null

        const store = getActiveTranslationStore()
        const turn = store?.getTurn(turnId)
        if (!store || !turn) return

        // Same whitespace contract as the server: single spaces, no
        // leading/trailing runs — client and server tokenize identically.
        const normalized = text.replace(/\s+/g, " ").trim()
        // Blur commits unconditionally; an untouched turn must not produce a
        // store update nor a server round-trip.
        if (normalized === computeTurnPlainText(turn)) return

        const words = carryWordTimes(wordsFromText(turnId, normalized), turn.words)
        store.updateTurn(turnId, {
          // Turn contract: text carries the content only when words is empty.
          text: words.length > 0 ? null : normalized,
          words,
        })
        pushToHost({ translationId: store.id, turnId, text: normalized })
      }

      // Enter gesture: commit the text now; the actual split (word partition,
      // proportional cut of the straddled word) arrives with the server side.
      function splitTurn(text: string, _offset: number): void {
        saveTurn(text)
      }

      const api: TranscriptionEditorPluginApi = {
        editingTurnId,
        editingCaretOffset,
        beginEdit,
        cancelEdit,
        saveTurn,
        splitTurn,
      }
      core.transcriptionEditor = api
    },
  }
}
