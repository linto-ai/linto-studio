import { appendChunk } from "@/api/indexedDB/queue.js"
import type { AudioChunkStorage } from "@/mobile/types/recorder.ts"

// Saves the chunks of one web recording in IndexedDB, one after the
// other. The size only grows with what is written: a recording found again
// after the page was killed announces the audio it really has.
export class IndexedDBChunkStorage implements AudioChunkStorage {
  recordingId: string
  onSaved: (sizeBytes: number) => void
  sizeBytes: number
  // The writes in order: each one starts once the previous one is done.
  writes: Promise<void>

  constructor({
    recordingId,
    onSaved,
  }: {
    recordingId: string
    onSaved: (sizeBytes: number) => void
  }) {
    this.recordingId = recordingId
    this.onSaved = onSaved
    this.sizeBytes = 0
    this.writes = Promise.resolve()
  }

  append(index: number, blob: Blob): void {
    this.writes = this.writes.then(() => this.write(index, blob))
  }

  whenSaved(): Promise<void> {
    return this.writes
  }

  async write(index: number, blob: Blob): Promise<void> {
    try {
      await appendChunk(this.recordingId, index, blob)
      this.sizeBytes += blob.size
      this.onSaved(this.sizeBytes)
    } catch (error) {
      console.error("cannot store recording chunk", error)
    }
  }
}
