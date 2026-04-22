/**
 * Convert MongoDB-format turns[] into TipTap-compatible JSON content.
 *
 * MongoDB turn shape: { turn_id, speaker_id, segment, words: [{ word, stime, etime }], language }
 * Output: ProseMirror JSON with Tiptap attrs: { id, speakerId, startTime, endTime, language }
 */
function turnsToDoc(mongoTurns) {
  return {
    type: "doc",
    content: mongoTurns.map(turnToNode),
  }
}

function turnToNode(turn) {
  const text =
    turn.words && turn.words.length > 0
      ? turn.words.map((w) => w.word).join(" ")
      : turn.segment || ""

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
    content: text ? [{ type: "text", text }] : undefined,
  }
}

module.exports = { turnsToDoc }
