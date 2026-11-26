const STORAGE_KEY = "mobile.keepAudio"

// Whether new recordings keep their audio on the phone after sending.
// On by default: the library of recordings is the point of the app.
export function readKeepAudioPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false"
  } catch {
    return true
  }
}

export function saveKeepAudioPreference(keep) {
  try {
    localStorage.setItem(STORAGE_KEY, String(keep))
  } catch (error) {
    console.error("cannot persist the keep-audio preference", error)
  }
}
