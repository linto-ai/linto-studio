/**
 * Formats a file size in bytes into a human-readable string.
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (!bytes) return ""
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
