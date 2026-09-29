const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:langueRules:english",
)

function correctSegmentText(seg_text) {
  let fixed_segment_text = seg_text.original

  fixed_segment_text = fixed_segment_text.replace(",'", "'").replace(",-", "-")

  return {
    original: fixed_segment_text,
    lowercase: fixed_segment_text.replace(/[,.]$/, "").toLowerCase(),
  }
}

function simplePunctuation(seg_text, words, loop_data) {
  if (seg_text.lowercase.replace(/[.,…"]/g, "") === words.word.toLowerCase()) {
    return {
      ...words,
      word: seg_text.original,
    }
  }
}

function doublePunctuation(seg_text, words, loop_data) {
  if (/[?!:;«»–—]$/.test(seg_text.lowercase)) {
    let timestamp = 0

    if (loop_data.last_endtime !== undefined) timestamp = loop_data.last_endtime
    else if (loop_data.word_index !== 0)
      timestamp = loop_data.words[loop_data.word_index - 1].start

    return {
      start: timestamp,
      end: timestamp,
      word: seg_text.original,
      conf: 1,
    }
  }
}

function apostropheNormalize(seg_text, words, loop_data) {
  if (
    seg_text.lowercase.includes("'") &&
    seg_text.lowercase.includes(words.word)
  ) {
    return {
      ...words,
      word: seg_text.original,
      end: loop_data.words[loop_data.word_index].end,
      conf: (words.conf + loop_data.words[loop_data.word_index].conf) / 2,
      skip_words: seg_text.original.split("'").length - 1, // Sometime we have multiple ', same rule apply x time
    }
  }
}

function notFound(segment_text, words) {
  return words
}

module.exports = {
  rules_sequences: [
    correctSegmentText,
    simplePunctuation,
    doublePunctuation,
    apostropheNormalize,
    notFound,
  ],
}
