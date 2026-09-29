const { splitSegment } = require("./splitSegment")

module.exports = function (segments, segmentWordResize) {
  const size = parseInt(segmentWordResize, 10)
  if (!(size > 0)) return segments
  return segments.flatMap((segment) => {
    const pieces = []
    for (let index = 0; index < segment.words.length; index += size)
      pieces.push(segment.words.slice(index, index + size))
    return splitSegment(segment, pieces)
  })
}
