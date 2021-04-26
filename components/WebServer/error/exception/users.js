/****************
 *****Users*******
 *****************/

const ExceptionType = 'users'

class UserEmailAlreadyUsed extends Error {
    constructor(message) {
        super()
        this.name = 'UserEmailAlreadyUsed'
        this.type = ExceptionType
        this.status = '403'
        if (message) this.message = message
        else this.message = 'Email address already in use'
    }
}

class UserParameterMissing extends Error {
    constructor(message) {
        super()
        this.name = 'UserParameterMissing'
        this.type = ExceptionType
        this.status = '405'
        if (message) this.message = message
        else this.message = 'Mandatory parameter are missing'
    }
}

class UserCreationError extends Error {
    constructor(message) {
        super()
        this.name = 'UserCreationError'
        this.type = ExceptionType
        this.status = '403'
        if (message) this.message = message
        else this.message = 'Error during the user creation process'
    }
}

class UserLogoutError extends Error {
    constructor(message) {
        super()

        this.name = 'UserLogoutError'
        this.type = ExceptionType
        this.status = '403'
        if (message) this.message = message
        else this.message = 'Unable to disconnect the user'
    }
}

module.exports = {
    //Users Exception
    UserEmailAlreadyUsed,
    UserParameterMissing,
    UserCreationError,
    UserLogoutError
}