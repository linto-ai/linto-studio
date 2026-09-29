const logger = require(`${process.cwd()}/lib/logger/logger`)

const segmentWordResize = require("./segmentWordResize")
const segmentCharResize = require("./segmentCharResize")

const RESIZERS = [
  ["segmentWordSize", segmentWordResize],
  ["segmentCharSize", segmentCharResize],
]

function executeFilterRule(segments, filter) {
  for (const [key, resize] of RESIZERS) {
    if (!filter[key]) continue
    try {
      segments = resize(segments, filter[key])
    } catch (err) {
      logger.warn(`Segment resize ${key} failed, keeping the segments:`, err)
    }
  }
  return segments.map(({ raw_words, ...segment }) => segment)
}

module.exports = {
  executeFilterRule,
}
