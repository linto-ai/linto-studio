import { apiGetMetadataLLMService } from "@/api/service.js"
import { mapStatus } from "@/tools/llm/mapStatus.js"
import { computeEpochMs } from "@/tools/date/computeEpochMs.js"
import { ensureJob } from "./ensureJob.js"
import { isLoadStale } from "./isLoadStale.js"
import { loadReportContent } from "./loadReportContent.js"
import { loadVersions } from "./loadVersions.js"
import { loadGenerations } from "./loadGenerations.js"
import { generateIfNeverGenerated } from "./generateIfNeverGenerated.js"

// The state of every report of the catalog for the track, then the content,
// versions and generations of the completed ones. Runs when the track is
// followed, and again after a reconnection (the live updates sent
// meanwhile are lost). The latest run supersedes the previous ones; a report
// touched since it started, or being generated, keeps its newer state.
export async function loadReports(trackSummary) {
  const { summaryController, core } = trackSummary
  await summaryController.catalogLoaded
  if (trackSummary.destroyed) return
  const load = {
    touchedReportIds: new Set(
      summaryController.regenerations.list(trackSummary.trackId),
    ),
  }
  trackSummary.currentLoad = load
  // Null when the request failed, never mistaken for "no job".
  const jobs = await apiGetMetadataLLMService(trackSummary.trackId)
  if (trackSummary.destroyed || trackSummary.currentLoad !== load) return
  if (jobs === null) {
    markJobsUnavailable(trackSummary, load)
    return
  }

  const completed = []
  for (const id of summaryController.catalog.keys()) {
    if (isLoadStale(trackSummary, load, id)) continue
    if (summaryController.regenerations.has(trackSummary.trackId, id)) {
      // Requested during an earlier visit of the track, not listed yet
      core.llmServices.setStatus(id, "queued")
      continue
    }
    const job = jobs.find((candidate) => candidate.format === id)
    const status = mapStatus(job?.status) ?? "idle"
    const lastUpdate = computeEpochMs(job?.last_update)
    ensureJob(trackSummary, id).jobId = job?.jobId ?? null
    if (status === "complete" && job.jobId) {
      // Complete once its content is in (see loadCompletedReport)
      core.llmServices.register({ id, lastUpdate })
      completed.push({ id, jobId: job.jobId, lastUpdate })
      continue
    }
    core.llmServices.register({ id, status, lastUpdate })
    if (status === "processing" || status === "queued") {
      core.llmServices.setProgress(
        id,
        Number(job.processing) || 0,
        job.phase ?? null,
      )
    }
  }

  await Promise.allSettled(
    completed.map((report) => loadCompletedReport(trackSummary, load, report)),
  )
  if (trackSummary.destroyed || trackSummary.currentLoad !== load) return
  trackSummary.currentLoad = null
  trackSummary.jobsLoaded = true
  // The report may already be open: opened during the load, or the followed
  // track changed while on its tab.
  generateIfNeverGenerated(trackSummary, core.llmServices.activeId.value)
}

// Shown complete only with its content: complete and empty would read as
// never generated. Content that cannot be loaded is an error, except on a
// resync of a report already shown, which keeps it.
async function loadCompletedReport(
  trackSummary,
  load,
  { id, jobId, lastUpdate },
) {
  const [content] = await Promise.allSettled([
    loadReportContent(trackSummary, load, id, jobId, lastUpdate),
    loadVersions(trackSummary, id, load),
    loadGenerations(trackSummary, id, load),
  ])
  if (isLoadStale(trackSummary, load, id)) return
  const { core, summaryController } = trackSummary
  if (content.value === true) {
    core.llmServices.setStatus(id, "complete")
  } else if (core.llmServices.get(id)?.status.value !== "complete") {
    core.llmServices.setError(
      id,
      summaryController.t("publish.llm_gateway_unavailable"),
    )
  }
}

// Never loaded: the reports would look never generated. Once loaded (a
// failed resync), they keep the state they have.
function markJobsUnavailable(trackSummary, load) {
  const { core, summaryController } = trackSummary
  if (!trackSummary.jobsLoaded) {
    for (const id of summaryController.catalog.keys()) {
      if (isLoadStale(trackSummary, load, id)) continue
      core.llmServices.setError(
        id,
        summaryController.t("publish.llm_gateway_unavailable"),
      )
    }
  }
  trackSummary.currentLoad = null
}
