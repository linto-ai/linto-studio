import type { TurnLock } from "../../../core/types"
import type { EditorPluginState } from "../types"
import type { TranscriptionEditorLockPayload } from "../types"
import { computeLockKey } from "../tools/computeLockKey"

// The four accessors of the locks map share one key scheme — grouped file.

/** Lock held on a turn of the ACTIVE translation, if any. */
export function getTurnLock(state: EditorPluginState, turnId: string) {
  const channel = state.core.activeChannel.value
  if (!channel) return undefined
  return state.locks.get(
    computeLockKey(channel.activeTranslation.value.id, turnId),
  )
}

/** Full replacement — join ack and reconnection re-ack. */
export function setLocks(state: EditorPluginState, all: TurnLock[]): void {
  state.locks.clear()
  for (const lock of all) setTurnLock(state, lock)
}

export function setTurnLock(state: EditorPluginState, lock: TurnLock): void {
  state.locks.set(computeLockKey(lock.translationId, lock.turnId), {
    userId: lock.userId,
    userName: lock.userName,
  })
}

export function clearTurnLock(
  state: EditorPluginState,
  ref: TranscriptionEditorLockPayload,
): void {
  state.locks.delete(computeLockKey(ref.translationId, ref.turnId))
}
