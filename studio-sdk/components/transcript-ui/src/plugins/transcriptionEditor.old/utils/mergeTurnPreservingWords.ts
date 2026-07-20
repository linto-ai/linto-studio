import type { Turn } from "../../../types/editor"
import { carryWordTimes } from "../../../utils/turnWords"
import { firstWordStart, lastWordEnd } from "../../../utils/words"

/**
 * Merge a freshly-extracted turn (words derived from the doc text, no
 * timestamps) with the stored one, carrying timestamps over the common
 * prefix/suffix of tokens (see carryWordTimes). The edited middle stays
 * untimed until the server broadcasts recomputed timings.
 */
export function mergeTurnPreservingWords(
  newTurn: Turn,
  oldTurn: Turn | undefined,
): Turn {
  if (!oldTurn || newTurn.words.length === 0) return newTurn

  const words = carryWordTimes(newTurn.words, oldTurn.words)

  // Derive turn-level times from the (now-timed) words so a split/merge
  // updates them instead of leaving the frozen doc attrs from seed time. Fall
  // back to the node attrs when no word is timed (ASR without per-word timing).
  const wStart = firstWordStart(words)
  const wEnd = lastWordEnd(words)
  return {
    ...newTurn,
    words,
    startTime: wStart ?? newTurn.startTime,
    endTime: wEnd ?? newTurn.endTime,
  }
}
