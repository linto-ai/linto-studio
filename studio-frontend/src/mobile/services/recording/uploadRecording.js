import { apiCreateConversation } from "@/api/conversation.js"
import { getExtensionForMimeType } from "@/tools/audioMimeTypes.js"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import * as queue from "@/mobile/services/recording/queue.js"
import { mapUploadError } from "@/mobile/tools/mapUploadError.js"

const DEFAULT_MEMBERS_RIGHT = 1

// Sends one local recording through the same endpoint as a classic upload.
// The audio file is assembled from its chunks only here, never kept.
// Never throws: { ok } or { ok: false, error }.
export async function uploadRecording(id, onProgress) {
  const recording = await queue.getRecording(id)
  if (!recording) {
    return { ok: false, error: { code: "missing", retryable: false } }
  }
  const file = await buildFile(recording)
  const result = await apiCreateConversation(
    recording.organizationId,
    {
      name: recording.name,
      description: "",
      membersRight: DEFAULT_MEMBERS_RIGHT,
      securityLevel: DEFAULT_SECURITY_LEVEL,
      serviceName: recording.transcription.serviceName,
      transcriptionConfig: JSON.stringify(recording.transcription.config),
      speakerIdentificationCollections:
        recording.transcription.speakerIdentificationCollections ?? [],
      lang: recording.transcription.lang,
      endpoint: recording.transcription.endpoint,
      tracks: [file],
    },
    null,
    (event) => reportProgress(event, onProgress),
  )
  if (result.success) {
    return { ok: true }
  }
  return { ok: false, error: mapUploadError(result, navigator.onLine) }
}

async function buildFile(recording) {
  const chunks = await queue.getRecordingChunks(recording.id)
  const extension = getExtensionForMimeType(recording.mimeType || "")
  return new File(chunks, `${recording.name}.${extension}`, {
    type: recording.mimeType || "application/octet-stream",
  })
}

function reportProgress(event, onProgress) {
  if (!event?.total) return
  onProgress(Math.floor((event.loaded * 100) / event.total))
}
