/**
 * Whether a transcription service can recognize enrolled voices: the
 * deployment offers it and its first diarization sub-service advertises
 * speaker identification.
 * @param {object} service - one entry of GET /services
 * @param {boolean} featureEnabled - the apiStatus/hasSpeakerIdentification getter
 * @returns {boolean}
 */
export function isSpeakerIdentificationCapable(service, featureEnabled) {
  if (!featureEnabled) return false
  const diarization = service?.sub_services?.diarization?.[0]
  return diarization?.info?.speaker_identification === true
}
