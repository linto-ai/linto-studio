/**
 * Convert MongoDB-format turns[] into TipTap-compatible JSON content.
 *
 * MongoDB turn shape: { turn_id, speaker_id, segment, words: [{ word, stime, etime }], language }
 * Output: ProseMirror JSON. Each turn holds PLAIN TEXT: the spoken words
 * joined by single spaces (or the segment when there are no words). Word
 * identity and timestamps stay out of the doc — they live in WordsState/Mongo,
 * aligned to the text by tokenization.
 *
 * Whitespace invariant: seeded text never has leading/trailing whitespace nor
 * runs of multiple spaces, so client and server tokenize it identically.
 */
function turnsToDoc(mongoTurns) {
  return {
    type: "doc",
    content: mongoTurns.map(turnToNode),
  }
}

// Collapse any whitespace run (incl. non-breaking spaces) to a single space.
function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim()
}

function turnToNode(turn) {
  // Empty words are timestamp placeholders over silences; they carry no text.
  // The silence gap is implicit in the neighbouring words' stime/etime.
  const spokenWords = (turn.words || []).filter(
    (w) => (w.word || "").trim() !== "",
  )

  let text = ""
  if (spokenWords.length > 0) {
    text = normalizeWhitespace(spokenWords.map((w) => w.word).join(" "))
  } else if (turn.segment) {
    // No words[] (legacy turn): seed the segment as-is, normalized.
    text = normalizeWhitespace(turn.segment)
  }
  const content = text !== "" ? [{ type: "text", text }] : undefined

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
