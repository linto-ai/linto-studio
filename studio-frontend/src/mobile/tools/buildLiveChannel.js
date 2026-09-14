/**
 * Channel definition of a quick session started from the phone, in the
 * exact shape the classic QuickSessionCreateContent sends.
 * @param {{ profile: object, translations: string[], keepAudio: boolean, transcriptionService: object|null, diarization: boolean }} choices
 * @returns {object}
 */
export function buildLiveChannel({
  profile,
  translations,
  keepAudio,
  transcriptionService,
  diarization,
}) {
  const offlineTranscription = keepAudio && !!transcriptionService
  return {
    name: "Main",
    diarization,
    keepAudio,
    compressAudio: !offlineTranscription,
    enableLiveTranscripts: true,
    transcriberProfileId: profile.id,
    translations,
    meta: {
      transcriptionService: offlineTranscription ? transcriptionService : null,
    },
  }
}
