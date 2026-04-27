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
  const text = turn.words.length > 0
    ? turn.words.map((w) => w.text).join(" ")
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
