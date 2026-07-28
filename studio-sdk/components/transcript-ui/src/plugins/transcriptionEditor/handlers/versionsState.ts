import type { EditorPluginState } from "../types"
import { requestRefetch } from "../tools/trackBroadcastVersion"

// The two version-state accessors share the map — grouped file (like locksState).

/** Baseline: the version the track's freshly fetched content corresponds to
 *  (host-pushed together with the content — same backend read). */
export function setTranslationVersion(
  state: EditorPluginState,
  translationId: string,
  version: number,
): void {
  state.versions.set(translationId, version)
}

/** Reconnection check (join re-ack): refetch every LOADED track the server
 *  says is ahead of what we hold. Unloaded tracks fetch fresh anyway. */
export function reconcileVersions(
  state: EditorPluginState,
  serverVersions: Record<string, number>,
): void {
  for (const [translationId, serverVersion] of Object.entries(serverVersions)) {
    const known = state.versions.get(translationId)
    if (known != null && serverVersion > known) {
      requestRefetch(state, translationId)
    }
  }
}
