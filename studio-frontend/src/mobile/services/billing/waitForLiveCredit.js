const POLL_INTERVAL_MS = 2000
const TIMEOUT_MS = 20000

/**
 * Reloads the organization usage until its live block passes `isCredited`:
 * a pack paid on Stripe is only credited once its webhook is processed, a
 * few seconds after the return. Gives up after TIMEOUT_MS, or as soon as
 * `isCancelled` holds (the page was left).
 * @param {object} store
 * @param {string} organizationId
 * @param {{ isCredited: (live: object|null) => boolean,
 *   isCancelled: () => boolean }} options
 * @returns {Promise<boolean>} whether the credit arrived
 */
export async function waitForLiveCredit(
  store,
  organizationId,
  { isCredited, isCancelled },
) {
  const deadline = Date.now() + TIMEOUT_MS
  while (Date.now() < deadline) {
    if (isCancelled()) return false
    const usage = await store.dispatch("billing/fetchUsage", organizationId)
    if (isCredited(usage?.live ?? null)) return true
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  return false
}
