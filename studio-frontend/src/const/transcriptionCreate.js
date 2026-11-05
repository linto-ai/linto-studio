// Value of `draft.languages` when the language is detected: also what a
// transcription service lists when it can detect the language.
export const AUTO_LANGUAGE = "*"

// Languages shown first in the language and translation lists.
export const SUGGESTED_LANGUAGES = ["fr", "en", "es", "it", "de"]

// Query parameter reopening the modal after a pack purchase: Stripe comes back
// to a fresh page. Read and stripped by the router.
export const TRANSCRIPTION_CREATE_QUERY_PARAM = "new_transcription"

// One speaker is the same as no separation; the server is told 100 at most.
export const MIN_SPEAKER_COUNT = 2
export const MAX_SPEAKER_COUNT = 100
