import type { Turn } from "../types/editor"

/** A turn's editable plain text: the words joined by single spaces (the
 *  normalized whitespace contract shared with the server), or the raw text
 *  for words-less turns. */
export function computeTurnPlainText(turn: Turn): string {
  if (turn.words.length > 0) return turn.words.map((w) => w.text).join(" ")
  return turn.text ?? ""
}
