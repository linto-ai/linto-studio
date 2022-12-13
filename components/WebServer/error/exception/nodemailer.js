/****************
** nodemailer ***
*****************/

const ExceptionType = 'nodemailer'

class NodemailerError extends Error {
  constructor(message, err) {
    super()
    this.name = 'NodemailerError'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = 'An error has occured when sending email. Please retry later or contact support.'
    if (err) this.err = err
  }
}
module.exports = {
  NodemailerError
}