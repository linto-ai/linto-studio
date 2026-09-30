/** Is a report at least as recent as the transcription it was generated
 *  from? When either date is missing (or unusable) there is no negative
 *  signal to show: up to date. */
export function computeIsUpToDate(
  transcriptionModifiedAt: number | null,
  reportCreatedAt: number | null,
): boolean {
  if (transcriptionModifiedAt == null || !Number.isFinite(transcriptionModifiedAt)) {
    return true
  }
  if (reportCreatedAt == null || !Number.isFinite(reportCreatedAt)) return true
  return reportCreatedAt >= transcriptionModifiedAt
}
