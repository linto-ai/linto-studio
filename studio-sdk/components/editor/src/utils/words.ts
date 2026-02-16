import type { Word } from '../types/editor'

export function findActiveWord(words: Word[], time: number): string | null {
  let lo = 0
  let hi = words.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    const w = words[mid] as Word
    if (time < w.startTime) {
      hi = mid - 1
    } else if (time > w.endTime) {
      lo = mid + 1
    } else {
      return w.id
    }
  }
  return null
}
