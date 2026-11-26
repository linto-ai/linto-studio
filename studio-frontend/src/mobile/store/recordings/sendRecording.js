import { apiCreateConversation } from "@/api/studio-api/conversation.js"
import { apiGetTranscriptionService } from "@/api/studio-api/service.js"
import { isOnline } from "@/api/device/network.js"
import { readTranscriptionPreferences } from "@/api/localStorage/transcriptionPreferences.js"
import { computeTranscriptionChoices } from "@/mobile/tools/computeTranscriptionChoices.js"
import { computeConversationSettings } from "@/mobile/tools/computeConversationSettings.ts"
import { buildRecordingRequest } from "@/mobile/tools/buildRecordingRequest.ts"
import { mapUploadError } from "@/mobile/tools/mapUploadError.js"
import { readRecordingFile } from "@/mobile/store/recordings/recordingAudio.js"

// Sending a recording to the server, for the mobileRecordings store only.
// Nothing here throws.

/**
 * The settings a recording was made without (the services were not known
 * when it started and stopped): built from the organization's remembered
 * choices, like the Record page does. A remembered folder is not trusted
 * (it may have been deleted since): such a recording lands in the inbox.
 * The transcription is null when no service can be reached.
 * @param {import("@/mobile/types/localRecording.ts").LocalRecording} recording
 * @returns {Promise<import("@/mobile/types/localRecording.ts").ConversationSettings>}
 */
export async function resolveSettings(recording) {
  const services = await loadServices()
  const remembered = readTranscriptionPreferences(recording.organizationId)
  const choices = computeTranscriptionChoices(
    services,
    remembered,
    recording.locale,
  )
  return computeConversationSettings(
    services,
    { ...choices, folderId: null },
    false,
  )
}

/**
 * Sends one recording through the same endpoint as a classic upload.
 * @param {import("@/mobile/types/localRecording.ts").LocalRecording} recording
 * @param {import("@/mobile/types/localRecording.ts").ConversationSettings} settings
 * @param {(percent: number) => void} onProgress
 * @param {AbortSignal} signal - aborting it cancels the request
 * @returns {Promise<{ ok: true, conversationId: string|null }
 *   | { ok: false, error: import("@/mobile/types/localRecording.ts").SendError }
 *   | { ok: false, canceled: true }>}
 */
export async function sendRecording(recording, settings, onProgress, signal) {
  const file = await readRecordingFile(recording)
  switch (true) {
    case !file:
      return { ok: false, error: { code: "missing", retryable: false } }
    case !settings.transcription:
      return {
        ok: false,
        error: { code: isOnline() ? "no_service" : "offline", retryable: true },
      }
    default:
      return createConversation(recording, settings, file, onProgress, signal)
  }
}

async function createConversation(
  recording,
  settings,
  file,
  onProgress,
  signal,
) {
  const result = await apiCreateConversation(
    recording.organizationId,
    buildRecordingRequest(recording, settings, file),
    null,
    (event) => reportProgress(event, onProgress),
    signal,
  )
  switch (true) {
    case result.success:
      return { ok: true, conversationId: result.conversationId ?? null }
    case result.canceled:
      return { ok: false, canceled: true }
    default:
      return { ok: false, error: mapUploadError(result, isOnline()) }
  }
}

// An unreachable gateway is an empty list.
async function loadServices() {
  try {
    return await apiGetTranscriptionService("*")
  } catch (error) {
    console.error("cannot load transcription services", error)
    return []
  }
}

function reportProgress(event, onProgress) {
  if (!event?.total) return
  onProgress(Math.floor((event.loaded * 100) / event.total))
}
