/****************
 *****Users*******
 *****************/

const ExceptionType = 'users'

class UserError extends Error {
    constructor(message) {
        super()
        this.name = 'UserError'
        this.type = ExceptionType
        this.status = '400'
        if (message) this.message = message
        else this.message = 'Error during the operation'
    }
}

class UserConflict extends Error {
    constructor(message) {
        super()
        this.name = 'UserConflict'
        this.type = ExceptionType
        this.status = '409'
        if (message) this.message = message
        else this.message = 'user address already use'
    }
}

class UserForbidden extends Error {
    constructor(message) {
        super()
        this.name = 'UserForbidden'
        this.type = ExceptionType
        this.status = '403'
        if (message) this.message = message
        else this.message = 'Not allowed to do this'
    }
}

class UserNotFound extends Error {
    constructor(message) {
        super()
        this.name = 'UserNotFound'
        this.type = ExceptionType
        this.status = '404'
        if (message) this.message = message
        else this.message = 'User not found'
    }
}

class UserUnsupportedMediaType extends Error {
    constructor(message) {
        super()
        this.name = 'UserUnsupportedMediaType'
        this.type = ExceptionType
        this.status = '415'
        if (message) this.message = message
        else this.message = 'Parameter is not supported'
    }
}




module.exports = {
    UserConflict,
    UserError,
    UserForbidden,
    UserNotFound,
    UserUnsupportedMediaType
}