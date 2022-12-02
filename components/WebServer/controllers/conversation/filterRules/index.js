const debug = require('debug')('linto:components:WebServer:controller:filterRules')

const segmentWordResize = require('./segmentWordResize')
const segmentCharResize = require('./segmentCharResize')


function executeFilterRule(segments, filter) {
  let segment_filtered = []

  try {
    if (filter.segmentWordResize) {
      segment_filtered = segmentWordResize(segments, filter.segmentWordSize)
    }
    if (filter.segmentCharResize) {
      segment_filtered = segmentCharResize(segments, filter.segmentCharResize)
    }

    return segment_filtered
  } catch (err) {
    console.error(err)
    return segments
  }
}


module.exports = {
  executeFilterRule
}