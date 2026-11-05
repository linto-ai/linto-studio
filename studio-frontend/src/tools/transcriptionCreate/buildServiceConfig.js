import generateServiceConfig from "../generateServiceConfig.js"
import { computeDiarizationServiceName } from "./computeDiarizationServiceName.js"
import { computeServiceLanguage } from "./computeServiceLanguage.js"
import { computeSpeakersMode } from "./computeSpeakersMode.js"

const MODELS_WITH_BUILT_IN_PUNCTUATION = ["whisper", "nemo"]

/**
 * Service configuration for a draft. Punctuation isn't a choice: it follows
 * the service, built-in or its first sub-service when it has one.
 * @param {object} draft
 * @param {object} service - one entry of GET /services
 * @returns {object} see generateServiceConfig
 */
export function buildServiceConfig(draft, service) {
  const { count, collectionIds } = draft.speakers
  const mode = computeSpeakersMode(draft.speakers)
  const language = computeServiceLanguage(service, draft.languages)
  return generateServiceConfig(service, {
    languageValue: language,
    punctuationValue: computePunctuationServiceName(service),
    diarizationValue:
      computeDiarizationServiceName(service, mode) ?? "disabled",
    speakersNumberValue: count ?? 0,
    speakerIdentificationCollections: mode === "recognize" ? collectionIds : [],
  })
}

function computePunctuationServiceName(service) {
  if (MODELS_WITH_BUILT_IN_PUNCTUATION.includes(service.model_type)) {
    return "disabled"
  }
  return service.sub_services?.punctuation?.[0]?.service_name ?? "disabled"
}
