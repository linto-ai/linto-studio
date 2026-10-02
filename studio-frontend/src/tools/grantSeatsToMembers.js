// A seat refusal is the only failure that makes the rest of the batch pointless.
function isSeatRefusal(response) {
  const data = response?.error?.response?.data
  return (
    response?.error?.response?.status === 402 && data?.capability === "seats"
  )
}

function describeFailure(response) {
  const data = response?.error?.response?.data
  return {
    message: data?.message || response?.message || "",
    code: data?.code || null,
    capability: data?.capability || null,
  }
}

/**
 * Applies a batch of role assignments, one call after the other.
 *
 * Sequential on purpose: the API rewrites the whole organization document on
 * every role change, and its seat check counts the collaborators of the
 * document it read before the change — parallel calls would all pass against
 * the same stale count and overshoot the bought capacity.
 *
 * Never throws: it reports every outcome so the caller can show what went
 * through and retry what did not. A seat refusal ends the run, since nothing
 * after it could pass either.
 *
 * @param {Array<{userId: string, role: number}>} assignments
 * @param {(userId: string, role: number) => Promise<object>} updateRole - one request
 * @param {(step: {userId: string, done: number, total: number}) => void} [onProgress]
 * @returns {Promise<{succeeded: Array, failed: Array, stopped: boolean}>}
 */
export async function grantSeatsToMembers(assignments, updateRole, onProgress) {
  const batch = assignments || []
  const succeeded = []
  const failed = []
  let stopped = false

  for (const assignment of batch) {
    const response = await updateRole(assignment.userId, assignment.role)
    if (response?.status === "success") {
      succeeded.push({ userId: assignment.userId, role: assignment.role })
    } else {
      failed.push({
        userId: assignment.userId,
        role: assignment.role,
        ...describeFailure(response),
      })
      stopped = isSeatRefusal(response)
    }
    if (onProgress) {
      onProgress({
        userId: assignment.userId,
        done: succeeded.length + failed.length,
        total: batch.length,
      })
    }
    if (stopped) break
  }

  return { succeeded, failed, stopped }
}
