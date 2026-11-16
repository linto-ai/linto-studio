const TIMEOUT_CODES = ["ECONNABORTED", "ETIMEDOUT"]

/**
 * Why a sendRequest result shows the API is not usable, for the "API
 * unreachable" page's technical details; null when it answered fine.
 * @param {{ status: string, data?: object, error?: { code?: string, response?: { status: number } } } | undefined} result
 * @param {(data: object) => boolean} [isExpectedAnswer] - for a success, whether its body is the expected one
 * @returns {{ reason: "timeout" | "network" | "unexpected" } | { reason: "http", status: number } | null}
 */
export function computeApiFailure(result, isExpectedAnswer = () => true) {
  switch (true) {
    case result?.status === "success" && isExpectedAnswer(result.data):
      return null
    case result?.status === "success":
      return { reason: "unexpected" }
    case Boolean(result?.error?.response):
      return { reason: "http", status: result.error.response.status }
    case TIMEOUT_CODES.includes(result?.error?.code):
      return { reason: "timeout" }
    default:
      return { reason: "network" }
  }
}
