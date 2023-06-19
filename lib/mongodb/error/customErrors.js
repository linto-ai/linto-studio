const ExceptionType = 'mongo'


class MongoError extends Error {
    constructor(message, err) {
        super()
        this.name = 'MONGO_ERROR'
        this.name = 'InternalServerError'
        this.type = ExceptionType
        this.status = '500'
        if (message) this.message = message
        else this.message = 'Server error'
        if (err) this.err = err
    }
}

module.exports = {
    MongoError
}