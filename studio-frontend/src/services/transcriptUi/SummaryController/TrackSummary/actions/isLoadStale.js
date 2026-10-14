// Whether a result of a load must be dropped for a report: the track is no
// longer followed, a newer load superseded this one, or the report changed
// since this load started. A report still loading has no state of its own
// to protect (a job update without status): it takes the load's result.
export function isLoadStale(trackSummary, load, id) {
  if (trackSummary.destroyed || trackSummary.currentLoad !== load) return true
  if (!load.touchedReportIds.has(id)) return false
  return trackSummary.core.llmServices.get(id)?.status.value !== "loading"
}
