import { apiGetExportContent } from "@/api/service.js"
import { isLoadStale } from "./isLoadStale.js"

// Part of a load: dropped when the load is stale for the report. Resolves
// to whether the content was loaded.
export async function loadReportContent(
  trackSummary,
  load,
  id,
  jobId,
  lastUpdate,
) {
  const response = await apiGetExportContent(trackSummary.trackId, jobId)
  if (isLoadStale(trackSummary, load, id)) return false
  if (response?.status !== "success" || typeof response.content !== "string") {
    console.error("cannot load the report content", id, response)
    return false
  }
  trackSummary.core.llmServices.setContent(id, response.content, lastUpdate)
  return true
}
