import type { TurnUpdate } from "../../../core/types"
import type { EditorPluginState } from "../types"
import { wordsFromApi } from "../../../utils/turnWords"
import { findTranslationStore } from "../tools/findTranslationStore"

/** Apply a saved turn broadcast by the server (any track, any author). */
export function applyTurnUpdate(
  state: EditorPluginState,
  update: TurnUpdate,
): void {
  // Never rewrite under the user's caret: applying would re-render the
  // contenteditable's text and destroy the typing in progress. The next save
  // recomputes server-side anyway. (Compared on the exact edit — turn ids
  // are shared across a channel's translations.)
  if (
    state.editingRef &&
    state.editingRef.turnId === update.turnId &&
    state.editingRef.translationId === update.translationId
  ) {
    return
  }

  const store = findTranslationStore(state.core, update.translationId)
  // Unknown turn also covers a NOT-YET-LOADED track (lazy loading): writing
  // into an empty store would make it look loaded. Its later fetch reads
  // Mongo, which already contains this update.
  if (!store || !store.hasTurn(update.turnId)) return

  const words = wordsFromApi(update.turnId, update.words)
  store.updateTurn(update.turnId, {
    // Turn contract: text carries the content only when words is empty.
    text: words.length > 0 ? null : update.text,
    words,
    ...(update.stime !== undefined && { startTime: update.stime }),
    ...(update.etime !== undefined && { endTime: update.etime }),
  })
}
