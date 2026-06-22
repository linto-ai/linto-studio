import type { Turn } from "../../../types/editor"

/**
 * Merge a freshly-extracted turn with the stored one, keeping the stored words
 * (= timestamps) when the text is unchanged.
 *
 * Compare whitespace-normalized, ignoring empty placeholder words: the doc text
 * never contains them, while stored words do — a raw join would see a phantom
 * difference and drop the words (= timestamps) on unrelated edits.
 */
export function mergeTurnPreservingWords(
  newTurn: Turn,
  oldTurn: Turn | undefined,
): Turn {
  if (!oldTurn) return newTurn
  const oldText =
    oldTurn.text ??
    oldTurn.words
      .filter((w) => w.text !== "")
      .map((w) => w.text)
      .join(" ")
  return normalizeText(newTurn.text ?? "") === normalizeText(oldText)
    ? { ...newTurn, words: oldTurn.words }
    : newTurn
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}
