/**
 * Lay Mongo words out on the turn's DERIVED plain text — the single-space
 * layout shared with every client (their computeTurnPlainText). A word
 * carrying internal whitespace is split into its parts (each keeping the
 * source timing); silence placeholders (empty words) yield nothing.
 *
 * @param {Array<{wid?: string, word: string, stime?: number, etime?: number, confidence?: number}>} words
 * @returns {Array<{text, charStart, charEnd, wid?, stime?, etime?, confidence?}>}
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
