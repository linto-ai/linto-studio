import type {
  TranscriptionEditorLockPayload,
  TranscriptionEditorOptions,
} from "../types"
import { pushEditorCommand } from "./pushEditorCommand"
import { pushUnlock } from "./pushUnlock"

/** Committing an emptied turn: delete (requires the lock server-side),
 *  THEN release it — same ordering rule as save/split. */
export async function pushDeleteThenUnlock(
  options: TranscriptionEditorOptions,
  target: TranscriptionEditorLockPayload,
): Promise<void> {
  await pushEditorCommand("delete_turn", options.deleteTurn?.(target))
  await pushUnlock(options, target)
}
