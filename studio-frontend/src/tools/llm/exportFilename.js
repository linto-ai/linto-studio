import { formatTimestamp } from "../formatDate.js"

// Builds a download filename of the form `<slug>_<timestamp>.<ext>`.
// Spaces in the source name are replaced with underscores; the extension
// argument may or may not start with a dot.

export function exportFilename(name, ext) {
  const base = (name || "export").replace(/\s/g, "_")
  const normalizedExt = ext.startsWith(".") ? ext : `.${ext}`
  return `${base}_${formatTimestamp()}${normalizedExt}`
}
