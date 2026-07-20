import type { ApiWord } from "../../types/api"
import type { TurnStore } from "../../core/types"

/**
 * Timestamps live outside the Y.Doc (which carries plain text only) and
 * travel through Hocuspocus stateless messages: the client sends
 * REQUEST_WORDS_MESSAGE, the server answers with `timestamps_recalc` chunks —
 * per turn, an ORDERED token list (the business format), no wids, no offsets.
 * Alignment is positional: the i-th payload token times the i-th local token.
 */
export const REQUEST_WORDS_MESSAGE = JSON.stringify({ type: "request_words" })

interface TimestampsRecalcPayload {
  type: "timestamps_recalc"
  turns: Array<{ turn_id: string; words: ApiWord[] }>
}

/** Apply a `timestamps_recalc` payload to the turn store. Unknown or
 *  malformed payloads are ignored. */
export function applyStatelessPayload(
  payload: string,
  turnStore: TurnStore,
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

    const currentTurn = turnStore.getTurn(t.turn_id)
    if (!currentTurn) continue
    // The doc owns the word list (tokenized text seeds the store's words). A
    // word-less turn is text-only (live) or not yet mirrored — nothing to time.
    if (currentTurn.words.length === 0) continue

    // Placeholder (whitespace-only) payload words never enter the doc — drop
    // them so indices line up with the tokenized text.
    const incoming = t.words.filter((w) => (w.word ?? "").trim() !== "")

    // A token-count mismatch means a local edit is in flight: the server will
    // re-flush and re-broadcast right after — skip rather than mistime.
    if (incoming.length !== currentTurn.words.length) continue

    const merged = currentTurn.words.map((w, i) => {
      const inc = incoming[i]!
      // Per-token drift gate: same count but different text at this index —
      // keep the local word untimed rather than borrowing a wrong timing.
      if (inc.word !== w.text) return w
      return {
        ...w,
        ...(inc.stime !== undefined && { startTime: inc.stime }),
        ...(inc.etime !== undefined && { endTime: inc.etime }),
        ...(inc.confidence !== undefined && { confidence: inc.confidence }),
      }
    })

    turnStore.updateWords(t.turn_id, merged)
  }
}
