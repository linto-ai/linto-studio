const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversation_subtitles')
const MongoModel = require(`../model`)

const moment = require('moment')

class SubtitleModel extends MongoModel {

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

    async deleteScreen(id, screenId) {
        const operator = "$pull"
        const query = {
            _id: this.getObjectId(id),
        }

        const values = {
            screens: { screen_id: screenId }
        }
        return await this.mongoUpdateOne(query, operator, values)
    }

    async updateScreen(id, screenId, screen) {
        const query = { _id: this.getObjectId(id), }
        const operator = "$set"
        const filter = { arrayFilters: [{ 'elem.screen_id': screenId }] }

        screen.screen_id = screenId
        const values = {
            'screens.$[elem]': screen
        }
        return await this.mongoUpdateOne(query, operator, values, filter)
    }

    async addScreen(id, screenId, screen, position = 0) {
        if (position < 0) position = 0
        const query = { _id: this.getObjectId(id), }
        const operator = "$push"

        const values = {
            screens: {
                $each: [screen],
                $position: position
            }
        }
        return await this.mongoUpdateOne(query, operator, values)
    }
}

module.exports = new SubtitleModel()