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
 * Old Mongo turn + edited plain text → the retimed turn fields to persist.
 *
 * LCS alignment (alignWords) carries every exact-text match onto its new
 * position — timing, wid and confidence verbatim; the edited words are
 * interpolated by syllables between those anchors (retimeTurn/interpolate),
 * with the old turn's stime/etime as fallback bounds.
 *
 * Save-model contract: the delta-first system could also keep a RESPELLED
 * word's timing (identity tracked through the edit); save-time alignment only
 * matches equal text, so a corrected word is re-interpolated in its
 * neighbours' window. Slightly less precise on typo fixes, zero bookkeeping.
 *
 * @param {{words?: Array, stime?: number, etime?: number, language?: string, lang?: string}} oldTurn
 * @param {string} text - edited plain text, whitespace-normalized
 * @returns {{segment: string, words: Array, stime?: number, etime?: number}}
 */
function computeRetimedTurn(oldTurn, text) {
  const tokens = tokenize(text)
  const oldWords = oldTurn.words || []
  const carried = alignWords(tokens, oldWords)

  // No timing basis at all (no timed word, no turn-level times): interpolate
  // would fabricate stime/etime = 0 on every word — persist untimed words
  // instead, the turn stays honestly text-only.
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

  // Carried entries sit exactly on their token's offsets: charStart is the
  // identity bridge between a retimed token and the old word it came from.
  const carriedByCharStart = new Map(carried.map((e) => [e.charStart, e]))
  const words = retimed.map((w, i) => {
    const kept = carriedByCharStart.get(tokens[i].charStart)
    // Undefined fields are OMITTED, never written: the Mongo driver persists
    // undefined as BSON null (ignoreUndefined is off).
    const word = { wid: kept?.wid ?? randomUUID(), word: w.word }
    if (w.stime != null) word.stime = round2(w.stime)
    if (w.etime != null) word.etime = round2(w.etime)
    if (kept?.confidence != null) word.confidence = kept.confidence
    return word
  })

  const result = { segment: text, words }
  const stime = firstDefinedTime(words, "stime") ?? oldTurn.stime
  const etime = lastDefinedTime(words, "etime") ?? oldTurn.etime
  // Never overwrite turn-level times with undefined — some ASR output has no
  // per-word timing, only turn-level times, and a save must not destroy them.
  if (stime != null) result.stime = stime
  if (etime != null) result.etime = etime
  return result
}


module.exports = { computeRetimedTurn }
