const NEMO = "nemo"
const WHISPER = "whisper"
const DEFAULT_LONG_FILE_SECONDS = 1800

/**
 * The services an upload naming no service may be sent to, among the ones
 * its conversation may use. The ones speaking the chosen language ("*" is
 * automatic detection), then the ones offering a requested feature; a
 * narrowing nobody passes is dropped, a service is always proposed.
 * @param {object[]} services - transcription entries of the gateway listing
 * @param {object} request
 * @param {string} request.language - "fr-FR", "fr", "*" for automatic detection
 * @param {boolean} request.diarization
 * @param {boolean} request.speakerIdentification
 * @returns {object[]}
 */
function filterTranscriptionServices(
  services,
  { language, diarization = false, speakerIdentification = false },
) {
  let candidates = narrowTo(
    services,
    (service) => serviceLanguage(service, language) !== null,
  )
  if (diarization) candidates = narrowTo(candidates, supportsDiarization)
  if (speakerIdentification) {
    candidates = narrowTo(candidates, supportsSpeakerIdentification)
  }
  return candidates
}

/**
 * Picks one of the candidates: the model type preferred for the case when a
 * candidate has it, then the lowest `order`, then the list order. A forced
 * language goes to a NeMo model (Canary: Parakeet only detects, a language
 * outside Europe is only listed by Whisper); automatic detection goes to
 * Whisper for a short file and to a NeMo model for a long one.
 * @param {object[]} candidates - see filterTranscriptionServices
 * @param {object} request
 * @param {string} request.language
 * @param {number|null} request.duration - seconds, null when unknown
 * @param {number} longFileSeconds - a file this long or longer is long
 * @returns {object|null}
 */
function selectTranscriptionService(
  candidates,
  { language, duration = null },
  longFileSeconds = parseInt(process.env.TRANSCRIPTION_LONG_FILE_SECONDS, 10) ||
    DEFAULT_LONG_FILE_SECONDS,
) {
  if (!candidates?.length) return null
  const modelType = preferredModelType(language, duration, longFileSeconds)
  const preferred = modelType
    ? narrowTo(candidates, (service) => service.model_type === modelType)
    : candidates
  return preferred.reduce((best, service) =>
    serviceOrder(service) < serviceOrder(best) ? service : best,
  )
}

/**
 * The code under which the service lists the language: the same code
 * regardless of case, or the first one with the same base ("fr" matches
 * "fr-FR"). Null when the service does not list it.
 * @param {object} service
 * @param {string} language
 * @returns {string|null}
 */
function serviceLanguage(service, language) {
  const wanted = String(language || "")
    .trim()
    .toLowerCase()
  if (!wanted) return null
  const codes = String(service.language || "*")
    .split(",")
    .map((code) => code.trim())
  return (
    codes.find((code) => code.toLowerCase() === wanted) ??
    codes.find((code) => code.toLowerCase().split("-")[0] === wanted) ??
    null
  )
}

// Keeps the services that pass the test, unless none does.
function narrowTo(services, test) {
  const matching = services.filter(test)
  return matching.length > 0 ? matching : services
}

function supportsDiarization(service) {
  return (service.sub_services?.diarization || []).length > 0
}

// The first diarization sub-service is the one used for an upload. The
// gateway may serialize its info (cf. speakerIdentification/connector).
function supportsSpeakerIdentification(service) {
  let info = service.sub_services?.diarization?.[0]?.info
  if (typeof info === "string") {
    try {
      info = JSON.parse(info)
    } catch (err) {
      info = null
    }
  }
  return info?.speaker_identification === true
}

// Null for automatic detection with an unknown duration.
function preferredModelType(language, duration, longFileSeconds) {
  if (language !== "*") return NEMO
  if (!Number.isFinite(duration)) return null
  return duration >= longFileSeconds ? NEMO : WHISPER
}

function serviceOrder(service) {
  const order = parseInt(service.order, 10)
  return Number.isFinite(order) ? order : Number.POSITIVE_INFINITY
}

module.exports = {
  filterTranscriptionServices,
  selectTranscriptionService,
  serviceLanguage,
}
