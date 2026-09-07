import type {
  TranscriptionEditorMergePayload,
  TranscriptionEditorOptions,
} from "../types"

/** Ask the server to merge — fire-and-forget, the broadcast applies it. */
export async function pushMergeTurns(
  options: TranscriptionEditorOptions,
  payload: TranscriptionEditorMergePayload,
): Promise<void> {
  try {
    const ack = await options.mergeTurns?.(payload)
    if (ack && !ack.ok) {
      console.error(
        `[transcriptionEditor] merge rejected (${payload.firstTurnId}+${payload.secondTurnId}): ${ack.reason ?? "unknown"}`,
      )
    }
  } catch (err) {
    console.error(
      `[transcriptionEditor] merge failed (${payload.firstTurnId}+${payload.secondTurnId}):`,
      err,
    )
  }
}
