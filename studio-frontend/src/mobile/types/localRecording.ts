// One row of the `recordings` table (IndexedDB, see api/indexedDB/queue.js):
// a recording made on this phone, and the conversation it becomes on the
// server. The audio itself is not in the row: `audio.storage` says where it
// is (chunks in the `chunks` table on the web, one file in the native app).
//
// Life of a row: created when the microphone starts (RecordingStage,
// buildLocalRecording), its audio completed while recording and at the
// stop, named on the stop sheet (send), then sent and retried by the
// mobileRecordings store alone.

export type RecordingStatus =
  | "recording"
  | "naming"
  | "queued"
  | "uploading"
  | "uploaded"
  | "error"

export type PauseReason = "user" | "background" | "microphone"

// A folder of the native app, as @capacitor/filesystem names it.
export type NativeDirectory = "DATA" | "CACHE" | "TEMPORARY"

// A file of the native app, relative to one of its folders. Never an
// absolute path: on iOS the app's folders move at each install or update
// (their path holds the app container's id).
export interface NativeFile {
  directory: NativeDirectory
  // From the directory: "recordings/<name>.aac".
  path: string
}

// Where the audio of a recording is. The native file is null while the
// recorder's file is not found (it is again at the stop).
export type AudioStorage =
  | { kind: "chunks" }
  | { kind: "file"; file: NativeFile | null }

// A pause the user did not ask for: a hole in the audio.
export interface RecordingGap {
  // Position in the recording, in ms from the start.
  atMs: number
  durationMs: number
  reason: PauseReason
}

// What was recorded.
export interface RecordedAudio {
  storage: AudioStorage
  mimeType: string
  durationMs: number
  // Size actually saved: what a recording found after a crash really holds.
  sizeBytes: number
  // Highest level of the meter (0 to 1), null when not measured.
  peakLevel: number | null
  gaps: RecordingGap[]
  // Position (ms from the start) where the recording was cut short by
  // the system, null when the user stopped it.
  interruptedAt: number | null
}

// The transcription fields of the conversation request, in the format of
// apiCreateConversation (except transcriptionConfig, kept as an object and
// serialized when sending).
export interface TranscriptionSettings {
  serviceName: string
  endpoint: string
  lang: string
  transcriptionConfig: Record<string, unknown>
  speakerIdentificationCollections: string[]
}

// The sharing fields of the conversation request.
export interface SharingSettings {
  membersRight: number
  // null: the organization's inbox.
  folderId: string | null
}

// What the Record page knows of the request for the next recording. The
// sharing is always known (the screen's choices); the transcription only
// once the services are loaded. What depends on the sending itself (name,
// description, securityLevel, the file) is added when sending.
export interface ConversationSettings {
  transcription: TranscriptionSettings | null
  sharing: SharingSettings
}

export interface SendError {
  code: string
  // true: sent again by itself (network); false: waits for the user.
  retryable: boolean
  maxSize?: string
}

// The conversation this recording becomes on the server.
export interface ServerConversation {
  // Frozen when the recording starts, or at its stop when not known yet
  // (the page still loading). A transcription still null then (offline,
  // no service) is resolved when sending, from the remembered choices.
  transcription: TranscriptionSettings | null
  sharing: SharingSettings | null
  // Once created on the server.
  id: string | null
  sentAt: number | null
  // Percent sent; only ever 0 or 100 in IndexedDB, the steps in between
  // live in the store's memory.
  sendProgress: number
  sendError: SendError | null
}

export interface LocalRecording {
  id: string
  organizationId: string
  createdAt: number
  // App language when recorded: the default transcription language when
  // the transcription is resolved later.
  locale: string
  // Shown on the phone, then the conversation's name.
  name: string
  // Whether the audio stays on the phone once sent.
  keepAudio: boolean
  status: RecordingStatus
  audio: RecordedAudio
  conversation: ServerConversation
}

// What can change on a row: top-level fields, and part of `audio` or
// `conversation` (merged into them, see mergeRecordingPatch).
export interface LocalRecordingPatch {
  name?: string
  keepAudio?: boolean
  status?: RecordingStatus
  audio?: Partial<RecordedAudio>
  conversation?: Partial<ServerConversation>
}
