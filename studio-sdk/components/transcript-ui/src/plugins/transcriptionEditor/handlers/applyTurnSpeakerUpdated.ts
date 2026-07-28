import type { TurnSpeakerUpdated } from "../../../core/types"
import type { EditorPluginState } from "../types"
import { trackBroadcastVersion } from "../tools/trackBroadcastVersion"
import { findTranslationStore } from "../tools/findTranslationStore"
import { removeSpeakerIfUnused } from "../tools/removeSpeakerIfUnused"

/** Apply a turn↔speaker assignment broadcast by the server, including its
 *  GC consequence (removedSpeakerId rides the broadcast). */
export function applyTurnSpeakerUpdated(
  state: EditorPluginState,
  update: TurnSpeakerUpdated,
): void {
  // Version gate: stale broadcasts are skipped, a gap triggers a refetch.
  if (!trackBroadcastVersion(state, update.translationId, update.version)) return

  const { speakers } = state.core
  // The broadcast carries the full speaker: a client that missed its
  // creation still ends up consistent (ensure creates, update syncs a
  // possibly stale name).
  speakers.ensure(update.speaker.id, update.speaker.name)
  speakers.update(update.speaker.id, { name: update.speaker.name })

  const store = findTranslationStore(state.core, update.translationId)
  if (store?.hasTurn(update.turnId)) {
    store.updateTurn(update.turnId, { speakerId: update.speaker.id })
  }

  if (update.removedSpeakerId) {
    removeSpeakerIfUnused(state.core, update.removedSpeakerId)
  }
}
