const debug = require('debug')('linto:components:WebServer:controller:filterRules:segmentWordResize')

module.exports = function (segments, segmentWordSize) {
  let segment_resized = []
  if (segments && segments.length > 0) {
    for (let i = 0; i < segments.length; i++) {
      const segment_to_splice = Math.ceil(segments[i].words.length / segmentWordSize)

      if (segment_to_splice > 1) {
        for (let j = 0; j < segment_to_splice; j++) {
          let new_words = segments[i].words.splice(0, segmentWordSize)
          const last_end_word = new_words[new_words.length - 1].end
          const first_start_word = new_words[0].start

          let new_raw_words = segments[i].raw_words.filter(word => word.start >= first_start_word && word.end <= last_end_word)

          if (j === segment_to_splice - 1) {
            if (new_raw_words[new_raw_words.length - 1].end !== segments[i].raw_words[segments[i].raw_words.length - 1].end) {
              let last_missed_words = segments[i].raw_words.filter(word => word.start >= last_end_word)
              new_raw_words.push(...last_missed_words)
            }
          }

          let new_segment = {
            ...segments[i],
            words: new_words,
            segment: new_words.map(word => word.word).join(' '),
            raw_segment: new_raw_words.map(word => word.word).join(' '),
            start: first_start_word,
            end: last_end_word,
            duration: last_end_word - first_start_word
          }
          delete new_segment.raw_words
          segment_resized.push(new_segment)

        }
      } else {
        segment_resized.push(segments[i])
      }
    }

    return segment_resized
  }
}