/** First DEFINED time of a word list — robust to sparse/absent timings. */
function firstDefinedTime(words, field) {
  for (const w of words) if (w[field] != null) return w[field]
  return undefined
}

function lastDefinedTime(words, field) {
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i][field] != null) return words[i][field]
  }
  return undefined
}

/** Replace a turn's stime/etime (possibly spread from a source turn) —
 *  never writing null/undefined (BSON would persist them as null). */
function assignTurnTimes(turn, stime, etime) {
  delete turn.stime
  delete turn.etime
  if (stime != null) turn.stime = stime
  if (etime != null) turn.etime = etime
}

module.exports = { firstDefinedTime, lastDefinedTime, assignTurnTimes }
