// What a transcription service does by itself, by the model_type it declares
// (cf. the gateway's docs/transcription-service-declaration.md)
const BUILT_IN_PUNCTUATION_MODELS = ["whisper", "nemo", "cohere", "qwen"]
const BUILT_IN_NUMBER_CONVERSION_MODELS = ["whisper", "cohere", "qwen"]

module.exports = {
  BUILT_IN_PUNCTUATION_MODELS,
  BUILT_IN_NUMBER_CONVERSION_MODELS,
}
