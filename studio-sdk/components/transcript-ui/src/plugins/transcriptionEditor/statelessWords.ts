import { mapWord } from "../../adapters/apiAdapter"
import type { ApiWord } from "../../types/api"
import type { TranslationStore } from "../../core/types"

/**
 * Words+timestamps live outside the Y.Doc (which carries segments only) and
 * travel through Hocuspocus stateless messages: the client sends
 * REQUEST_WORDS_MESSAGE, the server answers with `timestamps_recalc` chunks.
 */
export const REQUEST_WORDS_MESSAGE = JSON.stringify({ type: "request_words" })

interface TimestampsRecalcPayload {
  type: "timestamps_recalc"
  turns: Array<{ turn_id: string; words: ApiWord[] }>
}

/** Apply a `timestamps_recalc` payload to the translation store. Unknown or
 *  malformed payloads are ignored. */
export function applyStatelessPayload(
  payload: string,
  translation: TranslationStore,
): void {
  let msg: TimestampsRecalcPayload
  try {
    msg = JSON.parse(payload)
  } catch {
    return
  }
  if (!msg || msg.type !== "timestamps_recalc" || !Array.isArray(msg.turns))
    return

  for (const t of msg.turns) {
    if (!t || !t.turn_id || !Array.isArray(t.words)) continue

    const currentTurn = translation.turns.value.find((x) => x.id === t.turn_id)
    if (!currentTurn) continue

    const words = t.words.map(mapWord)

    // Drop stale payloads: if the words don't describe the current segment
    // (because the user kept editing while the server was recomputing), skip.
    // The next debounce tick will resend a coherent payload.
    const wordsText = normalizeText(
      words
        .filter((w) => w.text !== "")
        .map((w) => w.text)
        .join(" "),
    )
    const currentText = normalizeText(
      currentTurn.text ?? currentTurn.words.map((w) => w.text).join(" "),
    )
    if (wordsText !== currentText) continue

    translation.updateWords(t.turn_id, words)
  }
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}
