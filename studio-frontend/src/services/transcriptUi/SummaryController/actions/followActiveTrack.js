import { computeAssistantsTrack } from "@/tools/llm/computeAssistantsTrack.js"
import { TrackSummary } from "../TrackSummary/index.js"
import { resetReports } from "./resetReports.js"

// A new followed track gets a fresh TrackSummary, on reports emptied of the
// previous track.
export function followActiveTrack(summaryController) {
  const channel = summaryController.core.activeChannel.value
  if (!channel) return
  const trackId = computeAssistantsTrack(channel).id
  if (trackId === summaryController.trackSummary?.trackId) return
  summaryController.trackSummary?.destroy()
  resetReports(summaryController.core)
  summaryController.trackSummary = new TrackSummary(summaryController, trackId)
}
