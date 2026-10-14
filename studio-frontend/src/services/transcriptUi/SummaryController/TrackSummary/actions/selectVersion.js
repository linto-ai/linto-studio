import { apiGetExportVersion } from "@/api/service.js"

export async function selectVersion(trackSummary, id, versionNumber) {
  const { core } = trackSummary
  const jobId = trackSummary.jobs.get(id)?.jobId
  if (!jobId) return
  core.llmServices.setBusy(id, true)
  const version = await apiGetExportVersion(
    trackSummary.trackId,
    jobId,
    versionNumber,
  )
  if (trackSummary.destroyed) return
  // The report moved to another job meanwhile: this version is not its own.
  if (trackSummary.jobs.get(id)?.jobId !== jobId) {
    core.llmServices.setBusy(id, false)
    return
  }
  if (typeof version?.content === "string") {
    core.llmServices.setContent(id, version.content, Date.now())
    core.llmServices.setActiveVersion(id, versionNumber)
  } else {
    console.error("cannot load the report version", id, versionNumber)
  }
  core.llmServices.setBusy(id, false)
}
