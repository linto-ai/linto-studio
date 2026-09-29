import { apiGetTranscriptionService } from "@/api/service.js"

// Transcription services offered by the STT gateway, all languages.
// Never throws: an unreachable gateway is an empty list.
export async function loadTranscriptionServices() {
  try {
    return await apiGetTranscriptionService("*")
  } catch (error) {
    console.error("cannot load transcription services", error)
    return []
  }
}
