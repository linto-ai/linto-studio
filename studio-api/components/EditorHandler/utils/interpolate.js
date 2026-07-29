const { countSyllabsFromWord } = require("./countSyllabsFromWord")

function round2(n) {
  return parseFloat(n.toFixed(2))
}

/**
 * Fill stime/etime for _flex words: each flex run's window (prev anchor etime /
 * next anchor stime, else budgets, else turn bounds, else 0) is distributed
 * proportionally to syllables. Mutates words and strips the temp fields.
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
