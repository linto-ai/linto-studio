import type { EditorPluginState } from "../types"
import type { TranscriptionEditorLockPayload } from "../types"
import { computeLockKey } from "../tools/computeLockKey"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { setTurnLock } from "./locksState"
import { cancelEdit } from "./cancelEdit"

async function refreshLock(
  state: EditorPluginState,
  target: TranscriptionEditorLockPayload,
): Promise<void> {
  try {
    const ack = await state.options.lockTurn!(target)
    if (!ack?.ok) exitAfterLockLoss(state, target, ack?.reason)
  } catch (err) {
    // Network hiccup: keep editing, the next beat retries — the server TTL
    // is the arbiter of a truly lost lock.
    console.error("[transcriptionEditor] heartbeat failed:", err)
  }
}

function exitAfterLockLoss(
  state: EditorPluginState,
  target: TranscriptionEditorLockPayload,
  reason: string | undefined,
): void {
  if (!state.editingRef || state.editingRef.turnId !== target.turnId) return
  // Dry exit (decided): the in-progress text is dropped, the turn shows the
  // last committed state again.
  console.error(
    `[transcriptionEditor] lock lost on turn ${target.turnId}: ${reason ?? "unknown"}`,
  )
  state.editingTurnId.value = null
  state.editingRef = null
  state.heartbeat.stop()
}

/** Enter edit mode — once the server lock is granted (local-only without a
 *  lockTurn handler). Refusal simply doesn't enter; the holder from the ack
 *  keeps the badge honest even when the turn_locked broadcast was missed. */
export async function beginEdit(
  state: EditorPluginState,
  turnId: string,
  caretOffset = 0,
): Promise<void> {
  if (state.core.capabilities.value.text !== "edit") return
  if (state.lockPending) return
  if (state.editingTurnId.value === turnId) return
  const store = getActiveTranslationStore(state.core)
  if (!store?.hasTurn(turnId)) return
  // Local pre-check for instant feedback — the server ack below stays the
  // authority on races.
  if (state.locks.has(computeLockKey(store.id, turnId))) return
  // Switching turns: release the previous edit first.
  if (state.editingTurnId.value !== null) cancelEdit(state)

  const target = { translationId: store.id, turnId }
  if (state.options.lockTurn) {
    state.lockPending = true
    try {
      const ack = await state.options.lockTurn(target)
      if (!ack?.ok) {
        if (ack?.holder) setTurnLock(state, { ...target, ...ack.holder })
        return
      }
    } catch (err) {
      console.error("[transcriptionEditor] lock request failed:", err)
      return
    } finally {
      state.lockPending = false
    }
  }

  state.editingRef = target
  state.editingTurnId.value = turnId
  state.editingCaretOffset.value = caretOffset
  if (state.options.lockTurn) {
    state.heartbeat.start(() => void refreshLock(state, target))
  }
}
