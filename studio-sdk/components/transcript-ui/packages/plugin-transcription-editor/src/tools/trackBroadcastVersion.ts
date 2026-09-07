import type { EditorPluginState } from "../types"

/**
 * Version gate for an incoming broadcast: should it be applied?
 *  - untracked track (not loaded yet) or unversioned broadcast → apply
 *    (the other guards handle it — legacy behavior);
 *  - version ≤ known → already part of the loaded content, skip;
 *  - version = known + 1 → the nominal case: advance and apply;
 *  - version jump → broadcasts were missed: skip and refetch the track
 *    (the reload carries the whole truth, replaying is pointless).
 */
export function trackBroadcastVersion(
  state: EditorPluginState,
  translationId: string,
  version: number | undefined,
): boolean {
  const known = state.versions.get(translationId)
  if (version == null || known == null) return true
  if (version <= known) return false
  if (version === known + 1) {
    state.versions.set(translationId, version)
    return true
  }
  requestRefetch(state, translationId)
  return false
}

/** Ask the host to reload a track — once, even under a broadcast burst. */
export function requestRefetch(
  state: EditorPluginState,
  translationId: string,
): void {
  if (!state.options.refetchTranslation) return
  if (state.pendingRefetches.has(translationId)) return
  state.pendingRefetches.add(translationId)
  state.options
    .refetchTranslation(translationId)
    .catch((err) => {
      console.error(
        `[transcriptionEditor] refetch failed for track ${translationId}:`,
        err,
      )
    })
    .finally(() => {
      state.pendingRefetches.delete(translationId)
    })
}
