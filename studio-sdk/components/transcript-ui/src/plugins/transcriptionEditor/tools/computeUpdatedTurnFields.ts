import type { Turn, Word } from "../../../types/editor"
import { wordsFromText, carryWordTimes } from "../../../utils/turnWords"

/**
 * The TurnStore patch for an edited text: words re-derived positionally, with
 * the previous timings carried onto the unchanged prefix/suffix (the edited
 * middle stays untimed until the server broadcasts the retimed truth).
 * Turn contract: text carries the content only when words is empty.
 */
export function computeUpdatedTurnFields(
  turnId: string,
  text: string,
  oldWords: Word[],
): Pick<Turn, "text" | "words"> {
  const words = carryWordTimes(wordsFromText(turnId, text), oldWords)
  return { text: words.length > 0 ? null : text, words }
}
