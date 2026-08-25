import type { TurnsMerged } from "@linto/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { toStoreTurn } from "../tools/toStoreTurn"

/** Apply a merge broadcast: replace the surviving turn by the merged result,
 *  drop the other — adjacency makes the final position identical either way. */
export function applyTurnsMerged(
  state: EditorPluginState,
  merge: TurnsMerged,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, merge.translationId, merge.version)) return

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

  // setTurns emits no turn events (it is also the loading path, which must
  // stay silent): emit them here so hosts see the merge as an edit — e.g.
  // to flag the generated summary as outdated.
  state.core.emit("turn:update", {
    turn: mergedTurn,
    translationId: merge.translationId,
  })
  state.core.emit("turn:remove", {
    turnId: merge.removedTurnId,
    translationId: merge.translationId,
  })
}
