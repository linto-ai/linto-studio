import { apiGetGenericFileFromConversation } from "@/api/conversation.js"
import { computeCanGenerateReports } from "@/tools/llm/computeCanGenerateReports.js"
import { markReportTouched } from "./markReportTouched.js"

// Asks the gateway for a new generation. On success, the live job updates
// drive the progress, then the content. A track without text gets no job
// (the API answers 204 with nothing): it fails like an error. The answer
// goes to the summary following the track by then, which may be a new one
// (the followed track changed and came back meanwhile).
export async function regenerate(trackSummary, id) {
  const { core, summaryController, trackId } = trackSummary
  const entry = summaryController.catalog.get(id)
  if (!entry || !computeCanGenerateReports(core.capabilities.value)) return

  summaryController.regenerations.add(trackId, id)
  markReportTouched(trackSummary, id)
  core.llmServices.setStatus(id, "queued")
  core.llmServices.setProgress(id, 0, null)
  const response = await apiGetGenericFileFromConversation(
    trackId,
    entry.route,
    entry.flavor,
    {
      preview: false,
      title: id,
      regenerate: true,
      llmOutputType: "markdown",
    },
  )
  summaryController.regenerations.delete(trackId, id)
  const current = summaryController.trackSummary
  // The track is no longer followed: its reports are not the ones shown.
  if (current?.trackId !== trackId) return
  if (response?.status === "error" || !response?.data?.size) {
    markReportTouched(current, id)
    core.llmServices.setError(
      id,
      response?.message || summaryController.t("publish.generic_error"),
    )
  }
}
