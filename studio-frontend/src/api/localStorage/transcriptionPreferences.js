const STORAGE_PREFIX = "mobile.transcription."

// Per-organization memory of the last transcription and sharing choices of
// the Record page (RememberedChoices, see mobile/types/transcriptionChoices.ts).
// Also read by the recordings store to resolve the settings of a recording
// made before the services were known. Voice collections are not kept: a
// deleted one would be sent. Storage failures are silent: the defaults
// simply apply again.

/**
 * @param {string} organizationId
 * @returns {import("../../mobile/types/transcriptionChoices.ts").RememberedChoices | null}
 */
export function readTranscriptionPreferences(organizationId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + organizationId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * @param {string} organizationId
 * @param {import("../../mobile/types/transcriptionChoices.ts").TranscriptionChoices} choices
 */
export function saveTranscriptionPreferences(
  organizationId,
  { serviceName, language, diarization, membersRight, folderId },
) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + organizationId,
      JSON.stringify({
        serviceName,
        language,
        diarization,
        membersRight,
        folderId,
      }),
    )
  } catch (error) {
    console.error("cannot persist transcription preferences", error)
  }
}
