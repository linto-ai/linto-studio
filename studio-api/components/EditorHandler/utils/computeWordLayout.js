/**
 * Lay Mongo words on the derived single-space text (shared with the clients'
 * computeTurnPlainText); multi-part words split, empty (silence) words drop.
 */
function computeWordLayout(words) {
  const out = []
  let cursor = 0
  for (const src of words || []) {
    for (const part of (src.word ?? "").split(/\s+/)) {
      if (!part) continue
      const charStart = cursor
      const charEnd = charStart + part.length
      cursor = charEnd + 1
      out.push({
        text: part,
        charStart,
        charEnd,
        wid: src.wid,
        stime: src.stime,
        etime: src.etime,
        confidence: src.confidence,
      })
    }
  }
  return out
}

module.exports = { computeWordLayout }
