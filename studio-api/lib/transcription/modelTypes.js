// What a transcription service does by itself, by the model_type it declares
// (cf. the gateway's docs/transcription-service-declaration.md)
const BUILT_IN_PUNCTUATION_MODELS = ["whisper", "nemo", "cohere", "qwen"]
const BUILT_IN_NUMBER_CONVERSION_MODELS = ["whisper", "cohere", "qwen"]
// The models read inside a longer declared model_type: "qwen3_asr" is "qwen"
const KNOWN_MODEL_TYPE = /whisper|cohere|qwen|nemo/

module.exports = {
  BUILT_IN_PUNCTUATION_MODELS,
  BUILT_IN_NUMBER_CONVERSION_MODELS,
  KNOWN_MODEL_TYPE,
}
