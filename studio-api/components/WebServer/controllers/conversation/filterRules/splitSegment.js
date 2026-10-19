/**
 * Cut a normalized segment into consecutive pieces of its words. Each STT raw
 * word goes to the piece in which it starts, so none is dropped.
 */
function splitSegment(segment, pieces) {
  if (pieces.length <= 1) return [segment]
  const { raw_words = [], ...base } = segment

  const starts = pieces.map((words) => words[0].start)
  const raw_by_piece = pieces.map(() => [])
  let piece = 0
  for (const raw_word of raw_words) {
    while (piece + 1 < pieces.length && raw_word.start >= starts[piece + 1])
      piece++
    raw_by_piece[piece].push(raw_word)
  }

  return pieces.map((words, index) => {
    const start = words[0].start
    const end = words.at(-1).end
    return {
      ...base,
      words,
      segment: words.map((word) => word.word).join(" "),
      raw_words: raw_by_piece[index],
      raw_segment: raw_by_piece[index].map((word) => word.word).join(" "),
      start,
      end,
      duration: end - start,
    }
  })
}

module.exports = { splitSegment }
