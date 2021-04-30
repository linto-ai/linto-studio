const debug = require('debug')('linto:conversation-manager:models:mongodb:models:user')
const MongoModel = require(`${process.cwd()}/models/mongodb/model`)
const crypto = require('crypto')
const randomstring = require('randomstring')

class UsersModel extends MongoModel {

    constructor() {
        super('users') // define name of 'users' collection elsewhere?
    }

    // get all users
    async getAllUsers() {
        try {
            const query = {}
            const projection = { passwordHash: 0, salt: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get a user by id 
    async getUserbyId(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            const projection = { passwordHash: 0, salt: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // Get a user by email
    async getUserByEmail(email) {
        try {
            const query = { email }
            const projection = {}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // update a user conversation
    async update(payload) {
        const query = {
            _id: payload._id
        }
        delete payload._id
        let mutableElements = payload
        return await this.mongoUpdate(query, mutableElements)
    }

    // create a user
    async createUser(payload) {
        try {
            const salt = randomstring.generate(12)
            const passwordHash = crypto.pbkdf2Sync(payload.password, salt, 10000, 512, 'sha512').toString('hex')
            const userPayload = {
                email: payload.email,
                firstname: payload.firstname,
                lastname: payload.lastname,
                img: payload.img,
                passwordHash,
                salt
            }
            return await this.mongoInsert(userPayload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // delete a user
    async deleteUserbyId(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            return await this.mongoDelete(query)

        } catch (error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new UsersModel()