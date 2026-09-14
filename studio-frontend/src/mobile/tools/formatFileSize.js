/**
 * Bytes as "18 Mo" / "512 ko" (French units, decimal).
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes >= 1_000_000)
    return `${(bytes / 1_000_000).toFixed(bytes >= 10_000_000 ? 0 : 1)} Mo`
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} ko`
  return `${bytes} o`
}
