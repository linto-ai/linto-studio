const logger = require(`${process.cwd()}/lib/logger/logger`)
const filterRules = require("./filterRules/index")
const { alignTimedWords } = require("./alignTimedWords")

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

// Words of the segment text, timed from the STT words
function normalizeWords(segment) {
  const tokens = segment.segment.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return segment.raw_words
  try {
    return alignTimedWords(tokens, segment.raw_words, segment.start)
  } catch (error) {
    logger.warn("Segment normalization failed, keeping the STT words:", error)
    return segment.raw_words
  }
}

function segmentNormalizeText(transcription, lang, filter = undefined) {
  if (transcription === undefined) throw new Error("Transcription was empty")
  else if (lang === undefined) throw new Error("Langue was empty")

  filter = applySegmentFilterDefaults(filter)

  for (const segment of transcription.segments) {
    segment.segment = cleanSegment(segment.segment ?? "")
    segment.raw_words = [...(segment.words ?? [])]
    segment.raw_segment ??= segment.raw_words.map((word) => word.word).join(" ")
    segment.words = normalizeWords(segment)
  }

  if (Object.keys(filter).length > 0) {
    transcription.segments = filterRules.executeFilterRule(
      transcription.segments,
      filter,
    )
  }
  return transcription
}

module.exports = {
  segmentNormalizeText,
}
