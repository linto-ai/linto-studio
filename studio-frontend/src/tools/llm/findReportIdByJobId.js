/**
 * @param {Map<string, { jobId: string|null }>} jobs - job of each report
 * @param {string|null|undefined} jobId
 * @returns {string|null} the report whose job it is
 */
export function findReportIdByJobId(jobs, jobId) {
  if (!jobId) return null
  for (const [id, job] of jobs) {
    if (job.jobId === jobId) return id
  }
  return null
}
