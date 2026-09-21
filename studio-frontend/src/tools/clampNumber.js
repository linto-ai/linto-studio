// A null or undefined bound leaves that side open.
export function clampNumber(value, min = null, max = null) {
  return Math.max(min ?? -Infinity, Math.min(max ?? Infinity, value))
}
