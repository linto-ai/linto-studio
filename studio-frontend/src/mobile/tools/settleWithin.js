/**
 * How a promise ends within a delay, without ever rejecting: its value,
 * its error, or a timeout (the promise may still settle later).
 * @template T
 * @param {Promise<T>} promise
 * @param {number} timeoutMs
 * @returns {Promise<{ status: "done", value: T } | { status: "failed", error: unknown } | { status: "timeout" }>}
 */
export function settleWithin(promise, timeoutMs) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve({ status: "timeout" }), timeoutMs)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve({ status: "done", value })
      },
      (error) => {
        clearTimeout(timer)
        resolve({ status: "failed", error })
      },
    )
  })
}
