import { computeIsNeverGenerated } from "@/tools/llm/computeIsNeverGenerated.js"
import { computeCanGenerateReports } from "@/tools/llm/computeCanGenerateReports.js"
import { regenerate } from "./regenerate.js"

// One click (the tab) instead of two (the tab, then "Generate"), for the
// readers allowed to generate.
export function generateIfNeverGenerated(trackSummary, id) {
  const { core, summaryController, trackId } = trackSummary
  if (!id || trackSummary.destroyed) return
  // A load in progress has a fresher job list: it decides once done.
  if (trackSummary.currentLoad) return
  if (!computeCanGenerateReports(core.capabilities.value)) return
  // Requested already, maybe by the summary of an earlier visit of the track
  if (summaryController.regenerations.has(trackId, id)) return
  const isNeverGenerated = computeIsNeverGenerated({
    jobsLoaded: trackSummary.jobsLoaded,
    entry: trackSummary.jobs.get(id),
    status: core.llmServices.get(id)?.status.value,
  })
  if (isNeverGenerated) regenerate(trackSummary, id)
}
