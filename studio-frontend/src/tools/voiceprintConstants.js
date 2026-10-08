export const COLLECTION_TYPE = Object.freeze({
  CUSTOM: "custom",
  ORGANIZATION: "organization",
})

export const STORAGE_MODE = Object.freeze({
  AUDIO: "audio",
  EMBEDDINGS: "embeddings",
})

export const VOICE_SAMPLE_DURATION = Object.freeze({
  MIN_SECONDS: 20,
  MAX_SECONDS: 30,
})

export const UPLOAD_ERROR_KEYS_BY_STATUS = Object.freeze({
  415: "speaker_diarization.upload_error_unsupported_format",
  422: "speaker_diarization.upload_error_mismatch",
  503: "speaker_diarization.upload_error_service_unavailable",
})
