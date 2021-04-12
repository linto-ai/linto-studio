/****************
*****Server******
*****************/

class InternalServerError extends Error {
  constructor(message) {
    super()
    this.name = 'InternalServerError'
    this.type = 'server'
    this.status = '500'
    if (message) this.message = message
    else this.message = 'Server error'
  }
}


module.exports = {
  //Server Exception
  InternalServerError,
}