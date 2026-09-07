import type { EditorPluginState } from "../types"
import type { TranscriptionEditorLockPayload } from "../types"
import { computeLockKey } from "./computeLockKey"

/**
 * Leave edit mode: clear the editing refs, stop the heartbeat, and drop the
 * own-lock entry now instead of waiting for the turn_unlocked broadcast — an
 * immediate re-click must not hit the local pre-check on a stale own lock.
 * @returns the edit's lock target (for the unlock push), or null.
 */
export function exitEditMode(
  state: EditorPluginState,
): TranscriptionEditorLockPayload | null {
  const target = state.editingRef
  state.editingTurnId.value = null
  state.editingRef = null
  state.heartbeat.stop()
  if (target) {
    state.locks.delete(computeLockKey(target.translationId, target.turnId))
  }
  return target
}
