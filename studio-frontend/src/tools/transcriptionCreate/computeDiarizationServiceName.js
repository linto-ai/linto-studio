/**
 * Diarization sub-service of a transcription service for a speakers mode.
 * @param {{ sub_services?: { diarization?: object[] } }} service
 * @param {string} mode - see computeSpeakersMode
 * @returns {string|null} null when the service can't do it
 */
export function computeDiarizationServiceName(service, mode) {
  const candidates = service?.sub_services?.diarization ?? []
  if (mode === "distinguish") return candidates[0]?.service_name ?? null
  if (mode === "recognize") {
    const capable = candidates.find(
      (candidate) => candidate.info?.speaker_identification === true,
    )
    return capable?.service_name ?? null
  }
  return null
}
