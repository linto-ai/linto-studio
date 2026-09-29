/**
 * Resolves true as soon as the predicate holds, false once the timeout has
 * passed. Polls: the observed state has no event to subscribe to.
 * @param {() => boolean} predicate
 * @param {{ timeoutMs: number, intervalMs?: number, now?: () => number }} options
 * @returns {Promise<boolean>}
 */
export function waitUntil(
  predicate,
  { timeoutMs, intervalMs = 200, now = Date.now },
) {
  const deadline = now() + timeoutMs
  return new Promise((resolve) => {
    function check() {
      if (predicate()) return resolve(true)
      if (now() >= deadline) return resolve(false)
      setTimeout(check, intervalMs)
    }
    check()
  })
}
