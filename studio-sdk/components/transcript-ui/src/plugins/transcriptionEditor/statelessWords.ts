import { mapWord } from "../../adapters/apiAdapter"
import type { ApiWord } from "../../types/api"
import type { TranslationStore } from "../../core/types"
import type { Word } from "../../types/editor"

/**
 * Timestamps live outside the Y.Doc (which carries word identity + text) and
 * travel through Hocuspocus stateless messages: the client sends
 * REQUEST_WORDS_MESSAGE, the server answers with `timestamps_recalc` chunks
 * keyed by wid.
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

    const currentTurn = translation.getTurn(t.turn_id)
    if (!currentTurn) continue
    // The doc owns the word list (it seeds the store's words). If the turn has
    // none it is a text-only turn (or not yet seeded) — do NOT adopt the
    // server's list, which would resurrect deleted words or wipe the text via
    // updateTurnWords setting text:null.
    if (currentTurn.words.length === 0) continue

    // Merge timestamps BY wid, no text gate: a payload for a word still present
    // applies even if the surrounding text changed since the flush. Words the
    // doc no longer has (deleted, or belonging to another turn now) are ignored.
    const incoming = new Map<string, Word>()
    for (const aw of t.words) {
      const w = mapWord(aw)
      incoming.set(w.id, w)
    }

    const merged = currentTurn.words.map((w) => {
      const inc = incoming.get(w.id)
      if (!inc) return w
      return {
        ...w,
        ...(inc.startTime !== undefined && { startTime: inc.startTime }),
        ...(inc.endTime !== undefined && { endTime: inc.endTime }),
        ...(inc.confidence !== undefined && { confidence: inc.confidence }),
      }
    })

    translation.updateWords(t.turn_id, merged)
  }
}
