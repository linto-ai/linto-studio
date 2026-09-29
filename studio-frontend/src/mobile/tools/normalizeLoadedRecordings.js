/**
 * Recordings read from the phone at startup, made consistent with the
 * automatic sending: nothing is "kept for later" any more (legacy "ready"
 * items are queued, so is one left on its stop sheet), and a recording still marked as running belongs to a
 * previous session: queued when it has audio, dropped otherwise.
 * @param {object[]} recordings
 * @returns {{ keep: object[], remove: string[] }}
 */
export function normalizeLoadedRecordings(recordings) {
  const keep = []
  const remove = []
  for (const recording of recordings) {
    if (recording.status === "ready" || recording.status === "naming") {
      keep.push({ ...recording, status: "queued" })
    } else if (recording.status === "recording") {
      if ((recording.sizeBytes || 0) > 0) {
        keep.push({ ...recording, status: "queued", interruptedAt: Date.now() })
      } else {
        remove.push(recording.id)
      }
    } else {
      keep.push(recording)
    }
  }
  return { keep, remove }
}
