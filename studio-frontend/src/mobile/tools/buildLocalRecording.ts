import { RECORDING_STATUS } from "../const/recordingStatus.js"
import type {
  AudioStorage,
  ConversationSettings,
  LocalRecording,
} from "../types/localRecording.ts"

/**
 * The row of a recording whose microphone just started: nothing recorded
 * yet, nothing sent. The settings are those of the screen at that moment
 * (null while the page is still loading them).
 */
export function buildLocalRecording({
  id,
  organizationId,
  name,
  keepAudio,
  locale,
  mimeType,
  storage,
  settings,
  createdAt,
}: {
  id: string
  organizationId: string
  name: string
  keepAudio: boolean
  locale: string
  mimeType: string
  storage: AudioStorage
  settings: ConversationSettings | null
  createdAt: number
}): LocalRecording {
  return {
    id,
    organizationId,
    createdAt,
    locale,
    name,
    keepAudio,
    status: RECORDING_STATUS.RECORDING,
    audio: {
      storage,
      mimeType,
      durationMs: 0,
      sizeBytes: 0,
      peakLevel: null,
      gaps: [],
      interruptedAt: null,
    },
    conversation: {
      transcription: settings?.transcription ?? null,
      sharing: settings?.sharing ?? null,
      id: null,
      sentAt: null,
      sendProgress: 0,
      sendError: null,
    },
  }
}
