const HEADER_SIZE = 44
const BYTES_PER_SAMPLE = 2

// Builds a mono 16-bit PCM wav file from Float32 frames in [-1, 1].
export function encodeWav(frames, sampleRate) {
  const sampleCount = frames.reduce((sum, frame) => sum + frame.length, 0)
  const dataSize = sampleCount * BYTES_PER_SAMPLE
  const buffer = new ArrayBuffer(HEADER_SIZE + dataSize)
  const view = new DataView(buffer)

  writeHeader(view, sampleRate, dataSize)

  let offset = HEADER_SIZE
  for (const frame of frames) {
    for (const sample of frame) {
      view.setInt16(offset, toInt16(sample), true)
      offset += BYTES_PER_SAMPLE
    }
  }
  return new Blob([buffer], { type: "audio/wav" })
}

function writeHeader(view, sampleRate, dataSize) {
  const channels = 1
  const byteRate = sampleRate * channels * BYTES_PER_SAMPLE
  writeAscii(view, 0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeAscii(view, 8, "WAVE")
  writeAscii(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, channels * BYTES_PER_SAMPLE, true)
  view.setUint16(34, BYTES_PER_SAMPLE * 8, true)
  writeAscii(view, 36, "data")
  view.setUint32(40, dataSize, true)
}

function writeAscii(view, offset, text) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

function toInt16(sample) {
  const clamped = Math.max(-1, Math.min(1, sample))
  return clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
}
