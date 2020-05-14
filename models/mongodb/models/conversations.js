const MongoModel = require(`${process.cwd()}/models/mongodb/model`)

class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    //create conversation
    // WIP -- verify user id -- update user 
    async createConvoBase(payload) {
        try {
            const creationDate = new Date()
            const newConvo = {
                //startTime: asdf, 
                //endTime: asdf, 
                //location: payload.loc,
                name: payload.convoName,
                //type: payload.type,
                //lastUpdated: asdfds,
                created: creationDate,
                locked: 0,
                owner: payload.ownerId 
            }
            return await this.mongoInsert(newConvo)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //update conversation

    //get a conversation by id

    // get all conversations
    async getAllConvos() {
        try {
            const query = {}
            const projection = { _id: 1, name: 1}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get all speakers in a conversation
    async getConvoSpeakers(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            const projection = {speakers: 1}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

}

module.exports = new ConvoModel()