/**
 * Whether a transcription service can recognize enrolled voices: the
 * feature flag is on and its first diarization sub-service advertises
 * speaker identification.
 * @param {object} service - one entry of GET /services
 * @param {boolean} featureEnabled - VUE_APP_ENABLE_SPEAKER_IDENTIFICATION
 * @returns {boolean}
 */
export function isSpeakerIdentificationCapable(service, featureEnabled) {
  if (!featureEnabled) return false
  const diarization = service?.sub_services?.diarization?.[0]
  return diarization?.info?.speaker_identification === true
}
