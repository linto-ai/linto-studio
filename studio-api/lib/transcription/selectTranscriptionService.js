const { parseInfo, serviceModelType } = require(
  `${process.cwd()}/lib/transcription/serviceDescriptor`,
)
const { ROUTING_RULES, DEFAULT_MODEL_TYPES } = require(
  `${process.cwd()}/lib/transcription/routingRules`,
)

const AUTO_LANGUAGE = "*"

/**
 * The first running model of the routing rules, else the first able service.
 * @param {object[]} services - transcription entries of the gateway listing
 * @param {object} request - see filterTranscriptionServices, and
 * @param {boolean} request.hotwords - whether the request carries hotwords
 * @returns {object|null}
 */
function selectTranscriptionService(services, request) {
  const candidates = filterTranscriptionServices(services, request)
  for (const modelType of preferredModelTypes(request)) {
    const service = candidates.find(
      (candidate) => serviceModelType(candidate) === modelType,
    )
    if (service) return service
  }
  return candidates[0] ?? null
}

/**
 * The service for a session recording: its language is to detect.
 * @param {object[]} services - transcription entries of the gateway listing
 * @returns {object|null}
 */
function selectGenericTranscriptionService(services) {
  return selectTranscriptionService(services, { language: AUTO_LANGUAGE })
}

/**
 * The services listing the language, then the ones detecting it, narrowed to
 * a requested feature when one offers it: a service is always proposed.
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
  const listing = services.filter(
    (service) => listedLanguage(service, language) !== null,
  )
  const detecting = services.filter(
    (service) => !listing.includes(service) && detectsLanguage(service),
  )
  let candidates = [...listing, ...detecting]
  if (candidates.length === 0) candidates = services
  if (diarization) candidates = narrowTo(candidates, supportsDiarization)
  if (speakerIdentification) {
    candidates = narrowTo(candidates, supportsSpeakerIdentification)
  }
  return candidates
}

/**
 * The language to send to a service: its own code for it, else detection.
 * @param {object} service
 * @param {string} language
 * @returns {string}
 */
function serviceLanguage(service, language) {
  const listed = listedLanguage(service, language)
  if (listed !== null) return listed
  if (detectsLanguage(service)) return AUTO_LANGUAGE
  return language
}

// "fr" and "fr-FR" match each other; null when the service does not list it.
function listedLanguage(service, language) {
  const wanted = String(language || "")
    .trim()
    .toLowerCase()
  if (!wanted) return null
  const codes = languageCodes(service)
  return (
    codes.find((code) => code.toLowerCase() === wanted) ??
    codes.find((code) => baseLanguage(code) === baseLanguage(wanted)) ??
    null
  )
}

function baseLanguage(code) {
  return String(code || "")
    .trim()
    .toLowerCase()
    .split("-")[0]
}

function languageCodes(service) {
  return String(service.language || AUTO_LANGUAGE)
    .split(",")
    .map((code) => code.trim())
}

function detectsLanguage(service) {
  return languageCodes(service).includes(AUTO_LANGUAGE)
}

function narrowTo(services, test) {
  const matching = services.filter(test)
  return matching.length > 0 ? matching : services
}

function supportsDiarization(service) {
  return (service.sub_services?.diarization || []).length > 0
}

// The first diarization sub-service is the one used for an upload.
function supportsSpeakerIdentification(service) {
  const info = parseInfo(service.sub_services?.diarization?.[0]?.info)
  return info?.speaker_identification === true
}

function preferredModelTypes({ language, hotwords = false }) {
  const base = baseLanguage(language)
  const rule = ROUTING_RULES.find(
    (candidate) =>
      candidate.languages.includes(base) && (!candidate.hotwords || hotwords),
  )
  if (rule) return rule.modelTypes
  return DEFAULT_MODEL_TYPES
}

module.exports = {
  selectTranscriptionService,
  filterTranscriptionServices,
  selectGenericTranscriptionService,
  serviceLanguage,
}
