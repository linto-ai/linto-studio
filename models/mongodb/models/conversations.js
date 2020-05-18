const MongoModel = require(`${process.cwd()}/models/mongodb/model`)
const { v4: uuidv4 } = require('uuid');

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

     // create a new speaker in a conversation
    async createSpeaker(payload) {
         //need to make sure it's not the same as a current speaker name -- is this back 
         //or front end function?
         //what about automatically updating speaker audio sample?
         //what about automatically warning if speaker doesn't speak?
         
        try {
            const operator = "$addToSet"
            const speakerid = uuidv4()
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "speakers": {
                speaker_id: speakerid,
                speaker_name: payload.speakername,
                etime: "", 
                stime: ""
                }
            }
            return await this.mongoUpdate(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //check transcript for speaker id
    async checkSpeakerId(payload){
        try{
            const query = {
                _id: this.getObjectId(payload.convoid), 
                "text.speaker_id": payload.speakerid
            }
            const projection = {_id: 0, "text.$": 1}
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //deletes a speaker from speakermap 
    async deleteSpeaker(payload){
        try{
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "speakers": {
                    speaker_id: payload.speakerid
                }
            }
            return await this.mongoUpdate(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        } 
    }

    //update speaker name 
    async updateSpeakerName(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid), 
                "speakers.speaker_id": payload.speakerid
            }
            let mutableElements = {
                "speakers.$.speaker_name": payload.speakername
            }
            return await this.mongoUpdate(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new ConvoModel()