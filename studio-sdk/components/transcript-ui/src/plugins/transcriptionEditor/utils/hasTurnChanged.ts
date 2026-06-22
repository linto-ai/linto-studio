import type { Turn } from "../../../types/editor"

/** Shallow comparison of the fields storeSync mirrors between PM and the store. */
export function hasTurnChanged(a: Turn, b: Turn): boolean {
  return (
    a.text !== b.text ||
    a.speakerId !== b.speakerId ||
    a.language !== b.language ||
    a.startTime !== b.startTime ||
    a.endTime !== b.endTime ||
    a.words.length !== b.words.length
  )
}
