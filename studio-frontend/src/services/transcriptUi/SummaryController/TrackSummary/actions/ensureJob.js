// The job record of a report, created on first need: a live update can
// name a job before the job list of the track is loaded.
export function ensureJob(trackSummary, id) {
  let job = trackSummary.jobs.get(id)
  if (!job) {
    job = { jobId: null, generationJobIds: {} }
    trackSummary.jobs.set(id, job)
  }
  return job
}
