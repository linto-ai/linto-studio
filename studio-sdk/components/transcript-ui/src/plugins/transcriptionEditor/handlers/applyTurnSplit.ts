import type { TurnSplit } from "../../../core/types"
import type { Turn } from "../../../types/editor"
import type { EditorPluginState } from "../types"
import { wordsFromApi } from "../../../utils/turnWords"
import { findTranslationStore } from "../tools/findTranslationStore"

function toStoreTurn(wire: TurnSplit["turns"][number]): Turn {
  const words = wordsFromApi(wire.turnId, wire.words)
  return {
    id: wire.turnId,
    speakerId: wire.speakerId ?? null,
    // Turn contract: text carries the content only when words is empty.
    text: words.length > 0 ? null : wire.text,
    words,
    ...(wire.stime !== undefined && { startTime: wire.stime }),
    ...(wire.etime !== undefined && { endTime: wire.etime }),
    language: wire.language ?? "",
  }
}

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
