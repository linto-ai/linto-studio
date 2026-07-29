import type {
  TranscriptionEditorLockPayload,
  TranscriptionEditorOptions,
} from "../types"

/** Release the server lock — fire-and-forget from the UI's perspective. */
export async function pushUnlock(
  options: TranscriptionEditorOptions,
  target: TranscriptionEditorLockPayload,
): Promise<void> {
  try {
    await options.unlockTurn?.(target)
  } catch (err) {
    console.error("[transcriptionEditor] unlock failed:", err)
  }
}
