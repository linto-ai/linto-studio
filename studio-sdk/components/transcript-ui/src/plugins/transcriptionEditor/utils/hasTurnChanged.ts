import type { Turn } from "../../../types/editor"

/** Comparison of the fields storeSync mirrors between PM and the store. Words
 *  are compared element-wise (id + text): for a word turn `text` is null on both
 *  sides, so a same-count in-word edit (typo fix, split/merge keeping the count)
 *  would otherwise look unchanged and never reach the store. */
export function hasTurnChanged(a: Turn, b: Turn): boolean {
  if (
    a.text !== b.text ||
    a.speakerId !== b.speakerId ||
    a.language !== b.language ||
    a.startTime !== b.startTime ||
    a.endTime !== b.endTime ||
    a.words.length !== b.words.length
  ) {
    return true
  }
  for (let i = 0; i < a.words.length; i++) {
    const x = a.words[i]!
    const y = b.words[i]!
    if (x.id !== y.id || x.text !== y.text) return true
  }
  return false
}
