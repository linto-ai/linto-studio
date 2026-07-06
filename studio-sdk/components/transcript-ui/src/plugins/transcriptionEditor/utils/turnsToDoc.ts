import type { Turn } from "../../../types/editor"
import type { JSONContent } from "@tiptap/core"

/** Convert a Turn[] array into TipTap-compatible JSON content (plain text —
 *  the document carries no word marks; words/timestamps live in the store). */
export function turnsToDoc(turns: Turn[]): JSONContent {
  return {
    type: "doc",
    content: turns.map((turn) => turnToNode(turn)),
  }
}

function turnToNode(turn: Turn): JSONContent {
  // Empty/whitespace-only words are timestamp placeholders over silences; the
  // silence gap is implicit in the neighbouring words' start/end times.
  const spokenWords = turn.words.filter((w) => (w.text ?? "").trim() !== "")

  // Whitespace invariant (same as the server's turnsToDoc): single spaces,
  // no leading/trailing whitespace — offsets derived by tokenization on both
  // sides stay aligned. Normalized on BOTH branches: store words normally
  // come token-clean from layoutWords, but live adapters may not guarantee it.
  const raw =
    spokenWords.length > 0
      ? spokenWords.map((w) => w.text).join(" ")
      : (turn.text ?? "")
  const text = raw.replace(/\s+/g, " ").trim()

  return {
    type: "turn",
    attrs: {
      id: turn.id,
      speakerId: turn.speakerId,
      startTime: turn.startTime,
      endTime: turn.endTime,
      startDate: turn.startDate,
      endDate: turn.endDate,
      language: turn.language,
    },
    content: text ? [{ type: "text", text }] : undefined,
  }
}
