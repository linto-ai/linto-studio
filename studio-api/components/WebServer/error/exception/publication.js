/****************
 *****Publication*******
 *****************/

const ExceptionType = "publication"

class PublicationError extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationError"
    this.type = ExceptionType
    this.status = 400
    if (message) this.message = message
    else this.message = "Error during publication operation"
    if (err) this.err = err
  }
}

class PublicationNotConfigured extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationNotConfigured"
    this.type = ExceptionType
    this.status = 500
    if (message) this.message = message
    else this.message = "LLM Gateway not configured"
    if (err) this.err = err
  }
}

class PublicationNotFound extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationNotFound"
    this.type = ExceptionType
    this.status = 404
    if (message) this.message = message
    else this.message = "Publication not found"
    if (err) this.err = err
  }
}

class PublicationInvalidFormat extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationInvalidFormat"
    this.type = ExceptionType
    this.status = 400
    if (message) this.message = message
    else this.message = "Invalid export format"
    if (err) this.err = err
  }
}

class PublicationUploadFailed extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationUploadFailed"
    this.type = ExceptionType
    this.status = 500
    if (message) this.message = message
    else this.message = "Template upload failed"
    if (err) this.err = err
  }
}

class PublicationForbidden extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationForbidden"
    this.type = ExceptionType
    this.status = 403
    if (message) this.message = message
    else this.message = "Publication access denied"
    if (err) this.err = err
  }
}

class PublicationAuthRequired extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationAuthRequired"
    this.type = ExceptionType
    this.status = 401
    if (message) this.message = message
    else this.message = "Authentication required"
    if (err) this.err = err
  }
}

class PublicationIdRequired extends Error {
  constructor(message, err) {
    super()
    this.name = "PublicationIdRequired"
    this.type = ExceptionType
    this.status = 400
    if (message) this.message = message
    else this.message = "Parameter is required"
    if (err) this.err = err
  }
}

module.exports = {
  PublicationError,
  PublicationNotConfigured,
  PublicationNotFound,
  PublicationInvalidFormat,
  PublicationUploadFailed,
  PublicationForbidden,
  PublicationAuthRequired,
  PublicationIdRequired,
}
