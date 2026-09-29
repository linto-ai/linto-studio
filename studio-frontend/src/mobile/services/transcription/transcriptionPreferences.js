const STORAGE_PREFIX = "mobile.transcription."

// Per-organization memory of the last transcription choices
// ({ serviceName, language, diarization }). Storage failures are silent:
// the defaults simply apply again.
export function readTranscriptionPreferences(organizationId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + organizationId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveTranscriptionPreferences(organizationId, preferences) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + organizationId,
      JSON.stringify(preferences),
    )
  } catch (error) {
    console.error("cannot persist transcription preferences", error)
  }
}
