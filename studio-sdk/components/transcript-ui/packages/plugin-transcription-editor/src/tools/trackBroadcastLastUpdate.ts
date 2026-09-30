import type { EditorPluginState } from "../types"
import { computeEpochMs } from "./computeEpochMs"
import { findTranslationStore } from "./findTranslationStore"

/** Record the server last_update a broadcast carries on its track — even a
 *  track that is not loaded yet (its store exists from setDocument) and even
 *  when the broadcast itself is skipped: it still reports a server-side
 *  modification. The store only moves forward. */
export function trackBroadcastLastUpdate(
  state: EditorPluginState,
  translationId: string,
  lastUpdate: string | undefined,
): void {
  const ms = computeEpochMs(lastUpdate)
  if (ms == null) return
  findTranslationStore(state.core, translationId)?.advanceLastModifiedAt(ms)
}
