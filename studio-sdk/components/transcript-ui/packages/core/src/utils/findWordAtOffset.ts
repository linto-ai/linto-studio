import type { Word } from "../types/editor"

/** The word whose [charStart, charEnd) range contains the offset, if any —
 *  words without offsets (defensive) never match. */
export function findWordAtOffset(
  words: Word[],
  offset: number,
): Word | undefined {
  return words.find(
    (w) =>
      w.charStart != null &&
      w.charEnd != null &&
      w.charStart <= offset &&
      offset < w.charEnd,
  )
}
