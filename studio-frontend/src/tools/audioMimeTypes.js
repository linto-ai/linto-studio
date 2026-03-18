const MIME_EXTENSION_MAP = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
}

const SUPPORTED_RECORDING_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
]

export function getExtensionForMimeType(mimeType) {
  for (const [mime, ext] of Object.entries(MIME_EXTENSION_MAP)) {
    if (mimeType.includes(mime)) return ext
  }
  return "webm"
}

export function getSupportedRecordingMimeType() {
  for (const type of SUPPORTED_RECORDING_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return ""
}
