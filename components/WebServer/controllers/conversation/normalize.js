const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:parse`)
const LANGUE = {
  french : 'fr-FR'
}

function normalizeTranscription(data) {
  process.env.LANGUE = 'fr-FR'

  data.segments.map(seg => {
    let words_index = 0
    seg.raw_words = [...seg.words]
    seg.words = []

    seg.segment.split(' ').map((seg_word, index, array) => {
      let custom_word = {
        speaker_id : seg_word.spk_id
      }

      // debug(seg_word)
      let lower_seg_word = seg_word.toLowerCase()
      if (checkShortPunctuation(lower_seg_word, seg.raw_words[words_index])) { //word with short punctuation
        custom_word = seg.raw_words[words_index]
        custom_word.word = seg_word

        words_index++
      } else if (checkLongPunctuation(lower_seg_word)) { //word with long punctuation
        custom_word = seg.raw_words[words_index]
        custom_word.word = seg_word
        words_index++

      } else if (checkApostrophe(lower_seg_word, seg.raw_words[words_index])) { //word with apostrophe
        custom_word = {
          word: seg_word,
          start: seg.raw_words[words_index].start,
          end: seg.raw_words[words_index + 1].end,
          conf: (seg.raw_words[words_index].conf + seg.raw_words[words_index + 1].conf) / 2
        }

        words_index += 2
      } else if (checkNumber(lower_seg_word)) { // number
        custom_word = {
          word: seg_word,
          start: seg.raw_words[words_index].start,
          end: seg.raw_words[words_index].end,
          conf: seg.raw_words[words_index].conf
        }
        for (let i = words_index; i < seg.raw_words.length; i++) {
          // debug(index)
          // debug(array[index + 1], seg.raw_words[i])
          if (checkNextWord(array[index + 1], seg.raw_words[i])) {
            custom_word.conf = custom_word.conf / (i - words_index)
            if (words_index === i) i++
            words_index = i
            break;
          } else {
            custom_word.end = seg.raw_words[i].end
            custom_word.conf += seg.raw_words[i].conf
          }
        }
      } else {
        debug('KO', seg_word, words_index, seg.raw_words[words_index].word)
      }
      seg.words.push(custom_word)
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
  if (process.env.LANGUE === LANGUE.french)
    return (!isNaN(seg.replace(',', '').replace('.', '')))
}

function checkNextWord(next_word, words) {
  if(next_word === undefined) return true
  if (process.env.LANGUE === LANGUE.french)
    return next_word.toLowerCase().replace(',', '').replace('.', '') === words.word || !isNaN(next_word.replace(',', '').replace('.', ''))
}

module.exports = {
  normalizeTranscription,
}
