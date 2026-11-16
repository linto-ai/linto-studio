import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"

export const RECORD_BUTTON_STATES = Object.freeze({
  idle: { icon: "microphone", label: "mobile.record.start" },
  starting: { icon: "microphone", label: "mobile.record.starting" },
  recording: { icon: "stop", label: "mobile.record.stop" },
  paused: { icon: "stop", label: "mobile.record.stop" },
  // The app's permission lives in the phone settings, not the browser's.
  denied: {
    icon: "microphone-slash",
    label: IS_NATIVE_APP ? "mobile.record.denied_app" : "mobile.record.denied",
  },
  blocked: { icon: "microphone-slash", label: "mobile.record.blocked" },
})
