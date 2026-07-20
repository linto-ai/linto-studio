const { yXmlFragmentToProsemirrorJSON } = require("@tiptap/y-tiptap")
const { schema } = require("./serverSchema")

/**
 * Extract turns from a Y.Doc in MongoDB format.
 *
 * Converts Y.XmlFragment → ProseMirror JSON → turns[]. Turns carry PLAIN
 * TEXT: the segment is the concatenation of the turn's text children. Words
 * and timestamps are NOT in the doc — they are owned by WordsState, aligned
 * to the segment by tokenization (see words/tokenize.js), so there is no
 * `words` field here.
 *
 * @param {import("yjs").Doc} ydoc
 * @param {string} field - Y.XmlFragment field name
 * @returns {{ turn_id: string, speaker_id: string|null, segment: string, raw_segment: string, language: string, stime?: number, etime?: number }[]}
 */
function docToTurns(ydoc, field = "default") {
  const turnsFragment = ydoc.getXmlFragment(field)
  const json = yXmlFragmentToProsemirrorJSON(turnsFragment, schema)

  if (!json || !json.content) return []

  return json.content
    .filter((node) => node.type === "turn" && node.attrs && node.attrs.id)
    .map((node) => {
      const attrs = node.attrs
      let segment = ""

      for (const child of node.content || []) {
        if (child.type !== "text") continue
        segment += child.text
      }

      const turn = {
        turn_id: attrs.id,
        speaker_id: attrs.speakerId || null,
        segment,
        raw_segment: segment,
        language: attrs.language || "",
      }
      // Turn-level times (stime/etime): the source of truth when words carry no
      // timestamps (ASR without per-word timing). Carried on the doc as
      // startTime/endTime attrs; keep them so a flush never drops them.
      if (attrs.startTime != null) turn.stime = attrs.startTime
      if (attrs.endTime != null) turn.etime = attrs.endTime
      return turn
    })
}

module.exports = { docToTurns }
