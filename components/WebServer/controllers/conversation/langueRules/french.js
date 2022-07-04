const debug = require('debug')('linto:components:WebServer:controller:langueRules:french')
let print_debug = true
let stop_debug = 10
let debug_show_index = 0

function correctSegmentText(seg_text) {
  let fixed_segment_text = seg_text.original

  fixed_segment_text = fixed_segment_text.replace(',\'', '\'').replace(',-', '-').replace(/[,.]$/, '')

  return {
    original: fixed_segment_text,
    lowercase: fixed_segment_text.toLowerCase()
  }
}

function simplePunctuation(seg_text, words) {
  if (seg_text.lowercase.replace(/[,.]$/, '') === words.word) {
    return {
      ...words,
      word: seg_text.original
    }
  }
}

function doublePunctuation(seg_text, words, loop_data) {
  if (/[?!:;]$/.test(seg_text.lowercase)) {
    let timestamp = 0
    if (loop_data.word_index !== 0) {
      timestamp = loop_data.words[loop_data.word_index - 1].end
    }
    return {
      start: timestamp,
      end: timestamp,
      word: seg_text.original,
      conf: 1,
      skip_words: -1
    }
  }
}

function apostropheNormalize(seg_text, words, loop_data) {
  if (seg_text.lowercase.includes('\'') && seg_text.lowercase.includes(words.word)) {
    return {
      ...words,
      word: seg_text.original,
      end: loop_data.words[loop_data.word_index].end,
      conf: (words.conf + loop_data.words[loop_data.word_index].conf) / 2,
      skip_words: 1
    }
  }
}

function numberNormalize(seg_text, words, loop_data) {
  if (!isNaN(seg_text.lowercase.replace(/[,.:]$/, ''))) {
    if (loop_data.segment_index + 1 > loop_data.segment.length - 1) { // The last word is a number
      return {
        ...words,
        word: seg_text.original,
      }
    }

    let seg_number = []
    let number_in_a_row_find = 0

    while (loop_data.segment_index + number_in_a_row_find < loop_data.segment.length) {
      if (!isNaN(loop_data.segment[loop_data.segment_index + number_in_a_row_find].replace(/[,.:]$/, ''))) {
        seg_number.push(loop_data.segment[loop_data.segment_index + number_in_a_row_find])
        number_in_a_row_find++
      } else break
    }

    let next_word_seg = correctSegmentText({ original: loop_data.segment[loop_data.segment_index + number_in_a_row_find] })
    let index = loop_data.word_index
    let confidences_scores = words.conf

    while (index < loop_data.words.length) {
      if (next_word_seg.lowercase === loop_data.words[index].word) { // trigger exit loop

        if (number_in_a_row_find > 1) { // if multiple number in a row
          let start = words.start
          let diff = (loop_data.words[index - 1].end - start) / number_in_a_row_find

          let words_output = []
          for (let num_words of seg_number) {
            words_output.push({
              word: num_words,
              start: start,
              end: start + diff,
              conf: confidences_scores / (number_in_a_row_find + 1),
              go_to_segment: loop_data.segment_index + number_in_a_row_find - 1,
              skip_words: index - loop_data.word_index - 1
            })
            start += diff
          }
          return words_output
        } else {
          return {
            word: seg_text.original,
            start: words.start,
            end: loop_data.words[index - 1].end,
            conf: confidences_scores / (index + 1 - loop_data.word_index), // total confidence minus number of words
            skip_words: index - loop_data.word_index
          }
        }

      }
      confidences_scores += loop_data.words[index].conf
      index++
    }
  }
}

function printNotFound(segment_text, words) {
  if (print_debug) {
    if (debug_show_index > stop_debug)
      print_debug = false
    else {
      console.log("Not found", segment_text, words)
      debug_show_index++
    }
  }
}

function notFound(segment_text, words) {
  return {}
}

module.exports = [correctSegmentText, simplePunctuation, doublePunctuation, apostropheNormalize, numberNormalize, printNotFound, notFound]