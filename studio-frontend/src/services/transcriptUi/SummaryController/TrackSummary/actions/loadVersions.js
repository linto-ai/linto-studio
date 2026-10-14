import { apiListExportVersions } from "@/api/service.js"
import { mapVersions } from "@/tools/llm/mapVersion.js"
import { computeLatestVersionNumber } from "@/tools/llm/computeLatestVersionNumber.js"
import { isLoadStale } from "./isLoadStale.js"

// The versions of the current job of a report, the latest one shown.
// Dropped when the report moved to another job meanwhile, or, when part of
// a load, if the load is stale for the report.
export async function loadVersions(trackSummary, id, load = null) {
  const jobId = trackSummary.jobs.get(id)?.jobId
  if (!jobId) return
  const versions = mapVersions(
    await apiListExportVersions(trackSummary.trackId, jobId),
  )
  if (trackSummary.destroyed) return
  if (trackSummary.jobs.get(id)?.jobId !== jobId) return
  if (load && isLoadStale(trackSummary, load, id)) return
  trackSummary.core.llmServices.setVersions(id, versions)
  trackSummary.core.llmServices.setActiveVersion(
    id,
    computeLatestVersionNumber(versions),
  )
}
