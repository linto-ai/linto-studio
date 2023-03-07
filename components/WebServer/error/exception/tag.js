/****************
********Tag******
*****************/

const ExceptionType = 'tag'

class TagError extends Error {
  constructor(message, err) {
    super()
    this.name = 'TagError'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = `Tag error`
    if (err) this.err = err
  }
}

module.exports = {
  TagError
}