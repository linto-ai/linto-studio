const { toWireWords } = require("./toWireWords")

/** Broadcast shape of a full turn (turn_split, turns_merged). */
function toWireTurn(turn) {
  return {
    turnId: turn.turn_id,
    text: turn.segment,
    words: toWireWords(turn.words),
    stime: turn.stime,
    etime: turn.etime,
    speakerId: turn.speaker_id ?? null,
    language: turn.language || "",
  }
}

module.exports = { toWireTurn }
