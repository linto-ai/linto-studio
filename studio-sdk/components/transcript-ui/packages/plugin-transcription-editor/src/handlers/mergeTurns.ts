import type { EditorPluginState } from "../types"
import { computeLockKey } from "../tools/computeLockKey"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushMergeTurns } from "../tools/pushMergeTurns"

/**
 * Merge two adjacent turns of the active track (the merge button). Local
 * pre-checks for instant feedback — the server ack stays the authority
 * (locks, adjacency, rights).
 */
export function mergeTurns(
  state: EditorPluginState,
  firstTurnId: string,
  secondTurnId: string,
): void {
  if (state.core.capabilities.value.text !== "edit") return
  const store = getActiveTranslationStore(state.core)
  if (!store) return
  if (!store.hasTurn(firstTurnId) || !store.hasTurn(secondTurnId)) return
  // Both turns must be free — own locks included (a turn being edited HERE
  // is in the map too).
  if (
    state.locks.has(computeLockKey(store.id, firstTurnId)) ||
    state.locks.has(computeLockKey(store.id, secondTurnId))
  ) {
    return
  }

  void pushMergeTurns(state.options, {
    translationId: store.id,
    firstTurnId,
    secondTurnId,
  })
}
