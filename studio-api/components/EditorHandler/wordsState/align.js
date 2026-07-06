/**
 * Hydration/recovery alignment: match a turn's CURRENT tokens against its
 * last known word list (Mongo shape, ordered, no offsets) and carry each
 * matched word's timing/identity onto the token that still holds it.
 *
 * Matching is a longest common subsequence over token/word TEXTS (exact
 * string equality). Unmatched tokens get NO entry: retimeTurn later treats
 * them as "typed" and interpolates. Unmatched old words simply vanish.
 *
 * For pathological inputs the quadratic LCS is skipped: beyond MAX_LCS_CELLS
 * a cheap anchor walk matches the common prefix and common suffix and leaves
 * the middle unmatched — bounded cost, degraded (but safe) recovery.
 */

const MAX_LCS_CELLS = 4_000_000 // ~2000 x 2000 tokens

/**
 * @param {Array<{text: string, charStart: number, charEnd: number}>} tokens
 *   from tokenize(text)
 * @param {Array<{word: string, stime?: number, etime?: number, wid?: string, confidence?: number}>} oldWords
 *   ordered, Mongo shape
 * @returns {Array<{text, charStart, charEnd, stime, etime, wid, confidence}>}
 *   carried entries for retimeTurn, one per MATCHED token, in token order
 */
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
