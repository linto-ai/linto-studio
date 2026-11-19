// What a transcription service does by itself, by the model_type it declares
// (cf. the gateway's docs/transcription-service-declaration.md)
const BUILT_IN_PUNCTUATION_MODELS = ["whisper", "nemo", "cohere", "qwen"]
const BUILT_IN_NUMBER_CONVERSION_MODELS = ["whisper", "cohere", "qwen"]
const KNOWN_MODEL_TYPE = /whisper|cohere|qwen|nemo/

// The known model a declared type names ("qwen3_asr" is "qwen"), else the
// type as declared.
function knownModelType(declared) {
  const type = String(declared || "")
    .trim()
    .toLowerCase()
  const known = type.match(KNOWN_MODEL_TYPE)
  if (known) return known[0]
  return type
}

module.exports = {
  BUILT_IN_PUNCTUATION_MODELS,
  BUILT_IN_NUMBER_CONVERSION_MODELS,
  knownModelType,
}
