const MongoModel = require(`${process.cwd()}/models/mongodb/model`)

class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    //create conversation
    async createConvoBase(payload) {
        try {
            const newConvo = {
                _id: this.getObjectId(),
                //startTime: asdf, 
                //endTime: asdf, 
                location: payload.loc,
                name: payload.name,
                type: payload.type,
                //lastUpdated: asdfds,
                locked: 0
            }
            return await this.mongoInsert(newConvo)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //update conversation

    //get a conversation by id

}

module.exports = new ConvoModel()