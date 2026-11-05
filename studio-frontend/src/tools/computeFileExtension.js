/**
 * @param {string} fileName
 * @returns {string|null} the lowercase last extension, null without one
 */
export function computeFileExtension(fileName) {
  return fileName.match(/\.([^/.]+)$/)?.[1].toLowerCase() ?? null
}
