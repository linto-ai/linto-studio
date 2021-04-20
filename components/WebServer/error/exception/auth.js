/****************
 ******Auth*******
 *****************/
const ExceptionType = 'auth'

class InvalidCredential extends Error {
    constructor(message) {
        super()
        this.name = 'InvalidCredential'
        this.type = ExceptionType
        this.status = 401
        if (message) this.message = message
        else this.message = 'Invalid credentials'
    }
}

class UnableToGenerateKeyToken extends Error {
    constructor(message) {
        super()
        this.name = 'UnableToGenerateKeyToken'
        this.type = ExceptionType
        this.status = 401
        if (message) this.message = message
        else this.message = 'Unable to generate the keyToken'
    }
}

class UserNotFound extends Error {
    constructor(message) {
        super()
        this.name = 'UserNotFound'
        this.type = ExceptionType
        this.status = 401
        if (message) this.message = message
        else this.message = 'Invalid credentials'
    }
}

class MultipleUserFound extends Error {
    constructor(message) {
        super()
        this.name = 'MultipleUserFound'
        this.type = ExceptionType
        this.status = 401
        if (message) this.message = message
        else this.message = 'Multiple user have been found, please check with an administrator'
    }
}


/****************
 ***Passport******
 ****************/

class MalformedToken extends Error {
    constructor(message) {
        super()
        this.name = 'MalformedToken'
        this.type = ExceptionType
        this.status = 401
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