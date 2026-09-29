import { getSupportedRecordingMimeType } from "@/tools/audioMimeTypes.js"
import { buildAudioConstraints } from "@/mobile/tools/buildAudioConstraints.js"

const CHUNK_INTERVAL_MS = 10_000
const LEVEL_INTERVAL_MS = 100

// Owns the microphone stream, the MediaRecorder and the level meter of one
// recording. Chunks and levels are pushed to the callbacks; nothing about
// storage or UI lives here. destroy() releases every resource.
export class LocalRecorder {
  constructor({ onChunk, onLevel, onInterrupted }) {
    this.onChunk = onChunk
    this.onLevel = onLevel
    this.onInterrupted = onInterrupted
    this.stream = null
    this.mediaRecorder = null
    this.audioContext = null
    this.analyser = null
    this.levelTimer = null
    this.chunkIndex = 0
    this.mimeType = ""
  }

  async start(deviceId = null) {
    this.stream = await navigator.mediaDevices.getUserMedia(
      buildAudioConstraints(deviceId),
    )
    this.mimeType = getSupportedRecordingMimeType()
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: this.mimeType || undefined,
      audioBitsPerSecond: 32_000,
    })
    this.mediaRecorder.addEventListener("dataavailable", (event) =>
      this.handleChunk(event.data),
    )
    this.watchTrack()
    this.startLevelMeter()
    this.mediaRecorder.start(CHUNK_INTERVAL_MS)
    return this.mediaRecorder.mimeType || this.mimeType
  }

  pause() {
    if (this.mediaRecorder?.state === "recording") this.mediaRecorder.pause()
  }

  resume() {
    if (this.mediaRecorder?.state === "paused") this.mediaRecorder.resume()
  }

  // Resolves once the last chunk has been delivered to onChunk.
  stop() {
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

  get isActive() {
    return this.mediaRecorder?.state && this.mediaRecorder.state !== "inactive"
  }

  destroy() {
    clearInterval(this.levelTimer)
    this.stream?.getTracks().forEach((track) => track.stop())
    this.audioContext?.close().catch(() => {})
    this.stream = null
    this.mediaRecorder = null
    this.audioContext = null
  }

  handleChunk(blob) {
    if (!blob || blob.size === 0) return
    this.onChunk(this.chunkIndex, blob)
    this.chunkIndex += 1
  }

  watchTrack() {
    const track = this.stream.getAudioTracks()[0]
    if (!track) return
    track.onended = () => this.onInterrupted("track-ended")
  }

  startLevelMeter() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    this.audioContext = new AudioContextClass()
    // Created after an await: browsers may hand it out suspended.
    this.audioContext.resume().catch(() => {})
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 256
    this.audioContext
      .createMediaStreamSource(this.stream)
      .connect(this.analyser)
    const samples = new Uint8Array(this.analyser.frequencyBinCount)
    this.levelTimer = setInterval(() => {
      this.analyser.getByteTimeDomainData(samples)
      this.onLevel(computeRmsLevel(samples))
    }, LEVEL_INTERVAL_MS)
  }
}

// Speech on a phone mic is quiet (RMS 0.02 to 0.1): both RMS and peak
// are boosted so a normal voice fills a good part of the meter.
function computeRmsLevel(samples) {
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
