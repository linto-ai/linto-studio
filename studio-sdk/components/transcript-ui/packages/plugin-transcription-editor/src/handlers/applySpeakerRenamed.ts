import type { SpeakerRenamed } from "@linto/transcript-ui-core"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"

/** Apply a speaker rename broadcast by the server — the speakers store is
 *  document-global, no per-track guard needed. */
export function applySpeakerRenamed(
  state: EditorPluginState,
  renamed: SpeakerRenamed,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, renamed.translationId, renamed.version)) return

  state.core.speakers.update(renamed.speakerId, { name: renamed.name })
}
