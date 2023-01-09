const debug = require('debug')('linto:conversation-manager:models:mongodb:models:user')
const MongoModel = require(`../model`)
const crypto = require('crypto')
const randomstring = require('randomstring')
const moment = require('moment')

class UsersModel extends MongoModel {

    constructor() {
        super('users') // define name of 'users' collection elsewhere?
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
                salt,
                keyToken: null,
                authLink:{
                  magicId: null,
                  validityDate: null
                },
                shareNotification: true,
                accoutStatus: 'not_activated'
            }
            return await this.mongoInsert(userPayload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // create a user
    async createExternalUser(payload) {
      const magicId = randomstring.generate({charset: 'alphanumeric', length: 20})
      const validityDate = moment().add(30, 'm').format()
        
      try {
          const userPayload = {
              email: payload.email,
              firstname: payload.email,
              lastname: '',
              img: 'pictures/default.jpg',
              passwordHash: null,
              salt: null,
              keyToken: null,
              authLink:{
                magicId,
                validityDate
              },
              shareNotification: true,
              accoutStatus: 'not_activated'
          }
          return await this.mongoInsert(userPayload)
      } catch (error) {
          console.error(error)
          return error
      }
  }

    // get all users
    async getAllUsers() {
        try {
            const query = {}
            const projection = { passwordHash: 0, salt: 0, keyToken: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get a user by id 
    async getUserById(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            const projection = { passwordHash: 0, salt: 0, keyToken: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // Should not be open to the REST API
    async getUserTokenById(id) {
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
    async getUserTokenByEmail(email) {
        try {
            const query = { email }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getUserByEmailAndMagicId(email, magicId) {
        try {
            const query = { email, magicId }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // Get a user by email
    async getUserByEmail(email) {
        try {
            const query = { email }
            const projection = { passwordHash: 0, salt: 0, keyToken: 0 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // update a user conversation
    async update(payload) {
        const operator = "$set"
        const query = {
            _id: this.getObjectId(payload._id)
        }
        delete payload._id
        let mutableElements = payload
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    // update a user conversation
    async updatePassword(payload) {
        const salt = randomstring.generate(12)
        const passwordHash = crypto.pbkdf2Sync(payload.newPassword, salt, 10000, 512, 'sha512').toString('hex')
        delete payload.newPassword
        payload.salt = salt
        payload.passwordHash = passwordHash
            //payload.keyToken = ''

        const operator = "$set"
        const query = {
            _id: this.getObjectId(payload._id)
        }
        delete payload._id
        let mutableElements = payload
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    // delete a user
    async deleteUser(id) {
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

    async setUserMagicLink(email) {
      try {
        const operator = "$set"
        const query = { email }
        
        const magicId = randomstring.generate({charset: 'alphanumeric', length: 20})
        const validityDate = moment().add(30, 'm').format()
        const authLink = {magicId, validityDate}
        return await this.mongoUpdateOne(query, operator, {authLink})
      }  catch (error) {
        console.error(error)
        return error
      }
    }

    async getUserByMagicId(magicId) {
      try {
        const query = {"authLink.magicId": magicId}
        const projection = { authLink: 1, email: 1, _id:1 }
        return await this.mongoRequest(query, projection)
      }  catch (error) {
        console.error(error)
        return error
      }
    }
}

module.exports = new UsersModel()