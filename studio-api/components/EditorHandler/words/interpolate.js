const { countSyllabsFromWord } = require("./countSyllabsFromWord")

function round2(n) {
  return parseFloat(n.toFixed(2))
}

/**
 * Fill stime/etime for FLEX words — words whose timing is unknown because they
 * were just typed, or because a known word's text changed (a mid-word split or
 * an edit), in which case the known word's OLD span is a redistribution budget.
 *
 * Anchors (known words whose text is unchanged) keep their exact timing. Each
 * maximal run of FLEX words is filled by distributing its available [start,end]
 * span proportionally to syllables — the only place the syllabic heuristic is
 * still needed once identity is carried by wid.
 *
 * Zone bounds (in priority order):
 *  - start: previous anchor's etime, else the earliest FLEX budget start, else
 *    the turn start, else 0.
 *  - end:   next anchor's stime, else the latest FLEX budget end, else the turn
 *    end, else start (degenerate zero-length).
 *
 * @param {Array<{word, stime?, etime?, _flex?, _budgetStime?, _budgetEtime?}>} words
 * @param {{stime?, etime?}|undefined} turn - turn-level fallback bounds
 * @param {object} syllabic
 * @returns {Array} the same words array, timings filled, temp fields stripped
 */
function interpolateWordTimes(words, turn, syllabic) {
  let i = 0
  while (i < words.length) {
    if (!words[i]._flex) {
      i++
      continue
    }
    let j = i
    while (j + 1 < words.length && words[j + 1]._flex) j++
    fillZone(words, i, j, turn, syllabic)
    i = j + 1
  }
  for (const w of words) {
    delete w._flex
    delete w._budgetStime
    delete w._budgetEtime
  }
  return words
}

function fillZone(words, from, to, turn, syllabic) {
  const prev = from > 0 ? words[from - 1] : null
  const next = to + 1 < words.length ? words[to + 1] : null

  let minBudget = null
  let maxBudget = null
  for (let k = from; k <= to; k++) {
    const bs = words[k]._budgetStime
    const be = words[k]._budgetEtime
    if (bs != null) minBudget = minBudget == null ? bs : Math.min(minBudget, bs)
    if (be != null) maxBudget = maxBudget == null ? be : Math.max(maxBudget, be)
  }

  let start =
    prev && prev.etime != null
      ? prev.etime
      : minBudget != null
        ? minBudget
        : turn && turn.stime != null
          ? turn.stime
          : 0

  let end =
    next && next.stime != null
      ? next.stime
      : maxBudget != null
        ? maxBudget
        : turn && turn.etime != null
          ? turn.etime
          : start

  if (end < start) end = start

  const syllables = []
  for (let k = from; k <= to; k++) {
    syllables.push(countSyllabsFromWord(words[k].word, syllabic))
  }
  const total = syllables.reduce((a, b) => a + b, 0) || 1
  const duration = end - start

  let t = start
  for (let k = from; k <= to; k++) {
    const wEnd =
      k === to ? end : round2(t + (duration * syllables[k - from]) / total)
    words[k].stime = round2(t)
    words[k].etime = wEnd
    t = wEnd
  }
}

module.exports = { interpolateWordTimes }
