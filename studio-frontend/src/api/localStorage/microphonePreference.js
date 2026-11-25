const STORAGE_KEY = "mobile.record.deviceId"

// The audio input chosen on this phone, for recordings and live sessions.
// null: the browser's default input. Storage failures are silent.

export function readMicrophonePreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}

export function saveMicrophonePreference(deviceId) {
  try {
    localStorage.setItem(STORAGE_KEY, deviceId ?? "")
  } catch (error) {
    console.error("cannot persist microphone choice", error)
  }
}
