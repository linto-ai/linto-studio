const { randomUUID } = require("crypto")
const { computeWordLayout } = require("./computeWordLayout")
const {
  firstDefinedTime,
  lastDefinedTime,
  assignTurnTimes,
} = require("./turnTimes")

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

/**
 * Split a Mongo turn at a character offset of its derived single-space text.
 * Deterministic, no retime: a straddled word/span is cut proportionally (left
 * keeps the ids, right is minted); null when a half would come out empty.
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
    firstDefinedTime(leftWords, "stime") ?? turn.stime,
    lastDefinedTime(leftWords, "etime") ?? proportionalCut ?? turn.etime,
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
    firstDefinedTime(rightWords, "stime") ?? proportionalCut ?? turn.stime,
    lastDefinedTime(rightWords, "etime") ?? turn.etime,
  )

  return { left, right }
}

module.exports = { computeSplitTurns }
