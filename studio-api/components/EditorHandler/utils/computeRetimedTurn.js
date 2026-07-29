const { randomUUID } = require("crypto")
const { tokenize } = require("./tokenize")
const { alignWords } = require("./align")
const { retimeTurn } = require("./retimeTurn")
const { getSyllabic } = require("./syllabic")
const { firstDefinedTime, lastDefinedTime } = require("./turnTimes")

function round2(n) {
  return parseFloat(n.toFixed(2))
}

/**
 * Old Mongo turn + edited text (whitespace-normalized) → retimed fields to
 * persist: LCS-matched words keep timing/wid/confidence verbatim, the rest
 * interpolates by syllables between those anchors.
 */
function computeRetimedTurn(oldTurn, text) {
  const tokens = tokenize(text)
  const oldWords = oldTurn.words || []
  const carried = alignWords(tokens, oldWords)

  // No timing basis at all: persist untimed words rather than letting
  // interpolate fabricate stime/etime = 0 everywhere.
  const hasTimingBasis =
    oldTurn.stime != null ||
    oldTurn.etime != null ||
    carried.some((e) => e.stime != null || e.etime != null)
  const retimed = hasTimingBasis
    ? retimeTurn(
        tokens,
        carried,
        { stime: oldTurn.stime, etime: oldTurn.etime },
        getSyllabic(oldTurn.language || oldTurn.lang),
      )
    : tokens.map((token) => ({ word: token.text }))

  // charStart bridges a retimed token to the old word it came from.
  const carriedByCharStart = new Map(carried.map((e) => [e.charStart, e]))
  const words = retimed.map((w, i) => {
    const kept = carriedByCharStart.get(tokens[i].charStart)
    // Undefined fields are omitted: the driver persists them as BSON null.
    const word = { wid: kept?.wid ?? randomUUID(), word: w.word }
    if (w.stime != null) word.stime = round2(w.stime)
    if (w.etime != null) word.etime = round2(w.etime)
    if (kept?.confidence != null) word.confidence = kept.confidence
    return word
  })

  const result = { segment: text, words }
  const stime = firstDefinedTime(words, "stime") ?? oldTurn.stime
  const etime = lastDefinedTime(words, "etime") ?? oldTurn.etime
  // Some ASR output only has turn-level times; never overwrite them with
  // undefined.
  if (stime != null) result.stime = stime
  if (etime != null) result.etime = etime
  return result
}


module.exports = { computeRetimedTurn }
