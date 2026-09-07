import type {
  TranscriptionEditorOptions,
  TranscriptionEditorSplitPayload,
} from "../types"
import { pushUnlock } from "./pushUnlock"

/**
 * The Enter gesture's network sequence: save (when the text changed), THEN
 * split, THEN unlock — each step requires the previous one:
 *  - the split offset targets the SAVED text, so a failed save aborts the
 *    split (the server would cut the old text at the new text's offset);
 *  - both mutations require the lock, so the unlock always comes last.
 */
export async function pushSplitSequence(
  options: TranscriptionEditorOptions,
  payload: {
    translationId: string
    turnId: string
    text: string
    offset: number
    textChanged: boolean
  },
): Promise<void> {
  const target = { translationId: payload.translationId, turnId: payload.turnId }
  try {
    if (payload.textChanged) {
      const saveAck = await options.saveTurn?.({
        translationId: payload.translationId,
        turnId: payload.turnId,
        text: payload.text,
      })
      if (saveAck && !saveAck.ok) {
        console.error(
          `[transcriptionEditor] save rejected before split (turn ${payload.turnId}): ${saveAck.reason ?? "unknown"} — split aborted`,
        )
        await pushUnlock(options, target)
        return
      }
    }

    const splitPayload: TranscriptionEditorSplitPayload = {
      translationId: payload.translationId,
      turnId: payload.turnId,
      offset: payload.offset,
    }
    const splitAck = await options.splitTurn?.(splitPayload)
    if (splitAck && !splitAck.ok) {
      console.error(
        `[transcriptionEditor] split rejected for turn ${payload.turnId}: ${splitAck.reason ?? "unknown"}`,
      )
    }
  } catch (err) {
    console.error(
      `[transcriptionEditor] split sequence failed for turn ${payload.turnId}:`,
      err,
    )
  }
  await pushUnlock(options, target)
}
