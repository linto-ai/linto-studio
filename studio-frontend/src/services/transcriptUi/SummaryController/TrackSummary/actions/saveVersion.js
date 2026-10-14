import { apiUpdateExportResult } from "@/api/service.js"
import { loadVersions } from "./loadVersions.js"

// Saving creates a new version of the current job.
export async function saveVersion(trackSummary, id, content) {
  const { core, summaryController } = trackSummary
  const jobId = trackSummary.jobs.get(id)?.jobId
  if (!jobId) return
  core.llmServices.setBusy(id, true)
  const saved = await apiUpdateExportResult(
    trackSummary.trackId,
    jobId,
    content,
  )
  if (trackSummary.destroyed) return
  if (saved) {
    await loadVersions(trackSummary, id)
    if (trackSummary.destroyed) return
    // The saved draft becomes the content: the panel resets its dirty flag.
    core.llmServices.setContent(id, content, Date.now())
    summaryController.notify(
      "success",
      summaryController.t("publish.editor.version_saved"),
    )
  } else {
    summaryController.notify(
      "error",
      summaryController.t("publish.editor.version_save_error"),
    )
  }
  core.llmServices.setBusy(id, false)
}
