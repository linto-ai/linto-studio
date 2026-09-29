/**
 * Map the tokens of a segment text onto the timed words returned by the STT.
 *
 * Both sides are reduced to their letters and digits and aligned character by
 * character, so splits (qu' il), merges, punctuation and casing never shift the
 * alignment. Where the two streams differ (numbers written as digits vs words,
 * symbols the STT did not time), the walk resyncs on the next common run and
 * the tokens in between share the time of the timed words in between.
 *
 * Every token of the text is returned, in order, with monotonic timestamps.
 */

const RESYNC_GRAM = 8
const RESYNC_WINDOWS = [64, 512, 4096]

function wordChars(text) {
  return text
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase()
}

// One entry per letter/digit: which item it belongs to and its offset in it
function charStream(items) {
  const chars = []
  const owners = []
  const offsets = []
  const lengths = items.map((item, index) => {
    const text = wordChars(item)
    for (let offset = 0; offset < text.length; offset++) {
      chars.push(text[offset])
      owners.push(index)
      offsets.push(offset)
    }
    return text.length
  })
  return { text: chars.join(""), owners, offsets, lengths }
}

// Nearest (text, words) positions from which RESYNC_GRAM characters match again
function findResync(text, words, a, b) {
  for (const window of RESYNC_WINDOWS) {
    const gram = Math.min(RESYNC_GRAM, text.length - a, words.length - b)
    if (gram <= 0) return null

    const positions = new Map()
    const words_end = Math.min(words.length - gram, b + window)
    for (let q = b; q <= words_end; q++) {
      const key = words.substr(q, gram)
      if (!positions.has(key)) positions.set(key, q)
    }

    let best = null
    const text_end = Math.min(text.length - gram, a + window)
    for (let p = a; p <= text_end; p++) {
      if (best && p - a >= best[0] - a + best[1] - b) break
      const q = positions.get(text.substr(p, gram))
      if (q === undefined) continue
      if (!best || p - a + q - b < best[0] - a + best[1] - b) best = [p, q]
    }
    if (best) return best
  }
  return null
}

// For each text character, the index of its word character, or -1
function alignChars(text, words) {
  const matches = new Array(text.length).fill(-1)
  let a = 0
  let b = 0
  while (a < text.length && b < words.length) {
    if (text[a] === words[b]) {
      matches[a++] = b++
      continue
    }
    const resync = findResync(text, words, a, b)
    if (!resync) break
    ;[a, b] = resync
  }
  return matches
}

// Time at the start or end of one character of a timed word
function charTime(word, offset, length, edge) {
  const position = offset + (edge === "end" ? 1 : 0)
  if (position === 0) return word.start
  if (position === length) return word.end
  return round3(word.start + ((word.end - word.start) * position) / length)
}

function round3(value) {
  return Math.round(value * 1000) / 1000
}

function averageConf(words) {
  const confs = words.map((word) => word.conf).filter((conf) => conf != null)
  if (confs.length === 0) return 1
  return confs.reduce((sum, conf) => sum + conf, 0) / confs.length
}

function alignTimedWords(tokens, timed_words, segment_start) {
  const text = charStream(tokens)
  const words = charStream(timed_words.map((word) => word.word ?? ""))
  const matches = alignChars(text.text, words.text)

  // Matched characters of each token, as [first, last] word-character indices
  const spans = tokens.map(() => null)
  matches.forEach((w, t) => {
    if (w < 0) return
    const token = text.owners[t]
    if (!spans[token]) spans[token] = [w, w]
    else spans[token][1] = w
  })

  const aligned = tokens.map((token, index) => {
    const span = spans[index]
    if (!span) return null
    const first = words.owners[span[0]]
    const last = words.owners[span[1]]
    const first_length = words.lengths[first]
    const last_length = words.lengths[last]
    const first_offset = words.offsets[span[0]]
    const last_offset = words.offsets[span[1]]

    // Exactly one whole timed word: keep it as is, with the text spelling
    if (first === last && first_offset === 0 && last_offset === last_length - 1)
      return { ...timed_words[first], word: token, first, last }

    return {
      start: charTime(timed_words[first], first_offset, first_length, "start"),
      end: charTime(timed_words[last], last_offset, last_length, "end"),
      word: token,
      conf: averageConf(timed_words.slice(first, last + 1)),
      first,
      last,
    }
  })

  fillUnaligned(aligned, tokens, timed_words, segment_start)
  return enforceMonotonic(aligned, segment_start)
}

// Tokens with no matched character take the time of the timed words left
// between their aligned neighbours, split by length; none left means a point
// right after the previous token
function fillUnaligned(aligned, tokens, timed_words, segment_start) {
  let index = 0
  while (index < aligned.length) {
    if (aligned[index]) {
      index++
      continue
    }
    let run_end = index
    while (run_end + 1 < aligned.length && !aligned[run_end + 1]) run_end++

    const previous = aligned[index - 1]
    const next = aligned[run_end + 1]
    const gap = timed_words.slice(
      previous ? previous.last + 1 : 0,
      next ? next.first : timed_words.length,
    )
    const anchor =
      previous?.end ??
      next?.start ??
      timed_words[0]?.start ??
      segment_start ??
      0

    const run = tokens.slice(index, run_end + 1)
    const weights = run.map((token) => wordChars(token).length)
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    const window_start = gap.length ? gap[0].start : anchor
    const window_end = gap.length ? gap.at(-1).end : anchor
    const conf = gap.length ? averageConf(gap) : 1

    let cursor = window_start
    run.forEach((token, offset) => {
      const share = total ? weights[offset] / total : 1 / run.length
      const end =
        offset === run.length - 1
          ? window_end
          : round3(cursor + (window_end - window_start) * share)
      aligned[index + offset] = { start: cursor, end, word: token, conf }
      cursor = end
    })
    index = run_end + 1
  }
}

// Guard against missing, overlapping or unordered STT timings
function enforceMonotonic(aligned, segment_start) {
  let previous_end
  return aligned.map(({ first, last, ...word }) => {
    if (!Number.isFinite(word.start))
      word.start =
        previous_end ?? (Number.isFinite(segment_start) ? segment_start : 0)
    else if (word.start < previous_end) word.start = previous_end
    if (!Number.isFinite(word.end) || word.end < word.start)
      word.end = word.start
    previous_end = word.end
    return word
  })
}

module.exports = { alignTimedWords }
