const { randomUUID } = require("crypto")
const { computeWordLayout } = require("./computeWordLayout")

function round2(n) {
  return parseFloat(n.toFixed(2))
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim()
}

/** Mongo word from a layout entry — undefined fields OMITTED, never written
 *  (the driver would persist them as BSON null). */
function makeWord(text, src) {
  const word = { wid: src.wid ?? randomUUID(), word: text }
  if (src.stime != null) word.stime = src.stime
  if (src.etime != null) word.etime = src.etime
  if (src.confidence != null) word.confidence = src.confidence
  return word
}

function firstDefined(words, field) {
  for (const w of words) if (w[field] != null) return w[field]
  return undefined
}

function lastDefined(words, field) {
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i][field] != null) return words[i][field]
  }
  return undefined
}

/** Replace a turn's stime/etime (spread from the original) with the halves'
 *  own bounds — never writing null/undefined. */
function assignTurnTimes(turn, stime, etime) {
  delete turn.stime
  delete turn.etime
  if (stime != null) turn.stime = stime
  if (etime != null) turn.etime = etime
}

/**
 * Split a Mongo turn in two at a character offset of its DERIVED plain text
 * (single-space layout — the offset space shared with the clients).
 *
 * Deterministic by construction, no retime:
 *  - words partition at the offset; a STRADDLED word is cut in two, its span
 *    divided proportionally to the character position (left keeps the wid,
 *    right is minted);
 *  - the left half keeps the original turn_id, the right half is minted;
 *  - turn-level times: word bounds first, else the proportional cut of the
 *    original turn's span (wordless turns get the same rule, one level up);
 *  - fields this module doesn't own are spread into BOTH halves.
 *
 * @param {object} turn - Mongo turn
 * @param {number} offset - character offset, strictly inside the text
 * @returns {{left: object, right: object}|null} null when the offset would
 *   produce an empty half (borders, empty turn) — the caller refuses.
 */
function computeSplitTurns(turn, offset) {
  const laid = computeWordLayout(turn.words)
  const text =
    laid.length > 0
      ? laid.map((w) => w.text).join(" ")
      : normalizeWhitespace(turn.segment || "")
  if (!Number.isInteger(offset) || offset <= 0 || offset >= text.length) {
    return null
  }
  const leftText = text.slice(0, offset).trim()
  const rightText = text.slice(offset).trim()
  if (leftText === "" || rightText === "") return null

  const leftWords = []
  const rightWords = []
  for (const w of laid) {
    if (w.charEnd <= offset) {
      leftWords.push(makeWord(w.text, w))
    } else if (w.charStart >= offset) {
      rightWords.push(makeWord(w.text, w))
    } else {
      // Straddled word: text cut at the offset, span cut at the same ratio.
      const cutIndex = offset - w.charStart
      const hasTiming = w.stime != null && w.etime != null
      const cutTime = hasTiming
        ? round2(w.stime + ((w.etime - w.stime) * cutIndex) / w.text.length)
        : undefined
      leftWords.push(makeWord(w.text.slice(0, cutIndex), { ...w, etime: cutTime }))
      rightWords.push(
        makeWord(w.text.slice(cutIndex), { ...w, wid: undefined, stime: cutTime }),
      )
    }
  }

  // Boundary time for the halves' turn-level spans: the words' own bounds
  // when they exist, else the proportional cut of the original turn span.
  const proportionalCut =
    turn.stime != null && turn.etime != null
      ? round2(turn.stime + ((turn.etime - turn.stime) * offset) / text.length)
      : undefined

  const left = {
    ...turn,
    segment: leftText,
    raw_segment: leftText,
    words: leftWords,
  }
  assignTurnTimes(
    left,
    firstDefined(leftWords, "stime") ?? turn.stime,
    lastDefined(leftWords, "etime") ?? proportionalCut ?? turn.etime,
  )

  const right = {
    ...turn,
    turn_id: randomUUID(),
    segment: rightText,
    raw_segment: rightText,
    words: rightWords,
  }
  assignTurnTimes(
    right,
    firstDefined(rightWords, "stime") ?? proportionalCut ?? turn.stime,
    lastDefined(rightWords, "etime") ?? turn.etime,
  )

  return { left, right }
}

module.exports = { computeSplitTurns }
