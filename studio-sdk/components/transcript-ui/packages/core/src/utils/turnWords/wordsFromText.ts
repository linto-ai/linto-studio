import { tokenize } from "../tokenize"
import { wordId } from "./wordId"
import type { Word } from "../../types/editor"

/** Derive the word list from a turn's plain text (no timestamps — those are
 *  carried over or broadcast by the server). */
export function wordsFromText(turnId: string, text: string): Word[] {
  return tokenize(text).map((t, i) => ({
    id: wordId(turnId, i),
    text: t.text,
    charStart: t.charStart,
    charEnd: t.charEnd,
  }))
}
