// Server answers that may succeed later without the user doing anything:
// timeout, rate limit, gateway or server temporarily unavailable.
const TRANSIENT_HTTP_STATUSES = [408, 429, 502, 503, 504]

/**
 * Turns an apiCreateConversation failure into a stable error for the queue.
 * No answer from the server (network down, browser offline) or a transient
 * HTTP status is retried later; any other answer is a refusal that stays
 * as an error until the user acts, so the file is not sent again for
 * nothing.
 * @param {{ errorCode?: string, errorData?: object, httpStatus?: number }} result
 * @param {boolean} online - navigator.onLine at failure time
 * @returns {{ code: string, retryable: boolean, maxSize?: string }}
 */
export function mapUploadError({ errorCode, errorData, httpStatus }, online) {
  if (errorCode === "FILE_TOO_LARGE") {
    return {
      code: "file_too_large",
      retryable: false,
      maxSize: errorData?.maxSize,
    }
  }
  if (errorCode === "SAAS_QUOTA_EXCEEDED") {
    return { code: "quota", retryable: false }
  }
  if (TRANSIENT_HTTP_STATUSES.includes(httpStatus)) {
    return { code: "network", retryable: true }
  }
  if (errorCode || httpStatus) {
    return { code: "rejected", retryable: false }
  }
  if (!online) {
    return { code: "offline", retryable: true }
  }
  return { code: "network", retryable: true }
}
