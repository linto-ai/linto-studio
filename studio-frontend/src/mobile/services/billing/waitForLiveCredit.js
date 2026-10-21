const POLL_INTERVAL_MS = 2000
const TIMEOUT_MS = 20000

/**
 * Reloads the organization usage until its live balance grows past
 * `previousBalance`: a pack paid on Stripe is only credited once its webhook
 * is processed, a few seconds after the return. Gives up after TIMEOUT_MS, or
 * as soon as `isCancelled` holds (the page was left).
 * @param {object} store
 * @param {string} organizationId
 * @param {{ previousBalance: number, isCancelled: () => boolean }} options
 * @returns {Promise<boolean>} whether the credit arrived
 */
export async function waitForLiveCredit(
  store,
  organizationId,
  { previousBalance, isCancelled },
) {
  const deadline = Date.now() + TIMEOUT_MS
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    if (isCancelled()) return false
    const usage = await store.dispatch("billing/fetchUsage", organizationId)
    if ((usage?.live?.balance ?? 0) > previousBalance) return true
  }
  return false
}
