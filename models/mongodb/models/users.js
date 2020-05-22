const MongoModel = require(`${process.cwd()}/models/mongodb/model`)
const sha1 = require('sha1')
const randomstring = require('randomstring')

class UsersModel extends MongoModel {

    constructor() {
        super('users') // define name of 'users' collection elsewhere?
    }

    // get a user by id 
    async getUserbyId(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            const projection = {
                userName: 1,
                email: 1,
                convoAccess: 1
            }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // check user login information by user name
    async getUserLoginInfo(username) {
        try {
            const query = {
                userName: username
            }
            const projection = {}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get a user by name
    async getUserByName(username) {
        try {
            const query = {
                userName: username
            }
            const projection = {
                _id: 1,
                userName: 1,
                convoAccess: 1
            }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // Get a user by email
    async getUserByEmail(email) {
        try {
            const query = {
                email: email
            }
            const projection = {
                _id: 1,
                userName: 1,
                email: 1,
                convoAccess: 1
            }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get all users [ids only]
    async getAllUserIds() {
        try {
            const query = {}
            const projection = { _id: 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get all users
    async getAllUsers() {
        try {
            const query = {}
            const projection = { pswdHash: 0, salt: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    // update a user conversation access
    async updateUserAccess(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.userId)
            }
            let mutableElements = {}
            mutableElements[`convoAccess.${payload.convoId}`] = payload.userRights
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // removes conversations by id from user convoAccess list !!NOT WORKING YET
    async removeUserAccess(payload) {
        try {
            const operator = "$unset"
            const query = {
                _id: this.getObjectId(payload.userId)
            }
            let mutableElements = {}
            mutableElements[`convoAccess.${payload.convoId}`] = payload.userRights
            return await this.mongoUpdateOne(query, operator, mutableElements)

        } catch (error) {
            console.error(error)
            return error
        }

    }


    // create a user
    async createUser(payload) {
        try {
            const salt = randomstring.generate(12)
            const passwordHash = sha1(payload.password + salt)
            const userPayload = {
                userName: payload.userName,
                email: payload.email,
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