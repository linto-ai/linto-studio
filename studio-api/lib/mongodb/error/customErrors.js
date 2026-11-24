const ExceptionType = "mongo"

class MongoError extends Error {
  constructor(message, err) {
    super()
    this.name = "MongoError"
    this.type = ExceptionType
    this.status = "500"

    if (message) this.message = message
    else this.message = "Server error"
    if (err) this.err = err
  }
}

function isDuplicateKey(error) {
  return error?.code === 11000
}

module.exports = {
  MongoError,
  isDuplicateKey,
}
