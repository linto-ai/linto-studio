const METADATA_TIMEOUT_MS = 10000

/**
 * Duration of an audio or video file, read from its metadata by the browser
 * without decoding it. Unknown when the browser can't read the file.
 * @param {Blob} file
 * @returns {Promise<number|null>} seconds, null when unknown
 */
export function readMediaDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const media = document.createElement("video")
    const timer = setTimeout(() => finish(null), METADATA_TIMEOUT_MS)

    function finish(duration) {
      clearTimeout(timer)
      URL.revokeObjectURL(url)
      resolve(Number.isFinite(duration) ? duration : null)
    }

    media.preload = "metadata"
    media.onloadedmetadata = () => finish(media.duration)
    media.onerror = () => finish(null)
    media.src = url
  })
}
