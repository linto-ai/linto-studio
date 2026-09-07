/** Fire-and-forget push of an editor command: the broadcast applies the
 *  result, the ack only reports refusals — logged, host notifications come
 *  with their own iteration. */
export async function pushEditorCommand(
  label: string,
  command: Promise<{ ok: boolean; reason?: string }> | undefined,
): Promise<void> {
  try {
    const ack = await command
    if (ack && !ack.ok) {
      console.error(
        `[transcriptionEditor] ${label} rejected: ${ack.reason ?? "unknown"}`,
      )
    }
  } catch (err) {
    console.error(`[transcriptionEditor] ${label} failed:`, err)
  }
}
