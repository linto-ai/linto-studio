const debug = require('debug')('linto:conversation-manager:models:mongodb:models:user')
const MongoModel = require(`../model`)
const crypto = require('crypto')
const randomstring = require('randomstring')

const VALIDITY_DATE = require(`${process.cwd()}/lib/dao/validityDate/validityDate.js`)
const public_projection = { email: 1, firstname: 1, lastname: 1, img: 1 }

const personal_projection = { salt: 0, passwordHash: 0, keyToken: 0, authLink: 0 }

class UsersModel extends MongoModel {

    constructor() {
        super('users') // define name of 'users' collection elsewhere?
    }

    async create(payload) {
        try {
            payload = {
                ...payload,
                authLink: {
                    magicId: randomstring.generate({ charset: 'alphanumeric', length: 20 }),
                    validityDate: VALIDITY_DATE.generateValidityDate(VALIDITY_DATE.SHORT), // 30 minutes
                },
                keyToken: null,
                accountActivated: false, //accountActivated should be deleted and be emailValidated
                emailValidated: false,
                private: false,
                emailNotifications: {
                    conversations: {
                        sharing: true
                    },
                    organizations: {
                        invite: false
                    }
                }
            }
            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    // create a user
    async createUser(payload) {
        try {
            payload.salt = randomstring.generate(12)
            payload.passwordHash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex')
            delete payload.password

            payload.accountNotifications = {
                updatePassword: false,
                inviteAccount: false
            }
            return await this.create(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // create a user
    async createExternal(payload) {
        try {
            payload.lastname = ''
            payload.firstname = ''
            payload.img = 'pictures/default.jpg'
            payload.passwordHash = null
            payload.accountNotifications = {
                updatePassword: false,
                inviteAccount: true
            }

            return await this.create(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async listPublicUsers() {
        try {
            const query = {
                private: false
            }
            return await this.mongoRequest(query, public_projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getPersonalInfo(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            return await this.mongoRequest(query, personal_projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getById(id, serverAccess = false) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }

            if (serverAccess) return await this.mongoRequest(query)
            else return await this.mongoRequest(query, public_projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getByEmail(email, serverAccess = false) {
        try {
            const query = { email }
            if (serverAccess) return await this.mongoRequest(query)
            else return await this.mongoRequest(query, public_projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async update(payload) {
        const operator = "$set"
        const query = {
            _id: this.getObjectId(payload._id)
        }
        delete payload._id
        let mutableElements = payload
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    async updatePassword(id, newPassword) {
        const salt = randomstring.generate(12)
        const passwordHash = crypto.pbkdf2Sync(newPassword, salt, 10000, 512, 'sha512').toString('hex')

        const operator = "$set"
        const query = {
            _id: this.getObjectId(id)
        }
        const mutableElements = {
            salt,
            passwordHash,
            accountNotifications: {
                updatePassword: false,
                inviteAccount: false
            }
        }
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    async logout(id) {
        const operator = "$set"
        const query = {
            _id: this.getObjectId(id)
        }
        const mutableElements = {
            keyToken: null
        }
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    async generateMagicLink(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id)
            }

            const magicId = randomstring.generate({ charset: 'alphanumeric', length: 20 })
            const validityDate = VALIDITY_DATE.generateValidityDate(VALIDITY_DATE.SHORT)

            const mutableElements = {
                authLink: {
                    magicId,
                    validityDate
                },
                accountNotifications: {
                    inviteAccount: payload.accountNotifications.inviteAccount,
                    updatePassword: true
                }
            }

            const mongo_result = await this.mongoUpdateOne(query, operator, mutableElements)
            return {
                ...mongo_result,
                data: { magicId }
            }
        } catch (error) {
            return error
        }
    }

    async getByMagicId(magicId) {
        try {
            const query = { "authLink.magicId": magicId }
            const projection = { authLink: 1, email: 1, _id: 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            return error
        }
    }

    // Should not be open to the REST API
    async getTokenById(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }
    async getTokenByEmail(email) {
        try {
            const query = { email }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // delete a user
    async delete(id) {
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