const ExceptionType = "voiceSignature"

class VoiceSignatureError extends Error {
  constructor(message, err) {
    super()
    this.name = "VoiceSignatureError"
    this.type = ExceptionType
    this.status = 400
    if (message) this.message = message
    else this.message = `Voice signature error`
    if (err) this.err = err
  }
}

class VoiceSignatureNotFound extends Error {
  constructor(message, err) {
    super()
    this.name = "VoiceSignatureNotFound"
    this.type = ExceptionType
    this.status = 404
    if (message) this.message = message
    else this.message = `Voice signature not found`
    if (err) this.err = err
  }
}

class VoiceSignatureConflict extends Error {
  constructor(message, err) {
    super()
    this.name = "VoiceSignatureConflict"
    this.type = ExceptionType
    this.status = 409
    if (message) this.message = message
    else this.message = `Voice signature conflict`
    if (err) this.err = err
  }
}

class VoiceSignatureUnsupportedMediaType extends Error {
  constructor(message, err) {
    super()
    this.name = "VoiceSignatureUnsupportedMediaType"
    this.type = ExceptionType
    this.status = 415
    if (message) this.message = message
    else this.message = `Voice signature unsupported media type`
    if (err) this.err = err
  }
}

module.exports = {
  VoiceSignatureError,
  VoiceSignatureNotFound,
  VoiceSignatureConflict,
  VoiceSignatureUnsupportedMediaType,
}
