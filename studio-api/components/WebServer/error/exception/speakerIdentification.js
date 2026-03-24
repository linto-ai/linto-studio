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

// Voiceprint collection exceptions
const VoiceprintCollectionError = createException("VoiceprintCollectionError", "voiceprintCollection", 400, "Voiceprint collection error")
const VoiceprintCollectionNotFound = createException("VoiceprintCollectionNotFound", "voiceprintCollection", 404, "Voiceprint collection not found")

// Voice sample exceptions (org-scoped, custom collections)
const VoiceSampleError = createException("VoiceSampleError", "voiceSample", 400, "Voice sample error")
const VoiceSampleNotFound = createException("VoiceSampleNotFound", "voiceSample", 404, "Voice sample not found")
const VoiceSampleUnsupportedMediaType = createException("VoiceSampleUnsupportedMediaType", "voiceSample", 415, "Voice sample unsupported media type")

// User voice sample exceptions (user-scoped)
const UserVoiceSampleError = createException("UserVoiceSampleError", "userVoiceSample", 400, "User voice sample error")
const UserVoiceSampleNotFound = createException("UserVoiceSampleNotFound", "userVoiceSample", 404, "User voice sample not found")
const UserVoiceSampleUnsupportedMediaType = createException("UserVoiceSampleUnsupportedMediaType", "userVoiceSample", 415, "User voice sample unsupported media type")

module.exports = {
  SpeakerLabelError,
  SpeakerLabelNotFound,
  SpeakerLabelConflict,
  VoiceprintCollectionError,
  VoiceprintCollectionNotFound,
  VoiceSampleError,
  VoiceSampleNotFound,
  VoiceSampleUnsupportedMediaType,
  UserVoiceSampleError,
  UserVoiceSampleNotFound,
  UserVoiceSampleUnsupportedMediaType,
}
