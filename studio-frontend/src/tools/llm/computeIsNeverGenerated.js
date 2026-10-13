/**
 * Was this report never generated? Only answerable once the job list of the
 * conversation is known (a failed fetch is not "no job"). "idle" is the status
 * loadServices registers for a service without a job; any other status
 * (queued, processing, complete, error) means a job exists or was requested.
 * @param {{ jobsLoaded: boolean, entry: object | undefined, status: string | undefined }} service
 * @returns {boolean}
 */
export function computeIsNeverGenerated({ jobsLoaded, entry, status }) {
  return jobsLoaded && !!entry && !entry.jobId && status === "idle"
}
