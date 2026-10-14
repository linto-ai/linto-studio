import { apiGetExportContent } from "@/api/service.js"
import { loadVersions } from "./loadVersions.js"
import { markReportTouched } from "./markReportTouched.js"

// Shows another generation: its job becomes the current one, so the
// version and save requests that follow go to it.
export async function selectGeneration(trackSummary, id, generationId) {
  const { core, summaryController } = trackSummary
  const job = trackSummary.jobs.get(id)
  const jobId = job?.generationJobIds[generationId]
  if (!jobId) {
    console.error("no job for the report generation", id, generationId)
    return
  }
  markReportTouched(trackSummary, id)
  core.llmServices.setBusy(id, true)
  job.jobId = jobId
  core.llmServices.setCurrentGeneration(id, generationId)
  const response = await apiGetExportContent(trackSummary.trackId, jobId)
  if (trackSummary.destroyed) return
  // The report moved to another job meanwhile (a load, a completed
  // generation): its content is newer.
  if (job.jobId !== jobId) {
    core.llmServices.setBusy(id, false)
    return
  }
  if (response?.status === "success" && typeof response.content === "string") {
    core.llmServices.setContent(id, response.content, Date.now())
  } else {
    core.llmServices.setError(
      id,
      summaryController.t("publish.llm_gateway_unavailable"),
    )
  }
  await loadVersions(trackSummary, id)
  if (trackSummary.destroyed) return
  core.llmServices.setBusy(id, false)
}
