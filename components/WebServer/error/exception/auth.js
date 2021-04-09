/****************
******Auth*******
*****************/

class InvalidCredential extends Error {
  constructor(message) {
    super()
    this.name = 'InvalidCredential'
    this.type = 'auth'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'Wrong user credential'
  }
}

class UnableToGenerateKeyToken extends Error {
  constructor(message) {
    super()
    this.name = 'UnableToGenerateKeyToken'
    this.type = 'auth'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'Unable to generate the keyToken'
  }
}

class UserNotFound extends Error {
  constructor(message) {
    super()
    this.name = 'UserNotFound'
    this.type = 'auth'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'User not found'
  }
}

class MultipleUserFound extends Error {
  constructor(message) {
    super()
    this.name = 'MultipleUserFound'
    this.type = 'auth'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'Multiple user have been found'
  }
}


/****************
***Passport******
****************/

class MalformedToken extends Error {
  constructor(message) {
    super()
    this.name = 'MalformedToken'
    this.type = 'auth'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'Malformed token'
  }
}


module.exports = {
  //Auth Exception
  InvalidCredential,
  MultipleUserFound,
  UnableToGenerateKeyToken,
  UserNotFound,
  //Passport Exception
  MalformedToken,
}