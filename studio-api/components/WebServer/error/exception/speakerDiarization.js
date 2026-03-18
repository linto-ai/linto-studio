function createException(name, type, status, defaultMessage) {
  return class extends Error {
    constructor(message, err) {
      super()
      this.name = name
      this.type = type
      this.status = status
      this.message = message || defaultMessage
      if (err) this.err = err
    }
  }
}

// Speaker label exceptions
const SpeakerLabelError = createException("SpeakerLabelError", "speakerLabel", 400, "Speaker label error")
const SpeakerLabelNotFound = createException("SpeakerLabelNotFound", "speakerLabel", 404, "Speaker label not found")
const SpeakerLabelConflict = createException("SpeakerLabelConflict", "speakerLabel", 409, "Speaker label conflict")

// Speaker label collection exceptions
const SpeakerLabelCollectionError = createException("SpeakerLabelCollectionError", "speakerLabelCollection", 400, "Speaker label collection error")
const SpeakerLabelCollectionNotFound = createException("SpeakerLabelCollectionNotFound", "speakerLabelCollection", 404, "Speaker label collection not found")

// Voice signature exceptions (org-scoped, custom collections)
const VoiceSignatureError = createException("VoiceSignatureError", "voiceSignature", 400, "Voice signature error")
const VoiceSignatureNotFound = createException("VoiceSignatureNotFound", "voiceSignature", 404, "Voice signature not found")
const VoiceSignatureUnsupportedMediaType = createException("VoiceSignatureUnsupportedMediaType", "voiceSignature", 415, "Voice signature unsupported media type")

// User voice signature exceptions (user-scoped)
const UserVoiceSignatureError = createException("UserVoiceSignatureError", "userVoiceSignature", 400, "User voice signature error")
const UserVoiceSignatureNotFound = createException("UserVoiceSignatureNotFound", "userVoiceSignature", 404, "User voice signature not found")
const UserVoiceSignatureUnsupportedMediaType = createException("UserVoiceSignatureUnsupportedMediaType", "userVoiceSignature", 415, "User voice signature unsupported media type")

module.exports = {
  SpeakerLabelError,
  SpeakerLabelNotFound,
  SpeakerLabelConflict,
  SpeakerLabelCollectionError,
  SpeakerLabelCollectionNotFound,
  VoiceSignatureError,
  VoiceSignatureNotFound,
  VoiceSignatureUnsupportedMediaType,
  UserVoiceSignatureError,
  UserVoiceSignatureNotFound,
  UserVoiceSignatureUnsupportedMediaType,
}
