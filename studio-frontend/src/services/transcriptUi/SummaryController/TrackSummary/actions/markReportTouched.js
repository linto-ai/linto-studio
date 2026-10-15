// A request or a live update changed the report: the load in progress
// keeps its newer state instead of its snapshot.
export function markReportTouched(trackSummary, id) {
  trackSummary.currentLoad?.touchedReportIds.add(id)
}
