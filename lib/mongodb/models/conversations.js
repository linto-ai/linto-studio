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

            const dateTime = moment().format()
            payload.last_update = dateTime

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
            const projection = {
                text: 0,
                speakers: 0,
                keywords: 0,
                highlights: 0
            }

            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    async getConvoById(convoId, projectionArray) {
        try {
            const query = {
                _id: this.getObjectId(convoId)
            }
            let projection = {}
            if (projectionArray) {
                projectionArray.map(element => {
                    projection[element] = 1
                })
            }

            return await this.mongoRequest(query, projection)

        } catch (error) {
            console.error(error)

            return error
        }
    }

    // list conversation shared to the user
    async getConvoByShare(idUser) {
        try {
            const query = {
                "sharedWithUsers": {
                    $elemMatch: {
                        userId: idUser.toString(),
                    }
                }
            }

            const projection = {
                text: 0,
                speakers: 0,
                keywords: 0,
                highlights: 0,
                organization : 0
            }

            return await this.mongoRequest(query, projection)
        } catch (err) {
            console.error(error)
            return error
        }
    }

    // list conversation from an organization id
    async getConvoByOrga(idOrga) {
        try {
            const query = {
                "organization.organizationId": idOrga.toString()
            }

            const projection = {
                text: 0,
                speakers: 0,
                keywords: 0,
                highlights: 0
            }

            return await this.mongoRequest(query, projection)
        } catch (err) {
            console.error(error)
            return error
        }
    }

    async updateJob(_id, jobPayload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(_id),
            }
            let mutableElements = {
                jobs: { ...jobPayload }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateKeyword(_id, keywordPayload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(_id),
            }
            let mutableElements = {
                keywords: { ...keywordPayload }
            }

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
