// Preferred model_type per request, best first (engine comparison of
// 2026-11-12). The first matching rule applies.
const ROUTING_RULES = [
  // Qwen3-ASR applies hotwords best, Cohere Transcribe has none
  {
    languages: ["fr", "en", "de", "es", "it", "pt", "nl"],
    hotwords: true,
    modelTypes: ["qwen", "whisper", "cohere"],
  },
  {
    languages: ["fr", "en", "de", "es", "it"],
    modelTypes: ["cohere", "qwen", "whisper"],
  },
  // Qwen3-ASR is behind Whisper in Portuguese and Dutch
  {
    languages: ["pt", "nl"],
    modelTypes: ["cohere", "whisper", "qwen"],
  },
]

// Any other language, and the ones to detect (Cohere Transcribe cannot)
const DEFAULT_MODEL_TYPES = ["whisper", "qwen", "cohere"]

module.exports = {
  ROUTING_RULES,
  DEFAULT_MODEL_TYPES,
}
