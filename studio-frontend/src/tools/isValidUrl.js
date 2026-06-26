import { normalizeUrl } from "./normalizeUrl"

// A URL is considered valid when, after normalization (https:// prefixed), it
// parses and its host looks like a real domain — i.e. it contains a dot and
// does not start/end with one ("a.b" ok, "a." or ".b" rejected).
export function isValidUrl(raw) {
  const normalized = normalizeUrl(raw)
  if (normalized === "") return false
  try {
    const { hostname } = new URL(normalized)
    return (
      hostname.includes(".") &&
      !hostname.startsWith(".") &&
      !hostname.endsWith(".")
    )
  } catch {
    return false
  }
}
