import type { Turn } from "../../../types/editor"
import type { JSONContent } from "@tiptap/core"

/** Convert a Turn[] array into TipTap-compatible JSON content. */
export function turnsToDoc(turns: Turn[]): JSONContent {
  return {
    type: "doc",
    content: turns.map((turn) => turnToNode(turn)),
  }
}

function turnToNode(turn: Turn): JSONContent {
  // Empty words are timestamp placeholders over silences; they have no text
  // token to host a mark, so they never enter the doc. The silence gap is
  // implicit in the neighbouring words' start/end times.
  // Trim, not `!== ""`: a whitespace-only word carries no identifiable text —
  // if it entered the doc, fixWordMarks would strip its (whitespace) mark and
  // lose its wid. Treat it like an empty placeholder.
  const spokenWords = turn.words.filter((w) => (w.text ?? "").trim() !== "")

  let content: JSONContent[] | undefined
  if (spokenWords.length > 0) {
    content = []
    spokenWords.forEach((w, i) => {
      if (i > 0) content!.push({ type: "text", text: " " })
      content!.push({
        type: "text",
        text: w.text,
        // Each spoken word carries its identity (wid = Word.id) as a mark.
        marks: [{ type: "word", attrs: { wid: w.id || crypto.randomUUID() } }],
      })
    })
  } else if (turn.text) {
    // No words[] (live text-only turn): plain text; the client mints wids on edit.
    content = [{ type: "text", text: turn.text }]
  }

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
    content,
  }
}
