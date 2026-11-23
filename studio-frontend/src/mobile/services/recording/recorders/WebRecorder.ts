import { AbstractRecorder } from "@/mobile/services/recording/recorders/AbstractRecorder.ts"
import { BrowserAudioCapture } from "@/mobile/services/recording/recorders/web/BrowserAudioCapture.ts"
import { IndexedDBChunkStorage } from "@/mobile/services/recording/recorders/web/IndexedDBChunkStorage.ts"
import type {
  RecorderStart,
  RecorderStopPatch,
  WebRecorderOptions,
} from "@/mobile/types/recorder.ts"

// The web recorder: the browser captures the microphone in chunks
// (BrowserAudioCapture), each chunk is saved in IndexedDB as it comes
// (IndexedDBChunkStorage). onProgress follows what is saved.
export class WebRecorder extends AbstractRecorder {
  storage: IndexedDBChunkStorage
  capture: BrowserAudioCapture

  constructor({
    recordingId,
    deviceId,
    onProgress,
    onLevel,
    onInterrupted,
    onMuted,
    onUnmuted,
  }: WebRecorderOptions) {
    super()
    this.storage = new IndexedDBChunkStorage({
      recordingId,
      onSaved: onProgress,
    })
    this.capture = new BrowserAudioCapture({
      deviceId,
      onChunk: (index, blob) => this.storage.append(index, blob),
      onLevel,
      onInterrupted,
      onMuted,
      onUnmuted,
    })
  }

  // The audio is saved in chunks: no file.
  async start(): Promise<RecorderStart> {
    const { mimeType } = await this.capture.start()
    return { mimeType, storage: { kind: "chunks" } }
  }

  // What was captured since the last chunk is handed to the storage first:
  // a paused page may be hidden, then frozen or killed.
  pause(): void {
    this.capture.flush()
    this.capture.pause()
  }

  // The level meter may have been suspended while paused (hidden page,
  // audio session interrupted).
  resume(): void {
    this.capture.resume()
    this.capture.resumeLevelMeter()
  }

  async stop(): Promise<RecorderStopPatch> {
    await this.capture.stop()
    await this.storage.whenSaved()
    return { sizeBytes: this.storage.sizeBytes }
  }

  get isActive(): boolean {
    return this.capture.isActive
  }

  get isMuted(): boolean {
    return this.capture.isMuted
  }

  destroy(): void {
    this.capture.destroy()
  }
}
