const { serviceEndpoint } = require(
  `${process.cwd()}/lib/transcription/serviceDescriptor`,
)
const { serviceLanguage } = require(
  `${process.cwd()}/lib/transcription/selectTranscriptionService`,
)
const { buildTranscriptionConfig } = require(
  `${process.cwd()}/lib/transcription/buildTranscriptionConfig`,
)

/**
 * What to send to a picked service for a request naming none.
 * @param {object} service - one transcription entry of the gateway listing
 * @param {object} request
 * @param {string} request.language - "fr-FR", "fr", "*" for automatic detection
 * @param {object} request.config - the client's transcriptionConfig
 * @returns {{ serviceName: string, endpoint: string, lang: string, transcriptionConfig: object }}
 */
function transcriptionRequestFor(service, { language, config = {} }) {
  const lang = serviceLanguage(service, language)
  return {
    serviceName: service.serviceName,
    endpoint: serviceEndpoint(service),
    lang,
    transcriptionConfig: buildTranscriptionConfig(service, {
      language: lang,
      config,
    }),
  }
}

module.exports = { transcriptionRequestFor }
