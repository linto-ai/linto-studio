const debug = require('debug')('linto:components:WebServer:controller:segment_normalize')

const rules = require('./langueRules/index')

function* sequenceGenerator(segments, lang) {
  let i = 0 
  let word_skip_count = 0
  try {

    let loop_data = {
      segment: segments.segment_array,
      words: segments.raw_words,
    }

    while (i < segments.segment_array.length) {
      let j = i + word_skip_count + 1 //  index of words

      loop_data.segment_index = i
      loop_data.word_index = j

      let segment_text = {
        original: segments.segment_array[i],
        lowercase: segments.segment_array[i].toLowerCase()
      }

      let seg_words = rules.executeLangRule(lang, segment_text, segments.raw_words[j - 1], loop_data)

      if (seg_words.skip_words) {
        word_skip_count += seg_words.skip_words
        delete seg_words.skip_words
      }

      if (Array.isArray(seg_words)) {
        i = seg_words[0].go_to_segment
        word_skip_count += seg_words[0].skip_words

        for (let word of seg_words) {
          delete word.go_to_segment
          delete word.skip_words

          yield word
        }
      } else {
        yield seg_words
      }
      i++
    }
  } catch (error) {
    console.log(error)
  }
}


function segmentNormalizeText(transcription, lang) {
  if (transcription === undefined) throw new Error('Transcription was empty')
  else if (lang === undefined) throw new Error('Langue was empty')

  transcription.segments.map(segments => {
    segments.raw_words = [...segments.words]
    segments.words = []
    segments.segment_array = segments.segment.split(' ')

    for (let words_sequence of sequenceGenerator(segments, lang)) {
      segments.words.push(words_sequence)
    }
    delete segments.segment_array
  })

  return transcription

}

module.exports = {
  segmentNormalizeText
}