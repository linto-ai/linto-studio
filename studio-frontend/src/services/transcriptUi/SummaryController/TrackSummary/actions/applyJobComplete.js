import { apiGetExportContent } from "@/api/service.js"
import { resolveReportId } from "./resolveReportId.js"
import { loadVersions } from "./loadVersions.js"
import { loadGenerations } from "./loadGenerations.js"
import { markReportTouched } from "./markReportTouched.js"

export async function applyJobComplete(trackSummary, update) {
  const id = resolveReportId(trackSummary, update)
  if (!id) return
  markReportTouched(trackSummary, id)
  const { core, summaryController } = trackSummary
  core.llmServices.setStatus(id, "complete")
  const response = await apiGetExportContent(trackSummary.trackId, update.jobId)
  if (trackSummary.destroyed) return
  if (response?.status === "success" && typeof response.content === "string") {
    core.llmServices.setContent(id, response.content, Date.now())
    await Promise.allSettled([
      loadVersions(trackSummary, id),
      loadGenerations(trackSummary, id),
    ])
  } else {
    core.llmServices.setError(
      id,
      summaryController.t("publish.llm_gateway_unavailable"),
    )
  }
}
