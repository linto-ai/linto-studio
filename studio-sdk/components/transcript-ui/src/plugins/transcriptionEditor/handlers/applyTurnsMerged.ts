import type { TurnsMerged } from "../../../core/types"
import type { EditorPluginState } from "../types"
import { findTranslationStore } from "../tools/findTranslationStore"
import { toStoreTurn } from "../tools/toStoreTurn"

/** Apply a merge broadcast: replace the surviving turn by the merged result,
 *  drop the other — adjacency makes the final position identical either way. */
export function applyTurnsMerged(
  state: EditorPluginState,
  merge: TurnsMerged,
): void {
  // Server-side both turns were lock-free, but stay defensive: never rewrite
  // under the user's caret.
  if (
    state.editingRef &&
    state.editingRef.translationId === merge.translationId &&
    (state.editingRef.turnId === merge.mergedTurnId ||
      state.editingRef.turnId === merge.removedTurnId)
  ) {
    return
  }

  const store = findTranslationStore(state.core, merge.translationId)
  // Unknown turn also covers a NOT-YET-LOADED track (lazy loading): its
  // later fetch reads Mongo, which already contains the merge.
  if (!store || !store.hasTurn(merge.mergedTurnId)) return

  const mergedTurn = toStoreTurn(merge.turn)
  store.setTurns(
    store.turns.value.flatMap((turn) => {
      if (turn.id === merge.mergedTurnId) return [mergedTurn]
      if (turn.id === merge.removedTurnId) return []
      return [turn]
    }),
  )
}
