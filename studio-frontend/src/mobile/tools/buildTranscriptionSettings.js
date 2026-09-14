import generateServiceConfig from "../../tools/generateServiceConfig.js"

/**
 * Builds the upload fields (serviceName, endpoint, lang, config) for a
 * service and the two choices a phone user makes: language and speaker
 * separation. Punctuation follows the service (built-in or its first
 * sub-service).
 * @param {object} service - one entry of GET /services
 * @param {{ language: string, diarization: boolean }} choices
 * @returns {object} what apiCreateConversation expects, plus displayName
 */
export function buildTranscriptionSettings(service, { language, diarization }) {
  const hasBuiltInPunctuation = ["whisper", "nemo"].includes(service.model_type)
  const punctuationService =
    service.sub_services?.punctuation?.[0]?.service_name
  const diarizationService =
    service.sub_services?.diarization?.[0]?.service_name
  const config = generateServiceConfig(service, {
    languageValue: language,
    punctuationValue: hasBuiltInPunctuation
      ? "disabled"
      : (punctuationService ?? "disabled"),
    diarizationValue:
      diarization && diarizationService ? diarizationService : "disabled",
  })
  return { ...config, diarization: diarization && !!diarizationService }
}
