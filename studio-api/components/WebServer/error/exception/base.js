class StudioError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

function createException(name, type, status, defaultMessage, code) {
  const ExceptionClass = class extends StudioError {
    constructor(message, extras) {
      super(message || defaultMessage)
      if (extras && typeof extras === "object") {
        Object.assign(this, extras)
      }
      this.type = type
      this.status = status
      if (code) this.code = code
    }
  }
  Object.defineProperty(ExceptionClass, "name", { value: name })
  return ExceptionClass
}

module.exports = { StudioError, createException }
