// Mono voice capture for meeting recordings. Echo cancellation and noise
// suppression help on a phone lying on a table; gain control keeps distant
// speakers audible.
export const AUDIO_CONSTRAINTS = Object.freeze({
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
})
