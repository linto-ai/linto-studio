import type { Word } from "../types/editor"

/** True if at least one word carries a timestamp. Robust to sparse timing:
 *  freshly typed words (and split/merge products) may have no timestamp yet,
 *  and they can sit anywhere in the list — not just at index 0. */
export function hasWordTimestamps(words: Word[]): boolean {
  return words.some((w) => w.startTime != null)
}

/** First defined word start in the list (skips untimed leading words). */
export function firstWordStart(words: Word[]): number | undefined {
  for (const w of words) if (w.startTime != null) return w.startTime
  return undefined
}

/** Last defined word end in the list (skips untimed trailing words). */
export function lastWordEnd(words: Word[]): number | undefined {
  for (let i = words.length - 1; i >= 0; i--) {
    const e = words[i]!.endTime
    if (e != null) return e
  }
  return undefined
}

/**
 * Margin in seconds around a word's [startTime, endTime] interval.
 * Avoids highlight "holes" during inter-word micro-gaps (silences,
 * punctuation). Beyond this margin no word is active.
 */
const ACTIVE_WORD_MARGIN = 1

/**
 * Returns the first word whose [startTime - margin, endTime] interval contains
 * `time`, or null when none does. Words without timestamps are skipped (a typed
 * word with no timing yet is never "active").
 */
export function findActiveWord(words: Word[], time: number): string | null {
  for (const word of words) {
    if (word.startTime == null || word.endTime == null) continue
    if (word.startTime - ACTIVE_WORD_MARGIN <= time && time <= word.endTime) {
      return word.id
    }
  }
  return null
}
