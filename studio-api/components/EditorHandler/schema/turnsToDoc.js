const { v4: uuidv4 } = require("uuid")

/**
 * Convert MongoDB-format turns[] into TipTap-compatible JSON content.
 *
 * MongoDB turn shape: { turn_id, speaker_id, segment, words: [{ wid, word, stime, etime }], language }
 * Output: ProseMirror JSON. Each spoken word becomes a text node wearing the
 * `word` mark { wid }, separated by unmarked space text nodes — so word
 * identity (wid) lives in the doc. Timestamps stay out of the doc.
 */
function turnsToDoc(mongoTurns) {
  return {
    type: "doc",
    content: mongoTurns.map(turnToNode),
  }
}

function turnToNode(turn) {
  // Empty words are timestamp placeholders over silences; they have no text
  // token to host a mark, so they never enter the doc. The silence gap is
  // implicit in the neighbouring words' stime/etime.
  // Trim, not `!== ""`: a whitespace-only word has no identifiable text and
  // would lose its mark/wid on the client; treat it like an empty placeholder.
  const spokenWords = (turn.words || []).filter(
    (w) => (w.word || "").trim() !== "",
  )

  let content
  if (spokenWords.length > 0) {
    content = []
    spokenWords.forEach((w, i) => {
      if (i > 0) content.push({ type: "text", text: " " })
      content.push({
        type: "text",
        text: w.word,
        // Legacy words may lack a wid — mint one so the doc invariant
        // (one word mark = one unique wid) holds from the first seed.
        marks: [{ type: "word", attrs: { wid: w.wid || uuidv4() } }],
      })
    })
  } else if (turn.segment) {
    // No words[] (legacy turn): seed plain text; the client mints wids on edit.
    content = [{ type: "text", text: turn.segment }]
  }

  const firstWordStime =
    turn.words && turn.words.length > 0 ? turn.words[0]?.stime : null
  const startTime = firstWordStime ?? turn.stime

  const lastWordEtime =
    turn.words && turn.words.length > 0
      ? turn.words[turn.words.length - 1]?.etime
      : null
  const endTime = lastWordEtime ?? turn.etime

  return {
    type: "turn",
    attrs: {
      id: turn.turn_id,
      speakerId: turn.speaker_id || null,
      startTime,
      endTime,
      language: turn.language || turn.lang || "",
    },
    content,
  }
}

module.exports = { turnsToDoc }
