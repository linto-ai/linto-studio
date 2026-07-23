import type { TurnSplit } from "../../../core/types"
import type { EditorPluginState } from "../types"
import { findTranslationStore } from "../tools/findTranslationStore"
import { toStoreTurn } from "../tools/toStoreTurn"

/** Apply a turn split broadcast by the server: replace the original turn by
 *  its two halves, in place. */
export function applyTurnSplit(
  state: EditorPluginState,
  split: TurnSplit,
): void {
  // The lock makes a concurrent edit of the split turn impossible, but stay
  // defensive: never rewrite under the user's caret.
  if (
    state.editingRef &&
    state.editingRef.turnId === split.originalTurnId &&
    state.editingRef.translationId === split.translationId
  ) {
    return
  }

  const store = findTranslationStore(state.core, split.translationId)
  // Unknown turn also covers a NOT-YET-LOADED track (lazy loading): its
  // later fetch reads Mongo, which already contains the split.
  if (!store || !store.hasTurn(split.originalTurnId)) return

  const halves = split.turns.map(toStoreTurn)
  store.setTurns(
    store.turns.value.flatMap((turn) =>
      turn.id === split.originalTurnId ? halves : [turn],
    ),
  )
}
