import type { Turn } from "../../../types/editor"
import type { JSONContent } from "@tiptap/core"

/** Convert a Turn[] array into TipTap-compatible JSON content */
export function turnsToDoc(turns: Turn[]): JSONContent {
  return {
    type: "doc",
    content: turns.map((turn) => turnToNode(turn)),
  }
}

function turnToNode(turn: Turn): JSONContent {
  // Empty words are timestamp placeholders over silences — keep them out of
  // the text (joining them produces double spaces).
  const spokenWords = turn.words.filter((w) => w.text !== "")
  const text = spokenWords.length > 0
    ? spokenWords.map((w) => w.text).join(" ")
    : turn.text ?? ""

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
