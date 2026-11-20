// What goes in and out of a recorder (see AbstractRecorder, in
// services/recording/recorders), and the two parts the web recorder is
// made of (AudioCapture, AudioChunkStorage).

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
  // Size of the audio saved so far, each time it grows.
  onProgress: (sizeBytes: number) => void
}

export interface WebRecorderOptions extends CommonRecorderOptions {
  recordingId: string
  // Microphone picked by the user; null for the browser's default input.
  deviceId: string | null
  onMuted: () => void
  onUnmuted: () => void
}

// The native recorder always uses the phone's default input.
export interface NativeRecorderOptions extends CommonRecorderOptions {
  notification: RecordingNotification
}

// What the page hands to whichever recorder the build creates: each one
// reads its own options and ignores the others.
export type RecorderOptions = WebRecorderOptions & NativeRecorderOptions

// Where the audio goes: chunks for the web (no file), a file for the app.
export interface RecorderStart {
  mimeType: string
  audioFileUri: string | null
}

// What the recorder knows better than the page once stopped: the size
// saved, and for the native file where it ended up and its exact duration.
export interface RecorderStopPatch {
  audioFileUri?: string | null
  durationMs?: number
  sizeBytes?: number
}

// Captures the microphone and hands the audio over in chunks. Keeps
// nothing: what is done with the chunks is someone else's job.
export interface AudioCapture {
  start(): Promise<{ mimeType: string }>
  pause(): void
  resume(): void
  // Hands over now what is still buffered instead of at the next chunk.
  flush(): void
  // Wakes the level meter up after the page was hidden or the audio
  // session interrupted.
  resumeLevelMeter(): void
  // Resolves once the last chunk has been handed over.
  stop(): Promise<void>
  readonly isActive: boolean
  readonly isMuted: boolean
  destroy(): void
}

export interface AudioCaptureOptions {
  deviceId: string | null
  onChunk: (index: number, blob: Blob) => void
  onLevel: (level: number) => void
  onInterrupted: (reason: InterruptionReason) => void
  onMuted: () => void
  onUnmuted: () => void
}

// Saves the chunks of one recording, one after the other.
export interface AudioChunkStorage {
  // Queued: chunks are written in the order they are appended.
  append(index: number, blob: Blob): void
  // Resolves once every chunk appended so far is written.
  whenSaved(): Promise<void>
  // Size actually written.
  readonly sizeBytes: number
}
