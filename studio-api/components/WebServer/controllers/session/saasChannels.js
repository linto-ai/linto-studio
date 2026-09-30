// SaaS view of the channels of a quickMeeting session (microphone or bot),
// from the POST body. A channel is live when a transcriber profile actually
// transcribes it: it costs language-minutes. A channel that keeps its audio
// uncompressed with a transcription service is transcribed offline at the end
// of the session: it costs import minutes then, and nothing while streaming.
// Mirrors the defaults Session-API applies at creation and the caption
// "waiting" rule of controllers/session/conversation.js.

function channelsOf(body) {
  return Array.isArray(body && body.channels) ? body.channels : []
}

function isLiveChannel(channel) {
  if (!channel || !channel.transcriberProfileId) return false
  return channel.enableLiveTranscripts !== false
}

function isOfflineChannel(channel) {
  if (!channel) return false
  const compressAudio = channel.transcriberProfileId
    ? (channel.compressAudio ?? true)
    : false
  if (compressAudio || channel.keepAudio === false) return false
  return !!(channel.meta && channel.meta.transcriptionService)
}

// Language-minutes the session will consume per minute: one per live channel
// plus one per translation on it. Zero when nothing is transcribed live.
function liveLanguages(req) {
  return channelsOf(req.body)
    .filter(isLiveChannel)
    .reduce(
      (sum, c) =>
        sum + 1 + (Array.isArray(c.translations) ? c.translations.length : 0),
      0,
    )
}

// Import minutes to have in hand before starting: the duration is unknown
// until the session ends, so one minute stands for "some quota left", as the
// upload does when its duration probe fails. Zero when nothing is transcribed
// offline.
function offlineMinutes(req) {
  return channelsOf(req.body).some(isOfflineChannel) ? 1 : 0
}

module.exports = {
  isLiveChannel,
  isOfflineChannel,
  liveLanguages,
  offlineMinutes,
}
