import type { TurnDeleted } from "@linto/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { removeSpeakerIfUnused } from "../tools/removeSpeakerIfUnused"

/** Apply a turn deletion broadcast by the server, including its GC
 *  consequence (removedSpeakerId rides the broadcast). */
export function applyTurnDeleted(
  state: EditorPluginState,
  deleted: TurnDeleted,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, deleted.translationId, deleted.version)) return

  // The lock makes deleting a turn being edited elsewhere impossible, but
  // stay defensive: never pull a turn out from under the user's caret.
  if (
    state.editingRef &&
    state.editingRef.turnId === deleted.turnId &&
    state.editingRef.translationId === deleted.translationId
  ) {
    return
  }

  const store = findTranslationStore(state.core, deleted.translationId)
  // Unknown turn also covers a NOT-YET-LOADED track (lazy loading): its
  // later fetch reads Mongo, which no longer contains the turn.
  if (!store || !store.hasTurn(deleted.turnId)) return

  store.removeTurn(deleted.turnId)
  if (deleted.removedSpeakerId) {
    removeSpeakerIfUnused(state.core, deleted.removedSpeakerId)
  }
}
