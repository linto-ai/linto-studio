/**
 * LCS over token/word texts (exact equality) carries each matched old word's
 * timing/identity onto its token; unmatched tokens interpolate later. Beyond
 * MAX_LCS_CELLS, falls back to prefix+suffix anchors (bounded, degraded).
 */

const MAX_LCS_CELLS = 4_000_000 // ~2000 x 2000 tokens

function alignWords(tokens, oldWords) {
  const n = tokens.length
  const m = oldWords.length
  if (n === 0 || m === 0) return []

  const pairs =
    n * m > MAX_LCS_CELLS
      ? anchorPairs(tokens, oldWords)
      : lcsPairs(tokens, oldWords)

  return pairs.map(([t, w]) => ({
    text: tokens[t].text,
    charStart: tokens[t].charStart,
    charEnd: tokens[t].charEnd,
    stime: oldWords[w].stime,
    etime: oldWords[w].etime,
    wid: oldWords[w].wid,
    confidence: oldWords[w].confidence,
  }))
}

/** Full LCS (dynamic programming) — [tokenIndex, wordIndex] pairs in order. */
function lcsPairs(tokens, oldWords) {
  const n = tokens.length
  const m = oldWords.length
  const width = m + 1
  const dp = new Int32Array((n + 1) * width)

  for (let i = 1; i <= n; i++) {
    const text = tokens[i - 1].text
    for (let j = 1; j <= m; j++) {
      dp[i * width + j] =
        text === oldWords[j - 1].word
          ? dp[(i - 1) * width + (j - 1)] + 1
          : Math.max(dp[(i - 1) * width + j], dp[i * width + (j - 1)])
    }
  }

  // Backtrack. Taking every equality is optimal for LCS by construction.
  const pairs = []
  let i = n
  let j = m
  while (i > 0 && j > 0) {
    if (tokens[i - 1].text === oldWords[j - 1].word) {
      pairs.push([i - 1, j - 1])
      i--
      j--
    } else if (dp[(i - 1) * width + j] >= dp[i * width + (j - 1)]) {
      i--
    } else {
      j--
    }
  }
  return pairs.reverse()
}

/** Cheap guard for huge inputs: common prefix + common suffix, middle lost. */
function anchorPairs(tokens, oldWords) {
  const n = tokens.length
  const m = oldWords.length
  const pairs = []

  let p = 0
  while (p < n && p < m && tokens[p].text === oldWords[p].word) {
    pairs.push([p, p])
    p++
  }

  let s = 0
  while (
    s < n - p &&
    s < m - p &&
    tokens[n - 1 - s].text === oldWords[m - 1 - s].word
  ) {
    s++
  }
  for (let k = s; k >= 1; k--) pairs.push([n - k, m - k])

  return pairs
}

module.exports = { alignWords }
