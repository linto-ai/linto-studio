/**
 * Turns an apiCreateConversation failure into a stable error for the queue.
 * Network failures (no HTTP code, or browser offline) are retried later;
 * server refusals stay as errors until the user acts.
 * @param {{ errorCode?: string, errorData?: object }} result
 * @param {boolean} online - navigator.onLine at failure time
 * @returns {{ code: string, retryable: boolean, maxSize?: string }}
 */
export function mapUploadError({ errorCode, errorData }, online) {
  if (errorCode === "FILE_TOO_LARGE") {
    return {
      code: "file_too_large",
      retryable: false,
      maxSize: errorData?.maxSize,
    }
  }
  if (errorCode) {
    return { code: "rejected", retryable: false }
  }
  if (!online) {
    return { code: "offline", retryable: true }
  }
  return { code: "network", retryable: true }
}
