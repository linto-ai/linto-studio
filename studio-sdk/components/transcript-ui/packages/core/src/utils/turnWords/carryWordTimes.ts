import type { Word } from "../../types/editor"

/**
 * Carry timestamps from the previous word list onto freshly derived tokens by
 * anchoring on the common prefix and suffix (token text equality). The edited
 * middle stays untimed until the server broadcasts recomputed timings (it
 * re-flushes after every edit, so the gap lasts about a debounce). Cheap,
 * deterministic, and wrong only transiently — by design.
 */
export function carryWordTimes(next: Word[], prev: Word[]): Word[] {
  const max = Math.min(next.length, prev.length)
  let prefix = 0
  while (prefix < max && next[prefix]!.text === prev[prefix]!.text) prefix++
  let suffix = 0
  while (
    suffix < max - prefix &&
    next[next.length - 1 - suffix]!.text === prev[prev.length - 1 - suffix]!.text
  ) {
    suffix++
  }

  return next.map((w, i) => {
    const from =
      i < prefix
        ? prev[i]
        : i >= next.length - suffix
          ? prev[prev.length - (next.length - i)]
          : undefined
    if (!from) return w
    return {
      ...w,
      ...(from.startTime !== undefined && { startTime: from.startTime }),
      ...(from.endTime !== undefined && { endTime: from.endTime }),
      ...(from.confidence !== undefined && { confidence: from.confidence }),
    }
  })
}
