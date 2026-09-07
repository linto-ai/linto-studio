import type { SpeakerRenamed } from "@linto-ai/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { trackUndoRedoHeads } from "../tools/trackUndoRedoHeads"

/** Apply a speaker rename broadcast by the server (a plain rename OR an
 *  undo/redo replaying one — see trackUndoRedoHeads) — the speakers store
 *  is document-global, no per-track guard needed. */
export function applySpeakerRenamed(
  state: EditorPluginState,
  renamed: SpeakerRenamed,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, renamed.translationId, renamed.version)) return

  state.core.speakers.update(renamed.speakerId, { name: renamed.name })
  trackUndoRedoHeads(
    state,
    renamed.translationId,
    renamed.revisionId,
    renamed.redoRevisionId,
  )
}
