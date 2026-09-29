const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:normalizeSegment",
)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const rules = require("./langueRules/index")
const filterRules = require("./filterRules/index")

const HAS_WORD_CHAR = /[\p{L}\p{N}]/u

// STT services drop punctuation-only tokens from the timed words but keep them in the text
function isOrphanPunctuation(token, word) {
  if (HAS_WORD_CHAR.test(token)) return false
  return word === undefined || HAS_WORD_CHAR.test(word.word)
}

// Whisper stutters can glue a dozen "qu'" into one token
const MAX_COMPOSITE_WORDS = 32

function wordChars(text) {
  return text
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase()
}

// Token and timed word only differ by punctuation: keep the word timing as is
function isSameWord(token, word) {
  if (word === undefined) return false
  const chars = wordChars(token)
  if (chars === "") return word.word !== "" && token.startsWith(word.word)
  return chars === wordChars(word.word)
}

const UNTIMED_LOOKAHEAD = 3

// Token with no timed word (e.g. "② ③"), detected because a following token matches the current word
function isUntimedToken(next_tokens, token, word) {
  if (word === undefined || isSameWord(token, word)) return false
  return next_tokens
    .slice(0, UNTIMED_LOOKAHEAD)
    .some((next_token) => isSameWord(next_token, word))
}

// cleanSegment glues "qu' il" into one token while the STT still times "qu'" and "il" apart.
// Returns how many timed words, starting at index, spell the token (0 if they don't).
function compositeWordCount(token, words, index) {
  const target = wordChars(token)
  if (target === "" || words[index] === undefined) return 0
  if (wordChars(words[index].word) === target) return 0

  let spelled = ""
  for (let k = 0; k < MAX_COMPOSITE_WORDS && index + k < words.length; k++) {
    spelled += wordChars(words[index + k].word)
    if (spelled === target) return k > 0 ? k + 1 : 0
    if (!target.startsWith(spelled)) return 0
  }
  return 0
}

function* ruleSequenceGenerator(segments, lang) {
  let i = 0
  let word_skip_count = 0
  try {
    let loop_data = {
      segment: segments.segment_array,
      words: segments.raw_words,
      segment_index: 0,
      word_index: 0,
    }

    while (i < segments.segment_array.length) {
      let j = i + word_skip_count + 1 //  index of words

      loop_data.segment_index = i
      loop_data.word_index = j

      let segment_text = {
        original: segments.segment_array[i],
        lowercase: segments.segment_array[i].toLowerCase(),
      }

      const raw_word = segments.raw_words[j - 1]
      const composite_count = compositeWordCount(
        segment_text.original,
        segments.raw_words,
        j - 1,
      )

      if (
        isOrphanPunctuation(segment_text.original, raw_word) ||
        (composite_count === 0 &&
          isUntimedToken(
            segments.segment_array.slice(i + 1),
            segment_text.original,
            raw_word,
          ))
      ) {
        const timestamp =
          loop_data.last_endtime ?? raw_word?.start ?? segments.start ?? 0
        // A trailing token inherits the confidence of the last timed word
        const conf =
          raw_word === undefined ? segments.raw_words.at(-1)?.conf : 1
        loop_data.last_endtime = timestamp
        word_skip_count -= 1
        yield {
          start: timestamp,
          end: timestamp,
          word: segment_text.original,
          conf: conf ?? 1,
        }
      } else if (composite_count > 0) {
        const parts = segments.raw_words.slice(j - 1, j - 1 + composite_count)
        word_skip_count += composite_count - 1
        loop_data.last_endtime = parts.at(-1).end
        yield {
          start: parts[0].start,
          end: parts.at(-1).end,
          word: segment_text.original,
          conf: parts.reduce((sum, part) => sum + part.conf, 0) / parts.length,
        }
      } else if (isSameWord(segment_text.original, raw_word)) {
        loop_data.last_endtime = raw_word.end
        yield { ...raw_word, word: segment_text.original }
      } else if (raw_word !== undefined) {
        let seg_words = rules.executeLangRule(
          lang,
          segment_text,
          raw_word,
          loop_data,
        )

        if (seg_words?.skip_words) {
          word_skip_count += seg_words.skip_words
          delete seg_words.skip_words
        }

        if (Array.isArray(seg_words)) {
          i = seg_words[0].go_to_segment
          word_skip_count += seg_words[0].skip_words
          let segment_done = false // Allow to dodge an overlap for some end segment when number are in a row

          for (let word of seg_words) {
            if (word.segment_done) segment_done = true

            delete word.go_to_segment
            delete word.segment_done
            delete word.skip_words
            loop_data.last_endtime = word.end
            yield word
          }
          if (segment_done) break
        } else {
          yield seg_words
          loop_data.last_endtime = seg_words.end
        }
      }
      i++
    }
  } catch (error) {
    logger.warn("Segment normalization failed:", error)
  }
}

// Removing space after an apostrophe from a LinSTT transcription service
function cleanSegment(segment) {
  return segment.replace(" ', ", "'").replace(/' /g, "'")
}

function applySegmentFilterDefaults(filter = {}) {
  const defaults = {
    segmentCharSize: parseInt(process.env.DEFAULT_SEGMENT_CHAR_SIZE, 10),
    segmentWordSize: parseInt(process.env.DEFAULT_SEGMENT_WORD_SIZE, 10),
  }

  for (const key of Object.keys(defaults)) {
    if (!filter[key] && defaults[key] > 0) filter[key] = defaults[key]
  }
  return filter
}

function segmentNormalizeText(transcription, lang, filter = undefined) {
  if (transcription === undefined) throw new Error("Transcription was empty")
  else if (lang === undefined) throw new Error("Langue was empty")

  filter = applySegmentFilterDefaults(filter)

  for (let seg of transcription.segments) {
    seg.segment = cleanSegment(seg.segment)
  }

  transcription.segments.map((segments) => {
    segments.raw_words = [...segments.words]
    segments.words = []

    segments.segment_array = segments.segment.split(/\s+/).filter(Boolean)

    if (segments.language) lang = segments.language

    for (let words_sequence of ruleSequenceGenerator(segments, lang, filter)) {
      segments.words.push(words_sequence)
    }
    delete segments.segment_array
  })

  if (filter && Object.keys(filter).length > 0) {
    let filtered_transcription = transcription

    let filtered_segment = filterRules.executeFilterRule(
      filtered_transcription.segments,
      filter,
    )
    filtered_transcription.segments = filtered_segment

    return filtered_transcription
  }
  return transcription
}

module.exports = {
  segmentNormalizeText,
}
