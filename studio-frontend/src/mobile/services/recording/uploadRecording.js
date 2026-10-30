import { apiCreateConversation } from "@/api/conversation.js"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import * as queue from "@/mobile/services/recording/queue.js"
import { buildRecordingFile } from "@/mobile/services/recording/buildRecordingFile.js"
import { mapUploadError } from "@/mobile/tools/mapUploadError.js"
import { DEFAULT_MEMBERS_RIGHT } from "@/mobile/const/defaultMembersRight.js"
import { resolveUploadSettings } from "@/mobile/services/transcription/resolveUploadSettings.js"

// Sends one local recording through the same endpoint as a classic upload.
// Never throws: { ok, conversationId }, { ok: false, error }, or
// { ok: false, canceled: true } once `signal` aborted the request.
export async function uploadRecording(id, onProgress, signal) {
  const recording = await queue.getRecording(id)
  if (!recording) {
    return { ok: false, error: { code: "missing", retryable: false } }
  }
  const file = await buildRecordingFile(recording)
  if (!file) {
    return { ok: false, error: { code: "missing", retryable: false } }
  }
  const { transcription, sharing } = await settingsOf(recording)
  if (!transcription) {
    const code = navigator.onLine ? "no_service" : "offline"
    return { ok: false, error: { code, retryable: true } }
  }
  const result = await apiCreateConversation(
    recording.organizationId,
    {
      name: recording.name,
      description: "",
      membersRight: sharing?.membersRight ?? DEFAULT_MEMBERS_RIGHT,
      folderId: sharing?.folderId || undefined,
      securityLevel: DEFAULT_SECURITY_LEVEL,
      serviceName: transcription.serviceName,
      transcriptionConfig: JSON.stringify(transcription.config),
      speakerIdentificationCollections:
        transcription.speakerIdentificationCollections ?? [],
      lang: transcription.lang,
      endpoint: transcription.endpoint,
      tracks: [file],
    },
    null,
    (event) => reportProgress(event, onProgress),
    signal,
  )
  if (result.success) {
    return { ok: true, conversationId: result.conversationId ?? null }
  }
  if (result.canceled) {
    return { ok: false, canceled: true }
  }
  return { ok: false, error: mapUploadError(result, navigator.onLine) }
}

// The choices frozen when the stop sheet closed, else the remembered ones.
async function settingsOf(recording) {
  if (recording.transcription && recording.sharing) {
    return {
      transcription: recording.transcription,
      sharing: recording.sharing,
    }
  }
  const resolved = await resolveUploadSettings(recording.organizationId)
  return {
    transcription: recording.transcription ?? resolved.transcription,
    sharing: recording.sharing ?? resolved.sharing,
  }
}

function reportProgress(event, onProgress) {
  if (!event?.total) return
  onProgress(Math.floor((event.loaded * 100) / event.total))
}
