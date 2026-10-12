import WebVoiceSDK from "@linto-ai/webvoicesdk"
import { encodeWav } from "../../tools/encodeWav.js"

// Same processing as the live session capture (mixins/microphone.js)
const CAPTURE_CONSTRAINTS = Object.freeze({
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: true,
})

// Raw PCM capture encoded as wav on stop(); stops by itself at maxDurationSeconds
export class VoiceSampleRecorder {
  constructor({ maxDurationSeconds, onMaxDurationReached }) {
    this.maxDurationSeconds = maxDurationSeconds
    this.onMaxDurationReached = onMaxDurationReached
    this.mic = null
    this.sampleRate = 0
    this.frames = []
    this.sampleCount = 0
    this.handleFrame = this.handleFrame.bind(this)
  }

  async start() {
    this.mic = new WebVoiceSDK.Mic({ constraints: CAPTURE_CONSTRAINTS })
    this.mic.addEventListener("micFrame", this.handleFrame)
    await this.mic.start()
  }

  get durationSeconds() {
    return this.sampleRate ? this.sampleCount / this.sampleRate : 0
  }

  stop() {
    if (!this.mic) return null
    this.releaseMicrophone()
    return {
      blob: encodeWav(this.frames, this.sampleRate),
      durationSeconds: this.durationSeconds,
    }
  }

  destroy() {
    this.releaseMicrophone()
    this.frames = []
  }

  handleFrame(event) {
    if (!this.mic) return
    // Frames can arrive before start() resolves
    if (!this.sampleRate) this.sampleRate = this.mic.options.sampleRate
    const remaining = this.maxSampleCount() - this.sampleCount
    if (remaining <= 0) return
    // The SDK reuses its buffer between frames
    const kept = new Float32Array(
      event.detail.subarray(0, Math.min(event.detail.length, remaining)),
    )
    this.frames.push(kept)
    this.sampleCount += kept.length
    if (this.sampleCount >= this.maxSampleCount()) {
      this.onMaxDurationReached()
    }
  }

  maxSampleCount() {
    return Math.floor(this.maxDurationSeconds * this.sampleRate)
  }

  releaseMicrophone() {
    if (!this.mic) return
    this.mic.removeEventListener("micFrame", this.handleFrame)
    this.mic.stop()
    this.mic = null
  }
}
