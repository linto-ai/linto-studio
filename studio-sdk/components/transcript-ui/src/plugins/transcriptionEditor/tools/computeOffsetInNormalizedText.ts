/**
 * Map a caret offset in the RAW typed text onto the normalized string
 * (whitespace runs collapsed to single spaces, trimmed) — the offset space
 * the server and every client share. A cut inside a whitespace run lands on
 * its single surviving space; the result is clamped to the normalized length
 * (a caret past the trailing spaces maps to the end).
 */
export function computeOffsetInNormalizedText(
  raw: string,
  offset: number,
): number {
  const prefix = raw.slice(0, Math.max(0, offset))
  const normalizedPrefix = prefix.replace(/\s+/g, " ").replace(/^\s/, "")
  const normalizedLength = raw.replace(/\s+/g, " ").trim().length
  return Math.min(normalizedPrefix.length, normalizedLength)
}
