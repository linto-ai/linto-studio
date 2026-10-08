import { UPLOAD_ERROR_KEYS_BY_STATUS } from "./voiceprintConstants.js"

// Translated by status when known, else the server message, else generic
export function voiceSampleUploadErrorMessage(error, t) {
  const detailKey = UPLOAD_ERROR_KEYS_BY_STATUS[error?.status]
  if (detailKey) return t(detailKey)
  return error?.message || t("speaker_diarization.upload_error")
}
