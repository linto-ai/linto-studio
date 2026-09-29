import { apiCreateConversation } from "@/api/conversation.js"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import * as queue from "@/mobile/services/recording/queue.js"
import { buildRecordingFile } from "@/mobile/services/recording/buildRecordingFile.js"
import { mapUploadError } from "@/mobile/tools/mapUploadError.js"
import { DEFAULT_MEMBERS_RIGHT } from "@/mobile/const/defaultMembersRight.js"

// Sends one local recording through the same endpoint as a classic upload.
// Never throws: { ok, conversationId } or { ok: false, error }.
export async function uploadRecording(id, onProgress) {
  const recording = await queue.getRecording(id)
  if (!recording) {
    return { ok: false, error: { code: "missing", retryable: false } }
  }
  const file = await buildRecordingFile(recording)
  if (!file) {
    return { ok: false, error: { code: "missing", retryable: false } }
  }
  const result = await apiCreateConversation(
    recording.organizationId,
    {
      name: recording.name,
      description: "",
      membersRight: recording.sharing?.membersRight ?? DEFAULT_MEMBERS_RIGHT,
      folderId: recording.sharing?.folderId || undefined,
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
    return { ok: true, conversationId: result.conversationId ?? null }
  }
  return { ok: false, error: mapUploadError(result, navigator.onLine) }
}

function reportProgress(event, onProgress) {
  if (!event?.total) return
  onProgress(Math.floor((event.loaded * 100) / event.total))
}
