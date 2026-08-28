import type {
  TranscriptionEditorOptions,
  TranscriptionEditorSavePayload,
} from "../types"
import { pushUnlock } from "./pushUnlock"

/**
 * Push the save, THEN release the lock. The order is mandatory: update_turn
 * requires the lock server-side — an unlock racing ahead of the save ack
 * would get the save refused (not_lock_owner). A failed save still unlocks
 * (a ghost lock would linger for the whole TTL otherwise).
 */
export async function pushSaveThenUnlock(
  options: TranscriptionEditorOptions,
  payload: TranscriptionEditorSavePayload,
): Promise<void> {
  try {
    const ack = await options.saveTurn?.(payload)
    if (ack && !ack.ok) {
      console.error(
        `[transcriptionEditor] save rejected for turn ${payload.turnId}: ${ack.reason ?? "unknown"}`,
      )
    }
  } catch (err) {
    console.error(
      `[transcriptionEditor] save failed for turn ${payload.turnId}:`,
      err,
    )
  }
  await pushUnlock(options, {
    translationId: payload.translationId,
    turnId: payload.turnId,
  })
}
