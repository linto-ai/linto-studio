class AppError extends Error {
  constructor(message, err) {
    super(message)
    this.name = this.constructor.name
    if (err) this.err = err
  }
}

function createException(name, type, status, defaultMessage) {
  const ExceptionClass = class extends AppError {
    constructor(message, err) {
      super(message || defaultMessage, err)
      this.type = type
      this.status = status
    }
  }
  Object.defineProperty(ExceptionClass, "name", { value: name })
  return ExceptionClass
}

module.exports = { AppError, createException }
