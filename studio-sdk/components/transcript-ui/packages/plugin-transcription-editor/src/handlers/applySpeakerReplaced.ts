import type { SpeakerReplaced } from "@linto-ai/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { removeSpeakerIfUnused } from "../tools/removeSpeakerIfUnused"
import { trackUndoRedoHeads } from "../tools/trackUndoRedoHeads"

/** Apply a speaker replacement broadcast by the server (a plain replace OR a
 *  redo replaying one — see trackUndoRedoHeads): reassign the track's turns, then
 *  drop the replaced speaker (implied removal). */
export function applySpeakerReplaced(
  state: EditorPluginState,
  replaced: SpeakerReplaced,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, replaced.translationId, replaced.version)) return

  // Defensive: reassigned turns must reference a known speaker even if this
  // client somehow missed the target's creation.
  state.core.speakers.ensure(replaced.toSpeakerId)

  const store = findTranslationStore(state.core, replaced.translationId)
  if (store) {
    for (const turn of store.turns.value) {
      if (turn.speakerId === replaced.fromSpeakerId) {
        store.updateTurn(turn.id, { speakerId: replaced.toSpeakerId })
      }
    }
  }

  removeSpeakerIfUnused(state.core, replaced.fromSpeakerId)
  trackUndoRedoHeads(
    state,
    replaced.translationId,
    replaced.revisionId,
    replaced.redoRevisionId,
  )
}
