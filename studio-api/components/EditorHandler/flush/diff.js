/**
 * Compute the diff between old turns (last flushed) and new turns (from Y.Doc).
 * Both arrays are in MongoDB format (turn_id, speaker_id, segment, words, ...).
 *
 * @param {Array} oldTurns - Last flushed turns (from Mongo, with words)
 * @param {Array} newTurns - Current turns extracted from Y.Doc (words=[])
 * @returns {{ updates: Array, additions: Array, deletions: string[] }}
 */
function computeDiff(oldTurns, newTurns) {
  const oldById = new Map(oldTurns.map((t) => [t.turn_id, t]))
  const newById = new Map(newTurns.map((t) => [t.turn_id, t]))

  const updates = []
  const additions = []
  const deletions = []

  for (const newTurn of newTurns) {
    const oldTurn = oldById.get(newTurn.turn_id)
    if (!oldTurn) {
      additions.push(newTurn)
    } else if (hasTurnChanged(oldTurn, newTurn)) {
      updates.push(mergeTurnForUpdate(oldTurn, newTurn))
    }
  }

  for (const oldTurn of oldTurns) {
    if (!newById.has(oldTurn.turn_id)) {
      deletions.push(oldTurn.turn_id)
    }
  }

  return { updates, additions, deletions }
}

/**
 * Check if a turn has changed between the old and new state.
 * Only compares text (segment) and speaker — words/timestamps are not in Y.Doc.
 */
function hasTurnChanged(oldTurn, newTurn) {
  return (
    oldTurn.segment !== newTurn.segment ||
    oldTurn.speaker_id !== newTurn.speaker_id
  )
}

/**
 * Merge old turn data into the new turn for update.
 * Preserves words from old turn if text hasn't changed, clears them if text changed.
 */
function mergeTurnForUpdate(oldTurn, newTurn) {
  if (oldTurn.segment === newTurn.segment) {
    // Only speaker changed — preserve words and raw_segment
    return { ...newTurn, words: oldTurn.words, raw_segment: oldTurn.raw_segment }
  }
  // Text changed — words are no longer valid
  return { ...newTurn, words: [], raw_segment: newTurn.segment }
}

module.exports = { computeDiff }
