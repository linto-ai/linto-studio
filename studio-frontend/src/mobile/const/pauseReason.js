// Why a recording is paused. Only USER pauses are the user's choice: the
// others are automatic, the time they last is a gap in the audio, and the
// recording resumes by itself once the page is visible and the microphone
// is back.
export const PAUSE_REASON = Object.freeze({
  USER: "user",
  BACKGROUND: "background",
  MICROPHONE: "microphone",
})
