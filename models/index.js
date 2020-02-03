const debug = require('debug')('app:model')

let db
if (process.env.DB_DRIVER === "json") {
    db = require('./json-server')
} else if (process.env.DB_DRIVER === "mongo") {
    db = require('./mongo')
} else {
    throw "unsupported database type"
}


class Model extends db {
    constructor() {
        super()
        this.host = process.env.DB_HOST
    }
}

module.exports = new Model()