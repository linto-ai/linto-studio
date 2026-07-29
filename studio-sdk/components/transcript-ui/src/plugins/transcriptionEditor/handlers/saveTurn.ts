import type { EditorPluginState } from "../types"
import { computeTurnPlainText } from "../../../utils/computeTurnPlainText"
import { computeUpdatedTurnFields } from "../tools/computeUpdatedTurnFields"
import { exitEditMode } from "../tools/exitEditMode"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushDeleteThenUnlock } from "../tools/pushDeleteThenUnlock"
import { pushSaveThenUnlock } from "../tools/pushSaveThenUnlock"
import { pushUnlock } from "../tools/pushUnlock"

/** Commit the edited text: optimistic local apply, then the sequenced
 *  network push (save, then unlock). */
export function saveTurn(state: EditorPluginState, text: string): void {
  const turnId = state.editingTurnId.value
  if (turnId === null) return
  const target = exitEditMode(state)

  const store = getActiveTranslationStore(state.core)
  const turn = store?.getTurn(turnId)
  if (!store || !turn) {
    if (target) void pushUnlock(state.options, target)
    return
  }

  // Same whitespace contract as the server: single spaces, no
  // leading/trailing runs — client and server tokenize identically.
  const normalized = text.replace(/\s+/g, " ").trim()

  // Committing an EMPTIED text means deleting the turn (there is no delete
  // button: the gesture IS the deletion) — except the track's last turn,
  // which reverts instead (a track never goes empty).
  if (normalized === "") {
    if (store.turns.value.length <= 1) {
      if (target) void pushUnlock(state.options, target)
      return
    }
    if (!state.options.deleteTurn) {
      store.removeTurn(turnId)
      return
    }
    void pushDeleteThenUnlock(state.options, {
      translationId: store.id,
      turnId,
    })
    return
  }

  // An untouched turn produces no store update nor server save — but the
  // lock must still be released.
  if (normalized === computeTurnPlainText(turn)) {
    if (target) void pushUnlock(state.options, target)
    return
  }

  store.updateTurn(
    turnId,
    computeUpdatedTurnFields(turnId, normalized, turn.words),
  )
  void pushSaveThenUnlock(state.options, {
    translationId: store.id,
    turnId,
    text: normalized,
  })
}
