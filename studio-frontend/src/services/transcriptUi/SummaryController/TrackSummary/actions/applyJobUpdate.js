import { mapStatus } from "@/tools/llm/mapStatus.js"
import { resolveReportId } from "./resolveReportId.js"
import { markReportTouched } from "./markReportTouched.js"

export function applyJobUpdate(trackSummary, update) {
  const id = resolveReportId(trackSummary, update)
  if (!id) return
  markReportTouched(trackSummary, id)
  const { llmServices } = trackSummary.core
  const status = mapStatus(update.status)
  if (status) llmServices.setStatus(id, status)
  llmServices.setProgress(
    id,
    Number(update.progress?.percentage) || 0,
    update.progress?.phase ?? null,
  )
}
