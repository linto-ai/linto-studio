/****************
 **Folder***
 *****************/

const ExceptionType = "folder"

class FolderError extends Error {
  constructor(message, err) {
    super()
    this.name = "FolderError"
    this.type = ExceptionType
    this.status = 400
    if (message) this.message = message
    else this.message = `Folder error`
    if (err) this.err = err
  }
}

class FolderNotFound extends Error {
  constructor(message, err) {
    super()
    this.name = "FolderNotFound"
    this.type = ExceptionType
    this.status = 404
    if (message) this.message = message
    else this.message = `Folder not found`
    if (err) this.err = err
  }
}

class FolderConflict extends Error {
  constructor(message, err) {
    super()
    this.name = "FolderConflict"
    this.type = ExceptionType
    this.status = 409
    if (message) this.message = message
    else this.message = `Folder conflict`
    if (err) this.err = err
  }
}

class FolderCycleDetected extends Error {
  constructor(message, err) {
    super()
    this.name = "FolderCycleDetected"
    this.type = ExceptionType
    this.status = 422
    if (message) this.message = message
    else this.message = `Moving this folder would create a cycle`
    if (err) this.err = err
  }
}

module.exports = {
  FolderError,
  FolderNotFound,
  FolderConflict,
  FolderCycleDetected,
}
