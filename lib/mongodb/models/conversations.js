const MongoModel = require(`../model`)
const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversations')

const moment = require('moment')
class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    // Create conversation
    async createConversation(conversation) {
        try {
            const dateTime = moment().format()
            conversation.created = dateTime
            conversation.last_update = dateTime

            return await this.mongoInsert(conversation)
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

            if (payload.organizationId)
                delete payload.organizationId

            delete payload._id
            let mutableElements = payload
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get all conversations
    async getAllConvos() {
        try {
            const query = {}
            const projection = {}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    async getConvoById(convoId) {
        try {
            const query = {
                _id: this.getObjectId(convoId)
            }
            const projection = {}
            return await this.mongoRequest(query, projection)

        } catch (error) {
            console.error(error)

            return error
        }
    }

    // get all speakers in a conversation
    async getConvoOwner(idConvo) {
        try {
            const query = {
                _id: this.getObjectId(idConvo)
            }
            const projection = { owner: 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getConvoShared(idConvo) {
        try {
            const query = {
                _id: this.getObjectId(idConvo)
            }
            const projection = { owner: 1, sharedWithUsers: 1, organization: 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateJob(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id),
            }
            let mutableElements = {}
            mutableElements.job = payload.job

            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async deleteById(id) {
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

module.exports = new ConvoModel()