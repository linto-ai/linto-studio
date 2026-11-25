// Why a recording is paused. Only USER pauses are the user's choice: the
// others are automatic and the time they last is a gap in the audio. The
// recording resumes by itself once the page is visible and the microphone
// is back, except after INTERRUPTED: the system took the microphone (a
// call, another app) and gave it back without advising to resume (iOS),
// so the user resumes.
export const PAUSE_REASON = Object.freeze({
  USER: "user",
  BACKGROUND: "background",
  MICROPHONE: "microphone",
  INTERRUPTED: "interrupted",
})
