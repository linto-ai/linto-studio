const { yXmlFragmentToProsemirrorJSON } = require("@tiptap/y-tiptap")
const { schema } = require("./serverSchema")

/**
 * Extract turns from a Y.Doc in MongoDB format.
 *
 * Converts Y.XmlFragment → ProseMirror JSON → MongoDB-format turns[]. Word
 * IDENTITY is read from the inline `word` mark on each text node; timestamps
 * are NOT in the doc (filled by enrichDiff from the last-flushed Mongo state,
 * keyed by wid). Words here carry only { wid, word }.
 *
 * @param {import("yjs").Doc} ydoc
 * @param {string} field - Y.XmlFragment field name
 * @returns {{ turn_id: string, speaker_id: string|null, segment: string, raw_segment: string, words: {wid:string, word:string}[], language: string }[]}
 */
function docToTurns(ydoc, field = "default") {
  const fragment = ydoc.getXmlFragment(field)
  const json = yXmlFragmentToProsemirrorJSON(fragment, schema)

  if (!json || !json.content) return []

  return json.content
    .filter((node) => node.type === "turn" && node.attrs && node.attrs.id)
    .map((node) => {
      const attrs = node.attrs
      let segment = ""
      const words = []

      for (const child of node.content || []) {
        if (child.type !== "text") continue
        segment += child.text
        const wordMark = (child.marks || []).find((m) => m.type === "word")
        if (wordMark && wordMark.attrs && wordMark.attrs.wid) {
          words.push({ wid: wordMark.attrs.wid, word: child.text })
        }
      }

      const turn = {
        turn_id: attrs.id,
        speaker_id: attrs.speakerId || null,
        segment,
        raw_segment: segment,
        words,
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
