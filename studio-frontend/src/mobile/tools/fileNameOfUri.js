/**
 * Name of the file a `file://` URI points to: the same file keeps its name
 * whatever the URI looks like (cache or app folder, encoded or not).
 * @param {string|null|undefined} uri
 * @returns {string} "" when there is no URI
 */
export function fileNameOfUri(uri) {
  const lastSegment = (uri || "").split("/").pop()
  try {
    return decodeURIComponent(lastSegment)
  } catch {
    return lastSegment
  }
}
