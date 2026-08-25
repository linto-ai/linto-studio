import type { TurnSplit } from "@linto/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { toStoreTurn } from "../tools/toStoreTurn"

/** Apply a turn split broadcast by the server: replace the original turn by
 *  its two halves, in place. */
export function applyTurnSplit(
  state: EditorPluginState,
  split: TurnSplit,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, split.translationId, split.version)) return

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

  // setTurns emits no turn events (it is also the loading path, which must
  // stay silent): emit them here so hosts see the split as an edit — e.g.
  // to flag the generated summary as outdated.
  for (const half of halves) {
    if (half.id === split.originalTurnId) {
      state.core.emit("turn:update", {
        turn: half,
        translationId: split.translationId,
      })
    } else {
      state.core.emit("turn:add", {
        turn: half,
        translationId: split.translationId,
      })
    }
  }
}
