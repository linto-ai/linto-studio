/**
 * Channel definition of a quick session started from the phone, in the
 * shape the classic QuickSessionCreateContent sends. The audio, when kept,
 * stays compressed and no offline pass follows: one channel, one
 * conversation, like the classic live without "offline transcription".
 * @param {{ profile: object, translations: string[], keepAudio: boolean, diarization: boolean }} choices
 * @returns {object}
 */
export function buildLiveChannel({
  profile,
  translations,
  keepAudio,
  diarization,
}) {
  return {
    name: "Main",
    diarization,
    keepAudio,
    compressAudio: true,
    enableLiveTranscripts: true,
    transcriberProfileId: profile.id,
    translations,
    meta: { transcriptionService: null },
  }
}
