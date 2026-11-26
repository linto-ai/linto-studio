import { getSupportedRecordingMimeType } from "@/tools/audio/audioMimeTypes.js"
import { buildAudioConstraints } from "@/mobile/tools/buildAudioConstraints.js"
import type {
  AudioCapture,
  AudioCaptureOptions,
} from "@/mobile/types/recorder.ts"

const CHUNK_INTERVAL_MS = 10_000
const LEVEL_INTERVAL_MS = 100

// Older Safari only has the prefixed AudioContext.
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

// Captures the microphone in the browser, nothing else: the audio is
// handed over in chunks (WebRecorder stores them). Owns the microphone
// stream, the MediaRecorder and the level meter of one recording. Chunks
// and levels are pushed to the callbacks; nothing about storage or UI
// lives here. destroy() releases every resource.
// onMuted / onUnmuted: the system took the microphone away and gave it back
// (iOS mutes it while the page is hidden, a call or Siri mutes it too); the
// MediaRecorder keeps running meanwhile, the caller decides what to do.
// onInterrupted: the recording cannot go on (track ended, recorder error).
export class BrowserAudioCapture implements AudioCapture {
  deviceId: AudioCaptureOptions["deviceId"]
  onChunk: AudioCaptureOptions["onChunk"]
  onLevel: AudioCaptureOptions["onLevel"]
  onInterrupted: AudioCaptureOptions["onInterrupted"]
  onMuted: AudioCaptureOptions["onMuted"]
  onUnmuted: AudioCaptureOptions["onUnmuted"]
  stream: MediaStream | null
  mediaRecorder: MediaRecorder | null
  audioContext: AudioContext | null
  analyser: AnalyserNode | null
  levelTimer: ReturnType<typeof setInterval> | undefined
  chunkIndex: number
  mimeType: string

  constructor({
    deviceId,
    onChunk,
    onLevel,
    onInterrupted,
    onMuted,
    onUnmuted,
  }: AudioCaptureOptions) {
    this.deviceId = deviceId
    this.onChunk = onChunk
    this.onLevel = onLevel
    this.onInterrupted = onInterrupted
    this.onMuted = onMuted
    this.onUnmuted = onUnmuted
    this.stream = null
    this.mediaRecorder = null
    this.audioContext = null
    this.analyser = null
    this.levelTimer = undefined
    this.chunkIndex = 0
    this.mimeType = ""
  }

  async start(): Promise<{ mimeType: string }> {
    this.stream = await navigator.mediaDevices.getUserMedia(
      buildAudioConstraints(this.deviceId),
    )
    this.mimeType = getSupportedRecordingMimeType()
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: this.mimeType || undefined,
      audioBitsPerSecond: 32_000,
    })
    this.mediaRecorder.addEventListener("dataavailable", (event) =>
      this.handleChunk(event.data),
    )
    this.mediaRecorder.addEventListener("error", (event) =>
      this.handleRecorderError(event),
    )
    this.watchTrack()
    this.startLevelMeter()
    this.mediaRecorder.start(CHUNK_INTERVAL_MS)
    return { mimeType: this.mediaRecorder.mimeType || this.mimeType }
  }

  pause(): void {
    if (this.mediaRecorder?.state === "recording") this.mediaRecorder.pause()
  }

  resume(): void {
    if (this.mediaRecorder?.state === "paused") this.mediaRecorder.resume()
  }

  // Hands what was captured since the last chunk to onChunk now instead of
  // at the next timeslice: called before the page may be frozen or killed.
  flush(): void {
    if (!this.isActive) return
    try {
      this.mediaRecorder?.requestData()
    } catch (error) {
      console.error("cannot flush the recorder", error)
    }
  }

  // The level meter's AudioContext may be suspended while the page was
  // hidden or the audio session interrupted.
  resumeLevelMeter(): void {
    this.audioContext?.resume().catch(() => {})
  }

  // Resolves once the last chunk has been delivered to onChunk.
  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        resolve()
        return
      }
      this.mediaRecorder.addEventListener("stop", () => resolve(), {
        once: true,
      })
      this.mediaRecorder.stop()
    })
  }

  get isActive(): boolean {
    return (
      this.mediaRecorder !== null && this.mediaRecorder.state !== "inactive"
    )
  }

  get isMuted(): boolean {
    return this.stream?.getAudioTracks()[0]?.muted ?? false
  }

  destroy(): void {
    clearInterval(this.levelTimer)
    this.stream?.getTracks().forEach((track) => track.stop())
    this.audioContext?.close().catch(() => {})
    this.stream = null
    this.mediaRecorder = null
    this.audioContext = null
  }

  handleChunk(blob: Blob): void {
    if (!blob || blob.size === 0) return
    this.onChunk(this.chunkIndex, blob)
    this.chunkIndex += 1
  }

  watchTrack(): void {
    const track = this.stream?.getAudioTracks()[0]
    if (!track) return
    // Property assignment: the handlers die with the track. track.stop()
    // (destroy) never fires them.
    track.onended = () => this.onInterrupted("track-ended")
    track.onmute = () => this.onMuted()
    track.onunmute = () => this.onUnmuted()
  }

  handleRecorderError(event: ErrorEvent): void {
    console.error("media recorder error", event.error)
    this.onInterrupted("recorder-error")
  }

  startLevelMeter(): void {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass || !this.stream) return
    this.audioContext = new AudioContextClass()
    // Created after an await: browsers may hand it out suspended.
    this.audioContext.resume().catch(() => {})
    const analyser = this.audioContext.createAnalyser()
    this.analyser = analyser
    analyser.fftSize = 256
    this.audioContext.createMediaStreamSource(this.stream).connect(analyser)
    const samples = new Uint8Array(analyser.frequencyBinCount)
    this.levelTimer = setInterval(() => {
      analyser.getByteTimeDomainData(samples)
      this.onLevel(computeRmsLevel(samples))
    }, LEVEL_INTERVAL_MS)
  }
}

// Speech on a phone mic is quiet (RMS 0.02 to 0.1): both RMS and peak
// are boosted so a normal voice fills a good part of the meter.
function computeRmsLevel(samples: Uint8Array): number {
  let sum = 0
  let peak = 0
  for (const sample of samples) {
    const centered = Math.abs(sample - 128) / 128
    sum += centered * centered
    if (centered > peak) peak = centered
  }
  const rms = Math.sqrt(sum / samples.length)
  return Math.min(1, Math.max(rms * 8, peak * 2))
}
