// The host opens its publication flow on the current job of the report.
export function exportReport(trackSummary, id) {
  const { summaryController } = trackSummary
  const jobId = trackSummary.jobs.get(id)?.jobId
  if (!jobId) {
    summaryController.notify(
      "error",
      summaryController.t("publish.export_error"),
    )
    return
  }
  const entry = summaryController.catalog.get(id)
  summaryController.openPublication({
    // The publication endpoints take the gateway UUID, not the SDK id
    serviceId: entry?.serviceId || id,
    jobId,
    conversationId: trackSummary.trackId,
  })
}
