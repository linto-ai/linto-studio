// Models carrying their own punctuation (cf. the front's generateServiceConfig)
const BUILT_IN_PUNCTUATION_MODELS = ["whisper", "nemo"]

/**
 * The client's transcriptionConfig adapted to a selected service: what
 * depends on the service is replaced (model type, punctuation, diarization
 * sub-service, VAD minimum duration), the other choices are kept.
 * @param {object} service - one transcription entry of the gateway listing
 * @param {object} request
 * @param {string} request.language - "fr-FR" or "*"
 * @param {object} request.config - the client's transcriptionConfig
 * @returns {object}
 */
function buildTranscriptionConfig(service, { language, config = {} }) {
  const builtInPunctuation = BUILT_IN_PUNCTUATION_MODELS.includes(
    service.model_type,
  )
  const punctuationWanted =
    !builtInPunctuation && config.punctuationConfig?.enablePunctuation !== false
  const punctuationService = punctuationWanted
    ? (service.sub_services?.punctuation?.[0]?.service_name ?? null)
    : null

  const diarization = config.diarizationConfig || {}
  const diarizationService =
    diarization.enableDiarization === true
      ? (service.sub_services?.diarization?.[0]?.service_name ?? null)
      : null
  let diarizationConfig
  if (diarizationService) {
    diarizationConfig = {
      ...diarization,
      enableDiarization: true,
      numberOfSpeaker: diarization.numberOfSpeaker ?? null,
      maxNumberOfSpeaker: diarization.maxNumberOfSpeaker ?? 100,
      serviceName: diarizationService,
    }
  } else {
    diarizationConfig = {
      enableDiarization: false,
      numberOfSpeaker: null,
      maxNumberOfSpeaker: null,
      serviceName: null,
    }
  }

  return {
    enableNormalization: true,
    ...config,
    language,
    modelType: service.model_type,
    punctuationConfig: {
      enablePunctuation: punctuationService !== null,
      serviceName: punctuationService,
    },
    diarizationConfig,
    vadConfig: {
      enableVAD: true,
      methodName: "WebRTC",
      ...config.vadConfig,
      minDuration: builtInPunctuation ? 30 : 0,
    },
  }
}

module.exports = { buildTranscriptionConfig }
