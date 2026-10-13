/** Is a report generation at least as recent as the transcription it was
 *  generated from? When either date is missing (or unusable) there is no
 *  negative signal to show: up to date. */
export function computeIsUpToDate(
  transcriptionModifiedAt: number | null,
  generatedAt: number | null,
): boolean {
  if (
    transcriptionModifiedAt == null ||
    !Number.isFinite(transcriptionModifiedAt)
  ) {
    return true
  }
  if (generatedAt == null || !Number.isFinite(generatedAt)) return true
  return generatedAt >= transcriptionModifiedAt
}
