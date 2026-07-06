const { interpolateWordTimes } = require("./interpolate")

/**
 * Re-time one turn after edits — the plain-text successor of the wid mapping.
 *
 * Inputs come from the WordsState:
 *  - `tokens`: the turn's CURRENT text, tokenized (see tokenize.js).
 *  - `carried`: the word entries carried through the edits by the hot path —
 *    their char offsets are up to date (shifted on every Yjs delta) but their
 *    `text` is the word's LAST RETIMED spelling and their timing is the last
 *    known one. Entries fully deleted by the edits are already gone.
 *
 * Identity is positional: a token and an entry that overlap in character
 * space are the same spoken word, whatever happened to its spelling. Each
 * token is classified by the SHAPE of its overlap with the carried entries,
 * and every class has one timing rule:
 *
 *   UNTOUCHED  same text over one whole entry   → timing kept verbatim
 *   RESPELLED  new text over one whole entry    → same moment, new spelling
 *   MERGED     one token over several entries   → spans the whole group
 *   RESHAPED   entry shared with other tokens   → old spans become a budget
 *   TYPED      no entry at all                  → brand-new: interpolated
 *
 * RESHAPED and TYPED are "flex": their final timing is computed by
 * interpolateWordTimes, which distributes each flex run's window (anchored by
 * the surrounding kept timings, or by the budgets) proportionally to
 * syllables. Deleted words need no case: their entries simply attract no
 * token and vanish.
 *
 * @param {Array<{text, charStart, charEnd}>} tokens
 * @param {Array<{text, charStart, charEnd, stime?, etime?}>} carried
 * @param {{stime?: number, etime?: number}|undefined} turnBounds
 * @param {object} syllabic - from getSyllabic(language)
 * @returns {Array<{word: string, stime?: number, etime?: number}>}
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

/**
 * @returns {"untouched"|"respelled"|"merged"|"reshaped"|"typed"}
 */
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

/** Overlapping carried entries per token, by character range. Ranges are
 *  half-open [charStart, charEnd) and both lists are sorted and internally
 *  non-overlapping, so a single merge walk does it. Touching is not
 *  overlapping: an entry ending exactly where a token starts belongs to the
 *  previous token, not this one. */
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
