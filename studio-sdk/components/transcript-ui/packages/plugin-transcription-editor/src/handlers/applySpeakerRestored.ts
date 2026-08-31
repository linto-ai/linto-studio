import type { SpeakerRestored } from "@linto-ai/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { trackUndoRedoHeads } from "../tools/trackUndoRedoHeads"

/** Apply an undo of replace_speaker (server event editor:speaker_restored):
 *  resurrect fromSpeaker and move back exactly turnIds — the mirror of
 *  applySpeakerReplaced, not its opposite (only these turnIds move, not
 *  every turn currently on toSpeakerId — see the server-side handler).
 *  toSpeakerId is never GC'd here, matching the server: it may keep turns
 *  of its own that predate the original replace. */
export function applySpeakerRestored(
  state: EditorPluginState,
  restored: SpeakerRestored,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, restored.translationId, restored.version)) {
    return
  }

  // ensure, not updateOrCreate: color is client-only cosmetic state the
  // server never carries, so a fromSpeaker that's still around (defensive,
  // shouldn't happen — it was GC'd by the original replace) keeps its own
  // rather than being overwritten with a payload that has none.
  state.core.speakers.ensure(
    restored.fromSpeaker.speaker_id,
    restored.fromSpeaker.speaker_name,
  )

  const store = findTranslationStore(state.core, restored.translationId)
  if (store) {
    const turnIds = new Set(restored.turnIds)
    for (const turn of store.turns.value) {
      if (turnIds.has(turn.id)) {
        store.updateTurn(turn.id, { speakerId: restored.fromSpeaker.speaker_id })
      }
    }
  }

  trackUndoRedoHeads(
    state,
    restored.translationId,
    restored.revisionId,
    restored.redoRevisionId,
  )
}
