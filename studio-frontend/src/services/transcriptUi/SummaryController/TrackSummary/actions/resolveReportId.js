import { findReportIdByJobId } from "@/tools/llm/findReportIdByJobId.js"
import { findReportIdByFormat } from "@/tools/llm/findReportIdByFormat.js"
import { ensureJob } from "./ensureJob.js"

// The report a live job update concerns, null when it concerns another
// track. Matched on its job, or else on its service format: the job is then
// recorded, so the next updates match on it.
export function resolveReportId(trackSummary, update) {
  if (update.conversationId && update.conversationId !== trackSummary.trackId) {
    return null
  }
  const byJob = findReportIdByJobId(trackSummary.jobs, update.jobId)
  if (byJob) return byJob
  const byFormat = findReportIdByFormat(
    trackSummary.summaryController.catalog,
    update,
  )
  if (byFormat && update.jobId) {
    ensureJob(trackSummary, byFormat).jobId = update.jobId
  }
  return byFormat
}
