const { BUILT_IN_PUNCTUATION_MODELS } = require(
  `${process.cwd()}/lib/transcription/modelTypes`,
)
const { serviceModelType } = require(
  `${process.cwd()}/lib/transcription/serviceDescriptor`,
)

/**
 * The client's transcriptionConfig with what depends on the service replaced
 * (model type, punctuation, diarization sub-service, VAD minimum duration).
 * @param {object} service - one transcription entry of the gateway listing
 * @param {object} request
 * @param {string} request.language - "fr-FR" or "*"
 * @param {object} request.config - the client's transcriptionConfig
 * @returns {object}
 */
function buildTranscriptionConfig(service, { language, config = {} }) {
  const modelType = serviceModelType(service)
  const builtInPunctuation = BUILT_IN_PUNCTUATION_MODELS.includes(modelType)
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
    modelType,
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
