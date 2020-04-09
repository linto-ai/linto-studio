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

    // get a user by name
    async getUserByName(username) {
        try {
            const query = {
                username: username
            }
            const projection = {
                _id: 1,
                username: 1,
                email: 1,
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
                username: 1,
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
    async updateUserConvo(payload) {
        try {
            const operator = "$addToSet"
            const query = {
                _id: this.getObjectId(payload._id)
            }
            let mutableElements = payload
            delete mutableElements._id
            return await this.mongoUpdate(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // removes conversations by id from user convoAccess list !!NOT WORKING YET
    async removeUserAccess(payload) {
        try {
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.id)
            }
            let mutableElements = payload
            delete mutableElements._id
            console.log(query)
            console.log(operator)
            console.log(mutableElements)
            return await this.mongoUpdate(query, operator, mutableElements)

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
                username: payload.username,
                email: payload.email,
                passwordHash,
                salt,
                convoAccess: []
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