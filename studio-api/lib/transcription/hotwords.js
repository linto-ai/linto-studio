const { supportsHotwords } = require(
  `${process.cwd()}/lib/transcription/serviceDescriptor`,
)

const MAX_WORD_LENGTH = 60
const MAX_WORDS_PER_DICTIONARY = 100
// Whisper only reads the first 200 tokens or so of its hotwords
const MAX_WORDS_PER_TRANSCRIPTION = 200

function withoutDuplicates(words) {
  const seen = new Set()
  return words.filter((word) => {
    const key = word.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Null when invalid. A word holds no comma: the engines split hotwords on it.
function sanitizeWords(words) {
  if (!Array.isArray(words)) return null
  if (words.some((word) => typeof word !== "string")) return null

  const cleaned = words
    .map((word) => word.trim().replace(/\s+/g, " "))
    .filter((word) => word !== "")
  const isInvalid = cleaned.some(
    (word) => word.includes(",") || word.length > MAX_WORD_LENGTH,
  )
  if (isInvalid) return null

  const unique = withoutDuplicates(cleaned)
  if (unique.length > MAX_WORDS_PER_DICTIONARY) return null
  return unique
}

function mergeDictionaries(dictionaries) {
  const words = dictionaries.flatMap((dictionary) => dictionary.words || [])
  return withoutDuplicates(words).slice(0, MAX_WORDS_PER_TRANSCRIPTION)
}

// Hotwords only come from the dictionaries, for a service applying them
function withHotwords(config, service, hotwords) {
  const withoutHotwords = { ...config }
  delete withoutHotwords.hotwords
  if (hotwords.length === 0 || !supportsHotwords(service)) {
    return withoutHotwords
  }
  return { ...withoutHotwords, hotwords }
}

module.exports = {
  MAX_WORD_LENGTH,
  MAX_WORDS_PER_DICTIONARY,
  MAX_WORDS_PER_TRANSCRIPTION,
  sanitizeWords,
  mergeDictionaries,
  withHotwords,
}
