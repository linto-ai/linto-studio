const { diffArrays } = require("diff")
const { wordsDeltafromPlainDiff } = require("./wordsDeltaFromPlainDiff")

/**
 * Server-side recompute of a turn's words[] given the new segment text.
 *
 * Reuses the syllabic redistribution heuristic from the legacy frontend
 * collaboration worker, but emits a flat new words[] instead of a Y.Delta.
 *
 * @param {Array} oldWords - existing words with timestamps (incl. empty words)
 * @param {string} newSegment - new plain text for the turn
 * @param {object} syllabic - syllabic counter instance (FR/EN/...)
 * @returns {Array} new words[] ready to persist
 */
function recomputeWords(oldWords, newSegment, syllabic) {
  if (!Array.isArray(oldWords) || oldWords.length === 0) {
    // No prior timestamps to redistribute. Caller will fall back.
    return null
  }

  // Collapse whitespace runs: consecutive spaces in the segment must not
  // produce empty plain words in the diff below.
  const trimmed = (newSegment || "").replace(/\s+/g, " ").trim()
  const oldText = oldWords
    .filter((w) => w.word !== "" && w.word !== " ")
    .map((w) => w.word)
    .join(" ")
    .trim()

  if (oldText === trimmed) {
    return oldWords
  }

  if (trimmed === "") {
    return []
  }

  const newPlain = trimmed.split(" ").map((w) => ({ word: w.trim() }))
  const oldNonEmpty = oldWords.filter((w) => w.word !== "")

  const diff = diffArrays(oldNonEmpty, newPlain, {
    comparator: (a, b) => a.word === b.word,
  })

  const delta = wordsDeltafromPlainDiff(newPlain, oldWords, diff, syllabic)
  return applyDelta(oldWords, delta)
}

function applyDelta(oldWords, delta) {
  let oldIdx = 0
  const result = []
  for (const op of delta) {
    if (op.retain != null) {
      result.push(...oldWords.slice(oldIdx, oldIdx + op.retain))
      oldIdx += op.retain
    } else if (op.delete != null) {
      oldIdx += op.delete
    } else if (op.insert != null) {
      result.push(...op.insert)
    }
  }
  // implicit retain to the end
  if (oldIdx < oldWords.length) {
    result.push(...oldWords.slice(oldIdx))
  }
  return result
}

module.exports = { recomputeWords }
