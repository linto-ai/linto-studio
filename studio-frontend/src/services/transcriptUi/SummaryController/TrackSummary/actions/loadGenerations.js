import { apiListGenerations } from "@/api/service.js"
import { mapGenerations } from "@/tools/llm/mapGeneration.js"
import { computeGenerationsIndex } from "@/tools/llm/computeGenerationsIndex.js"
import { ensureJob } from "./ensureJob.js"
import { isLoadStale } from "./isLoadStale.js"

// The generations of a report. The current one sets the job the version
// and save requests go to. When part of a load, dropped if the load is
// stale for the report.
export async function loadGenerations(trackSummary, id, load = null) {
  const entry = trackSummary.summaryController.catalog.get(id)
  if (!entry) return
  const generations = await apiListGenerations(
    trackSummary.trackId,
    entry.route,
  )
  if (trackSummary.destroyed) return
  if (load && isLoadStale(trackSummary, load, id)) return
  const { jobIds, current } = computeGenerationsIndex(generations)
  const job = ensureJob(trackSummary, id)
  job.generationJobIds = jobIds
  if (current?.jobId) job.jobId = current.jobId
  trackSummary.core.llmServices.setGenerations(id, mapGenerations(generations))
  trackSummary.core.llmServices.setCurrentGeneration(
    id,
    current?.generationId ?? null,
  )
}
