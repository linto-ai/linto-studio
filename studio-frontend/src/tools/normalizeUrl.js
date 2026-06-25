// Normalize a user-entered URL: trim surrounding whitespace and prepend
// https:// when no http(s) scheme is present. Returns "" for empty input.
export function normalizeUrl(raw) {
  const trimmed = (raw ?? "").trim()
  if (trimmed === "") return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
