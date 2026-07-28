const { computeWordLayout } = require("./computeWordLayout")
const {
  firstDefinedTime,
  lastDefinedTime,
  assignTurnTimes,
} = require("./turnTimes")

function deriveText(turn) {
  const laid = computeWordLayout(turn.words)
  if (laid.length > 0) return laid.map((w) => w.text).join(" ")
  return (turn.segment || "").replace(/\s+/g, " ").trim()
}

/**
 * Merge two ADJACENT turns (document order: first then second) into one.
 * Deterministic, no retime: texts and words concatenate verbatim, turn-level
 * times are the outer bounds.
 *
 * The LARGER turn (derived-text character length, first wins ties) provides
 * every attribute — id, speaker, language, foreign fields: merging a short
 * interjection into a long turn must not relabel the whole result.
 *
 * @param {object} firstTurn - Mongo turn, document order
 * @param {object} secondTurn
 * @returns {object} the merged Mongo turn
 */
function computeMergedTurn(firstTurn, secondTurn) {
  const firstText = deriveText(firstTurn)
  const secondText = deriveText(secondTurn)
  const larger = secondText.length > firstText.length ? secondTurn : firstTurn

  const segment = [firstText, secondText].filter((t) => t !== "").join(" ")
  const words = [...(firstTurn.words || []), ...(secondTurn.words || [])]

  const merged = { ...larger, segment, raw_segment: segment, words }
  assignTurnTimes(
    merged,
    firstDefinedTime(words, "stime") ?? firstTurn.stime ?? secondTurn.stime,
    lastDefinedTime(words, "etime") ?? secondTurn.etime ?? firstTurn.etime,
  )
  return merged
}

module.exports = { computeMergedTurn }
