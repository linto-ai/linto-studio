/**
 * Merge two adjacent turns. Server-side variant: the surviving turn id is
 * provided by the caller (TipTap's joinBackward keeps the previous turn's id).
 *
 * @param {object} startTurn
 * @param {object} endTurn
 * @param {string} survivorId - the id that should be kept on the merged turn
 * @returns {object}
 */
function mergeTurn(startTurn, endTurn, survivorId) {
  const words = [...startTurn.words, ...endTurn.words]
  const segment = `${startTurn.segment} ${endTurn.segment}`.trim()

  // Keep the structural fields of the surviving turn (whichever id matches).
  // Fall back to startTurn if neither matches (defensive).
  const base =
    survivorId === endTurn.turn_id ? endTurn : startTurn

  return {
    ...base,
    turn_id: survivorId,
    words,
    segment,
    raw_segment: segment,
  }
}

module.exports = { mergeTurn }
