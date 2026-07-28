import type { WireTurn } from "../../../core/types"
import type { Turn } from "../../../types/editor"
import { wordsFromApi } from "../../../utils/turnWords"

/** Store Turn from a structural broadcast's wire turn (split/merge halves). */
export function toStoreTurn(wire: WireTurn): Turn {
  const words = wordsFromApi(wire.turnId, wire.words)
  return {
    id: wire.turnId,
    speakerId: wire.speakerId ?? null,
    // Turn contract: text carries the content only when words is empty.
    text: words.length > 0 ? null : wire.text,
    words,
    ...(wire.stime !== undefined && { startTime: wire.stime }),
    ...(wire.etime !== undefined && { endTime: wire.etime }),
    language: wire.language ?? "",
  }
}
