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

  const merged = {
    ...base,
    turn_id: survivorId,
    words,
    segment,
    raw_segment: segment,
  }

  // Turn-level times (live sessions) must span the whole merged turn:
  // start of the first, end of the last — not the survivor's own span.
  // Turns without turn-level times gain none.
  if (startTurn.stime !== undefined) merged.stime = startTurn.stime
  if (endTurn.etime !== undefined) merged.etime = endTurn.etime

  return merged
}

module.exports = { mergeTurn }
