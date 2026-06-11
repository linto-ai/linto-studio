import type { Word } from "../types/editor"

export function hasWordTimestamps(words: Word[]): boolean {
  return words.length > 0 && words[0]!.startTime !== undefined
}

/**
 * Margin in seconds around a word's [startTime, endTime] interval.
 * Avoids highlight "holes" during inter-word micro-gaps (silences,
 * punctuation). Beyond this margin no word is active.
 */
const ACTIVE_WORD_MARGIN = 1

/**
 * Returns the last word whose [startTime - margin, endTime + margin]
 * interval contains `time`, or null when no word is within
 * `ACTIVE_WORD_MARGIN` seconds of the current time.
 */
export function findActiveWord(words: Word[], time: number): string | null {
  if (!hasWordTimestamps(words)) return null
  for (const word of words) {
    if (word.startTime! - ACTIVE_WORD_MARGIN <= time && time <= word.endTime!) {
      return word.id
    }
  }
  return null
}
