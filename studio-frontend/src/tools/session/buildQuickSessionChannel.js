// Channel of a quickMeeting (microphone or visio bot) from the settings form.
// Without live, the channel is audio-only: no profile, no translations, audio
// kept for the offline transcription. Only a live channel consumes minutes.
export function buildQuickSessionChannel(settings) {
  const live = !!(settings.subInStudio && settings.selectedProfile)
  const channel = {
    name: "Main",
    diarization: settings.diarization ?? false,
    keepAudio: live ? settings.keepAudio : true,
    compressAudio: !settings.offlineTranscription,
    enableLiveTranscripts: live,
    meta: {
      transcriptionService: settings.transcriptionService,
    },
  }
  if (live) {
    channel.transcriberProfileId = settings.selectedProfile.id
    channel.translations = settings.selectedProfile.translations ?? []
  }
  return channel
}
