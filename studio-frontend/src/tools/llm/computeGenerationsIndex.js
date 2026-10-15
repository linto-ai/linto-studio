/**
 * The job behind each generation of a report, and the current generation:
 * the one flagged by the gateway, or else the most recent.
 * @param {Array<{ generationId?: string, jobId?: string, createdAt?: string, isCurrent?: boolean }>} generations
 * @returns {{ jobIds: Object<string, string>, current: { generationId: string|null, jobId: string|null } | null }}
 */
export function computeGenerationsIndex(generations) {
  const jobIds = {}
  for (const generation of generations) {
    if (generation.generationId && generation.jobId) {
      jobIds[generation.generationId] = generation.jobId
    }
  }
  const current =
    generations.find((generation) => generation.isCurrent) ??
    findMostRecent(generations)
  if (!current) return { jobIds, current: null }
  return {
    jobIds,
    current: {
      generationId: current.generationId ?? null,
      jobId: current.jobId ?? null,
    },
  }
}

function findMostRecent(generations) {
  return [...generations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0]
}
