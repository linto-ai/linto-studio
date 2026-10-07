/**
 * Outcome of a Stripe Checkout the browser just came back from (Stripe
 * appends ?type=<kind>&status=success|cancel to the return URL), and the
 * query to navigate to once it is consumed, so a reload doesn't repeat it.
 * @param {Object} query - route query
 * @returns {{ type: string, status: string, query: Object } | null} null when
 *   the URL is not a Checkout return
 */
export function computeCheckoutReturn(query) {
  const type = query?.type
  const status = query?.status
  if (typeof type !== "string" || type === "") return null
  if (typeof status !== "string" || status === "") return null
  const remainingQuery = { ...query }
  delete remainingQuery.type
  delete remainingQuery.status
  return { type, status, query: remainingQuery }
}
