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

class UserUpdateError extends Error {
    constructor(message) {
        super()
        this.name = 'UserCreationError'
        this.type = ExceptionType
        this.status = '403'
        if (message) this.message = message
        else this.message = 'Error during the user update process'
    }
}

class UserDeleteError extends Error {
    constructor(message) {
        super()
        this.name = 'UserDeleteError'
        this.type = ExceptionType
        this.status = '400'
        if (message) this.message = message
        else this.message = 'Error during deletion process'
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



module.exports = {
    //Users Exception
    UserEmailAlreadyUsed,
    UserDeleteError,
    UserParameterMissing,
    UserCreationError,
    UserUpdateError,
    UserNotFound,
    UserLogoutError
}