/**
 * Whether a sendRequest result failed without any answer from the server
 * (network down, instance off, CORS refusal): not a refusal of the session.
 * @param {{ status: string, error?: { response?: object } } | undefined} result
 * @returns {boolean}
 */
export function isUnreachableResult(result) {
  return result?.status === "error" && !result.error?.response
}
