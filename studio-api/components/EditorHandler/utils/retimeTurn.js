const { interpolateWordTimes } = require("./interpolate")

/**
 * Re-time one turn after edits. Identity is positional: a token and a carried
 * entry overlapping in character space are the same spoken word. Each token's
 * overlap shape picks the timing rule:
 *
 *   UNTOUCHED  same text over one whole entry   → timing kept verbatim
 *   RESPELLED  new text over one whole entry    → same moment, new spelling
 *   MERGED     one token over several entries   → spans the whole group
 *   RESHAPED   entry shared with other tokens   → old spans become a budget
 *   TYPED      no entry at all                  → brand-new: interpolated
 *
 * RESHAPED/TYPED are "flex", filled by interpolateWordTimes (syllable-
 * proportional); deleted words attract no token and vanish.
 */
function retimeTurn(tokens, carried, turnBounds, syllabic) {
  const overlaps = collectOverlaps(tokens, carried)
  const shared = countClaims(overlaps)

  const words = tokens.map((token, i) => {
    const entries = overlaps[i]

    switch (classify(token, entries, shared)) {
      case "untouched":
      case "respelled":
        return {
          word: token.text,
          stime: entries[0].stime,
          etime: entries[0].etime,
        }

      case "merged":
        return {
          word: token.text,
          stime: first(entries, "stime"),
          etime: last(entries, "etime"),
        }

      case "reshaped":
        return {
          word: token.text,
          _flex: true,
          _budgetStime: first(entries, "stime"),
          _budgetEtime: last(entries, "etime"),
        }

      case "typed":
        return { word: token.text, _flex: true }
    }
  })

  return interpolateWordTimes(words, turnBounds, syllabic)
}

function classify(token, entries, shared) {
  const wholeEntries = entries.every((e) => shared.get(e) === 1)

  switch (true) {
    case entries.length === 0:
      return "typed"
    case !wholeEntries:
      return "reshaped"
    case entries.length > 1:
      return "merged"
    case entries[0].text === token.text:
      return "untouched"
    default:
      return "respelled"
  }
}

/** Overlapping entries per token over half-open [charStart, charEnd) ranges;
 *  touching is not overlapping. Both lists sorted → single merge walk. */
function collectOverlaps(tokens, carried) {
  const result = tokens.map(() => [])
  let c = 0
  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t]
    while (c < carried.length && carried[c].charEnd <= token.charStart) c++
    for (
      let k = c;
      k < carried.length && carried[k].charStart < token.charEnd;
      k++
    ) {
      result[t].push(carried[k])
    }
  }
  return result
}

/** How many tokens claim each entry — an entry claimed twice means a word was
 *  split (or a boundary blurred), which downgrades its tokens to RESHAPED. */
function countClaims(overlaps) {
  const shared = new Map()
  for (const entries of overlaps) {
    for (const e of entries) shared.set(e, (shared.get(e) || 0) + 1)
  }
  return shared
}

function first(entries, field) {
  for (const e of entries) if (e[field] != null) return e[field]
  return undefined
}

function last(entries, field) {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i][field] != null) return entries[i][field]
  }
  return undefined
}

module.exports = { retimeTurn }
