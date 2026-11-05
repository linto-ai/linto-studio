/**
 * @param {string} fileName
 * @returns {string} the name without its last extension
 */
export function removeFileExtension(fileName) {
  return fileName.replace(/\.[^/.]+$/, "")
}
