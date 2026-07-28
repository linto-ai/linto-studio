import type { EditorPluginState } from "../types"
import { saveTurn } from "./saveTurn"
import { computeTurnPlainText } from "../../../utils/computeTurnPlainText"
import { computeOffsetInNormalizedText } from "../tools/computeOffsetInNormalizedText"
import { computeUpdatedTurnFields } from "../tools/computeUpdatedTurnFields"
import { exitEditMode } from "../tools/exitEditMode"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushSaveThenUnlock } from "../tools/pushSaveThenUnlock"
import { pushSplitSequence } from "../tools/pushSplitSequence"
import { pushUnlock } from "../tools/pushUnlock"

/**
 * Enter gesture: commit the text (optimistic, like saveTurn), then ask the
 * server to split at the caret. The split itself is NOT applied locally —
 * the turn_split broadcast is the single application path (no duplicated
 * cut logic client-side).
 */
export function splitTurn(
  state: EditorPluginState,
  text: string,
  offset: number,
): void {
  // Enter on an emptied turn is a commit, not a split: saveTurn owns the
  // emptied-means-deleted rule (and its last-turn guard).
  if (text.replace(/\s+/g, " ").trim() === "") {
    saveTurn(state, text)
    return
  }

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
  const textChanged = normalized !== computeTurnPlainText(turn)
  if (textChanged) {
    store.updateTurn(
      turnId,
      computeUpdatedTurnFields(turnId, normalized, turn.words),
    )
  }

  // A caret at the very start/end would produce an empty half: degrade to a
  // plain save (the server refuses border offsets anyway).
  const normalizedOffset = computeOffsetInNormalizedText(text, offset)
  if (normalizedOffset <= 0 || normalizedOffset >= normalized.length) {
    if (textChanged) {
      void pushSaveThenUnlock(state.options, {
        translationId: store.id,
        turnId,
        text: normalized,
      })
    } else if (target) {
      void pushUnlock(state.options, target)
    }
    return
  }

  void pushSplitSequence(state.options, {
    translationId: store.id,
    turnId,
    text: normalized,
    offset: normalizedOffset,
    textChanged,
  })
}
