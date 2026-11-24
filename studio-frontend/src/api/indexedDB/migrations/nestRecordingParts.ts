import { DEFAULT_MEMBERS_RIGHT } from "../../../mobile/const/defaultMembersRight.js"
import { RECORDING_STATUS } from "../../../mobile/const/recordingStatus.js"
import type {
  LocalRecording,
  RecordedAudio,
  RecordingStatus,
  SharingSettings,
  TranscriptionSettings,
} from "../../../mobile/types/localRecording.ts"

// A row of database version 1: every field at the top level, transcription
// and sharing apart, audio file URI on the row (native app).
export interface FlatRecording {
  id: string
  organizationId: string
  createdAt: number
  name: string
  keepAudio?: boolean
  status: string
  mimeType?: string
  audioFileUri?: string | null
  durationMs?: number
  sizeBytes?: number
  peakLevel?: number
  gaps?: LocalRecording["audio"]["gaps"]
  interruptedAt?: number | null
  transcription?: {
    serviceName: string
    endpoint: string
    lang: string
    config: Record<string, unknown>
    speakerIdentificationCollections?: string[]
  } | null
  sharing?: { membersRight?: number; folderId?: string | null } | null
  conversationId?: string | null
  uploadedAt?: number | null
  progress?: number
  error?: LocalRecording["conversation"]["sendError"]
}

// A row of database version 2: LocalRecording, except for a native file,
// still known by its absolute URI (see locateNativeFiles, version 3).
export type NestedRecording = Omit<LocalRecording, "audio"> & {
  audio: Omit<RecordedAudio, "storage"> & {
    storage: { kind: "chunks" } | { kind: "file"; uri: string | null }
  }
}

/**
 * Database version 2: a version 1 row in the LocalRecording shape. The
 * audio fields go under `audio` (a file URI means a native file, else web
 * chunks); transcription and sharing become the request settings and,
 * with the sending fields, go under `conversation`. `interruptedAt` held a
 * date when set at load: it becomes a position, the end of the recording.
 * The legacy "ready" status (kept for later) is queued like every
 * recording now. Rows had no language: the app's at migration time.
 */
export function nestRecordingParts(
  row: FlatRecording,
  locale: string,
): NestedRecording {
  const durationMs = row.durationMs ?? 0
  return {
    id: row.id,
    organizationId: row.organizationId,
    createdAt: row.createdAt,
    locale,
    name: row.name,
    keepAudio: row.keepAudio ?? true,
    status: migrateStatus(row.status),
    audio: {
      storage: row.audioFileUri
        ? { kind: "file", uri: row.audioFileUri }
        : { kind: "chunks" },
      mimeType: row.mimeType ?? "",
      durationMs,
      sizeBytes: row.sizeBytes ?? 0,
      peakLevel: row.peakLevel ?? null,
      gaps: row.gaps ?? [],
      interruptedAt:
        row.interruptedAt == null
          ? null
          : Math.min(row.interruptedAt, durationMs),
    },
    conversation: {
      transcription: migrateTranscription(row.transcription),
      sharing: migrateSharing(row.sharing),
      id: row.conversationId ?? null,
      sentAt: row.uploadedAt ?? null,
      sendProgress: row.progress ?? 0,
      sendError: row.error ?? null,
    },
  }
}

function migrateStatus(status: string): RecordingStatus {
  switch (true) {
    case status === "ready":
      return RECORDING_STATUS.QUEUED
    default:
      return status as RecordingStatus
  }
}

function migrateTranscription(
  transcription: FlatRecording["transcription"],
): TranscriptionSettings | null {
  switch (true) {
    case !transcription:
      return null
    default:
      return {
        serviceName: transcription.serviceName,
        endpoint: transcription.endpoint,
        lang: transcription.lang,
        transcriptionConfig: transcription.config,
        speakerIdentificationCollections:
          transcription.speakerIdentificationCollections ?? [],
      }
  }
}

function migrateSharing(
  sharing: FlatRecording["sharing"],
): SharingSettings | null {
  switch (true) {
    case !sharing:
      return null
    default:
      return {
        membersRight: sharing.membersRight ?? DEFAULT_MEMBERS_RIGHT,
        folderId: sharing.folderId ?? null,
      }
  }
}
