const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:parse`)
const LANGUE = {
  french: 'fr-FR'
}

function normalizeTranscription(data) {
  process.env.LANGUE = 'fr-FR'

  data.segments.map(segment => {
    let words_index = 0
    segment.raw_words = [...segment.words]
    segment.words = []

    let number_in_a_row_find = 0
    segment.segment.split(' ').map((seg_normalize_word, index, array) => {
      if (number_in_a_row_find !== 0) {
        number_in_a_row_find--
        return
      }
      // segment.segment.split(' ').map((seg_word, index, array) => {
      let normalize_word = {}
      let lower_seg_normalize_word = seg_normalize_word.toLowerCase()
      if (checkShortPunctuation(lower_seg_normalize_word, segment.raw_words[words_index])) { //word with short punctuation
        normalize_word = segment.raw_words[words_index]
        normalize_word.word = seg_normalize_word

        words_index++
      } else if (checkLongPunctuation(lower_seg_normalize_word)) { //word with long punctuation
        normalize_word = segment.raw_words[words_index]
        normalize_word.word = seg_normalize_word
        words_index++

      } else if (checkApostrophe(lower_seg_normalize_word, segment.raw_words[words_index])) { //word with apostrophe
        normalize_word = {
          word: seg_normalize_word,
          start: segment.raw_words[words_index].start,
          end: segment.raw_words[words_index + 1].end,
          conf: (segment.raw_words[words_index].conf + segment.raw_words[words_index + 1].conf) / 2
        }

        words_index += 2
      } else if (checkNumber(lower_seg_normalize_word)) { // number
        normalize_word = {
          word: seg_normalize_word,
          start: segment.raw_words[words_index].start,
          end: segment.raw_words[words_index].end,
          conf: segment.raw_words[words_index].conf
        }

        for (let i = words_index; i < segment.raw_words.length; i++) {
          if (checkNumber(array[index + 1 + number_in_a_row_find])) {
            normalize_word.end = segment.raw_words[words_index + number_in_a_row_find].end
            number_in_a_row_find++
          } else if (checkNextWord(array[index + 1 + number_in_a_row_find], segment.raw_words[i])) {
            normalize_word.conf = normalize_word.conf / (i - words_index)
            if (words_index === i) i++
            words_index = i
            break;
          } else {
            normalize_word.end = segment.raw_words[i].end
            normalize_word.conf += segment.raw_words[i].conf
          }
        }
      } else {
        debug('SPECIAL CASE NOT SUPPORTED')
      }

      if (number_in_a_row_find === 0) {
        segment.words.push(normalize_word)
      } else { // Special rule when multiple number in a row
        const time = (normalize_word.end - normalize_word.start) / (number_in_a_row_find + 1)
        for (let i = 0; i <= number_in_a_row_find; i++) {
          segment.words.push({
            word: array[index + i],
            start: (normalize_word.start + (time * i)),
            end: (normalize_word.start + (time * (i + 1))),
            conf: 1
          })
        }
      }
    })
  })

  return data
}


function checkShortPunctuation(seg, words) {
  if (process.env.LANGUE === LANGUE.french)
    return seg.replace(',', '').replace('.', '') === words.word
}

function checkLongPunctuation(seg, words) {
  if (process.env.LANGUE === LANGUE.french)
    return seg.includes('?') || seg.includes('!')
}

function checkApostrophe(seg, words) {
  if (process.env.LANGUE === LANGUE.french)
    return seg.includes('\'') && seg.includes(words.word)
}

function checkNumber(seg) {
  if (seg === undefined) return false
  if (process.env.LANGUE === LANGUE.french)
    return (!isNaN(seg.replace(',', '').replace('.', '')))
}

function checkNextWord(next_word, words) {
  if (next_word === undefined) return true
  if (process.env.LANGUE === LANGUE.french)
    return next_word.toLowerCase().replace(',', '').replace('.', '') === words.word
}

module.exports = {
  normalizeTranscription,
}