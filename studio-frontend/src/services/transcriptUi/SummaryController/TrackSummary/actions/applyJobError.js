import { resolveReportId } from "./resolveReportId.js"
import { markReportTouched } from "./markReportTouched.js"

export function applyJobError(trackSummary, update) {
  const id = resolveReportId(trackSummary, update)
  if (!id) return
  markReportTouched(trackSummary, id)
  trackSummary.core.llmServices.setError(
    id,
    update.error ||
      trackSummary.summaryController.t("publish.error_llm_server"),
  )
}
