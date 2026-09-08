// "@Acme.com " -> "acme.com"
export function normalizeEmailDomain(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
}
