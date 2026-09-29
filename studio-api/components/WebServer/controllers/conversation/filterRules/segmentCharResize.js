const { splitSegment } = require("./splitSegment")

const ENDS_SENTENCE = /[.,!?;:]$/

/**
 * Pieces of about segmentCharResize letters; once the size is reached, the
 * piece is stretched up to the next punctuation if it comes soon enough.
 */
module.exports = function (segments, segmentCharResize) {
  const size = parseInt(segmentCharResize, 10)
  if (!(size > 0)) return segments
  const lookahead = Math.ceil(size * 0.2)

  return segments.flatMap((segment) => {
    const words = segment.words
    const pieces = []
    let index = 0
    while (index < words.length) {
      let end = index
      let length = 0
      while (end < words.length && (length <= size || end === index)) {
        length += words[end].word.length
        end++
      }
      const limit = Math.min(words.length, end + lookahead)
      for (let next = end; next < limit; next++) {
        if (ENDS_SENTENCE.test(words[next].word)) {
          end = next + 1
          break
        }
      }
      pieces.push(words.slice(index, end))
      index = end
    }
    return splitSegment(segment, pieces)
  })
}
