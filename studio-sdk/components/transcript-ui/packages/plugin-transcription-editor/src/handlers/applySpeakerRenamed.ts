import type { SpeakerRenamed } from "@linto-ai/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { trackBroadcastLastUpdate } from "../tools/trackBroadcastLastUpdate"
import { trackUndoRedoHeads } from "../tools/trackUndoRedoHeads"

/** Apply a speaker rename broadcast by the server (a plain rename OR an
 *  undo/redo replaying one — see trackUndoRedoHeads) — the speakers store
 *  is document-global, no per-track guard needed. */
export function applySpeakerRenamed(
  state: EditorPluginState,
  renamed: SpeakerRenamed,
): void {
  // First: even a skipped broadcast (own echo, stale, not-loaded track,
  // turn under the caret) reports a server-side modification.
  trackBroadcastLastUpdate(state, renamed.translationId, renamed.lastUpdate)

  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, renamed.translationId, renamed.version)) return

  // An undo may bring a placeholder back (defined: false); an older server
  // sends no flag, and a rename means a real name.
  state.core.speakers.update(renamed.speakerId, {
    name: renamed.name,
    defined: renamed.defined ?? true,
  })
  trackUndoRedoHeads(
    state,
    renamed.translationId,
    renamed.revisionId,
    renamed.redoRevisionId,
  )
}
