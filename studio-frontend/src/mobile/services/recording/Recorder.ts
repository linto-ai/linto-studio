// The contract both recorders follow (LocalRecorder for the web,
// NativeRecorder for the app): the page drives a recording through it
// without knowing where the audio is captured.

// Why a recording cannot go on.
export type InterruptionReason =
  | "track-ended"
  | "recorder-error"
  | "recorder-stalled"

// Shown by the native app while it records (foreground service).
export interface RecordingNotification {
  title: string
  body: string
  channelName: string
  channelDescription: string
}

// Callbacks both recorders take.
interface CommonRecorderOptions {
  onLevel: (level: number) => void
  onInterrupted: (reason: InterruptionReason) => void
}

export interface LocalRecorderOptions extends CommonRecorderOptions {
  onChunk: (index: number, blob: Blob) => void
  onMuted: () => void
  onUnmuted: () => void
}

export interface NativeRecorderOptions extends CommonRecorderOptions {
  onProgress: (sizeBytes: number) => void
  notification: RecordingNotification
}

// What the page hands to whichever recorder the build creates: each one
// reads its own options and ignores the others.
export type RecorderOptions = LocalRecorderOptions & NativeRecorderOptions

// Where the audio goes: chunks for the web (no file), a file for the app.
export interface RecorderStart {
  mimeType: string
  audioFileUri: string | null
}

// What the recorder knows better than the page once stopped (native file:
// where it ended up, exact duration and size). Empty for the web.
export interface RecorderStopPatch {
  audioFileUri?: string | null
  durationMs?: number
  sizeBytes?: number
}

export interface Recorder {
  start(deviceId?: string | null): Promise<RecorderStart>
  pause(): void
  resume(): void
  flush(): void
  resumeLevelMeter(): void
  stop(): Promise<RecorderStopPatch>
  readonly isActive: boolean
  readonly isMuted: boolean
  destroy(): void
}
