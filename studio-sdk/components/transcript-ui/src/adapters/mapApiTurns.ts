import type { ApiTurn } from "../types/api"
import type { Turn } from "../types/editor"
import { wordsFromApi } from "../utils/turnWords"

/**
 * Map backend turns (one translation's `text` array) onto editor Turns.
 *
 * This is where the editor's input invariants are enforced — positional word
 * identity (`turnId#index`), offsets on the single-space layout shared with
 * the server, silence placeholders dropped, wire wid ignored. Embedders fetch
 * and assemble the document topology themselves, but the per-turn mapping
 * must go through here.
 */
export function mapApiTurns(apiTurns: ApiTurn[]): Turn[] {
  return apiTurns.map((t) => {
    const words = wordsFromApi(t.turn_id, t.words)
    const startTime = words[0]?.startTime ?? t.stime
    const endTime =
      words.length > 0 ? (words[words.length - 1]!.endTime ?? t.etime) : t.etime

    return {
      id: t.turn_id,
      speakerId: t.speaker_id || null,
      text: words.length > 0 ? null : t.segment,
      words,
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      // The ApiTurn type says required; real payloads disagree.
      language: t.language ?? "",
    }
  })
}
