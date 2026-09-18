export const RECORD_BUTTON_STATES = Object.freeze({
  idle: { icon: "microphone", label: "mobile.record.start" },
  starting: { icon: "microphone", label: "mobile.record.starting" },
  recording: { icon: "stop", label: "mobile.record.stop" },
  paused: { icon: "stop", label: "mobile.record.stop" },
  denied: { icon: "microphone-slash", label: "mobile.record.denied" },
  blocked: { icon: "microphone-slash", label: "mobile.record.blocked" },
})
