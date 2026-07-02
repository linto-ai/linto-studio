import type { Turn } from "../../../types/editor"
import { firstWordStart, lastWordEnd } from "../../../utils/words"

/**
 * Merge a freshly-extracted turn (word identities from the doc, no timestamps)
 * with the stored one, carrying over each surviving word's timestamps BY wid.
 *
 * Word identity is authoritative in the doc, so this is a per-wid merge — not a
 * text comparison. Words new to the doc (just typed, or the far half of a split)
 * keep no timestamp until the server broadcasts one for their wid.
 */
export function mergeTurnPreservingWords(
  newTurn: Turn,
  oldTurn: Turn | undefined,
): Turn {
  if (!oldTurn || newTurn.words.length === 0) return newTurn

  const oldByWid = new Map(oldTurn.words.map((w) => [w.id, w]))
  const words = newTurn.words.map((w) => {
    const old = oldByWid.get(w.id)
    if (!old) return w
    return {
      ...w,
      ...(old.startTime !== undefined && { startTime: old.startTime }),
      ...(old.endTime !== undefined && { endTime: old.endTime }),
      ...(old.confidence !== undefined && { confidence: old.confidence }),
    }
  })

  // Derive turn-level times from the (now-timed) words so a split/merge updates
  // them instead of leaving the frozen doc attrs from seed time. Fall back to
  // the node attrs when no word is timed (ASR without per-word timing).
  const wStart = firstWordStart(words)
  const wEnd = lastWordEnd(words)
  return {
    ...newTurn,
    words,
    startTime: wStart ?? newTurn.startTime,
    endTime: wEnd ?? newTurn.endTime,
  }
}
