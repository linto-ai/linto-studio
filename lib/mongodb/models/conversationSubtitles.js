const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversation_subtitles')
const MongoModel = require(`../model`)

const moment = require('moment')

const tags_key = ['name', 'organizationId', 'categoryId', 'created', 'last_update']

class TagModel extends MongoModel {

    constructor() {
        super('conversation_subtitles') // define name of 'users' collection elsewhere?
    }

    async create(payload) {
        try {
            const dateTime = moment().format()
            payload.created = dateTime
            payload.last_update = dateTime

            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getById(id) {
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

    async update(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id)
            }
            const dateTime = moment().format()
            payload.last_update = dateTime

            let mutableElements = payload
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

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

module.exports = new TagModel()