import { TRANSCRIPTION_CREATE_QUERY_PARAM } from "../../const/transcriptionCreate.js"

/**
 * Whether the URL asks for the modal, and the query to navigate to once it is
 * consumed, so that a reload doesn't reopen it.
 * @param {Object} query - route query
 * @returns {{ query: Object } | null} null when the modal isn't requested
 */
export function computeTranscriptionCreateRequest(query) {
  if (!query || !(TRANSCRIPTION_CREATE_QUERY_PARAM in query)) return null
  const remainingQuery = { ...query }
  delete remainingQuery[TRANSCRIPTION_CREATE_QUERY_PARAM]
  return { query: remainingQuery }
}
