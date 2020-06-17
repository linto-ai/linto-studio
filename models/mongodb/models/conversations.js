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

    // create a new speaker in a conversation
    async createSpeaker(payload) {
         //need to make sure it's not the same as a current speaker name -- is this back 
         //or front end function?
         //what about automatically updating speaker audio sample?
         //what about automatically warning if speaker doesn't speak?
         
        try {
            const operator = "$addToSet"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "speakers": {
                speaker_id: payload.speakerid,
                speaker_name: payload.speakername,
                etime: "", 
                stime: ""
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
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

    //change all instances of a speaker id in transcript
    async changeSpeakerIds(payload){
        try{
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[elem].speaker_id": payload.newspeakerid
            }
            let arrayFilters = {
                "arrayFilters" : [{"elem.speaker_id": payload.speakerid}]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
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
            return await this.mongoUpdateOne(query, operator, mutableElements)
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
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //update speaker audio
    async updateSpeakerAudio(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid), 
                "speakers.speaker_id": payload.speakerid
            }
            let mutableElements = {
                "speakers.$.etime": payload.etime, 
                "speakers.$.stime": payload.stime
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //update speaker id for a particular turn
    async updateTurnSpeakerId(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid), 
            }
            let mutableElements = {
                "text.$[elem].speaker_id": payload.speakerid
            }
            let arrayFilters = {
                "arrayFilters" : [{"elem.turn_id": payload.turnid}]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //give name to unidentified speaker for a particular turn
    async updateTurnSpeakerName(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid), 
                "speakers.speaker_id": payload.speakerid
            }
            let mutableElements = {
                "speakers.$.speaker_name": payload.speakername
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // create a new turn in a conversation
    async createTurn(payload) {
        //takes a convo id and a speaker_id and a position and text (optionally)
        
       try {
           const operator = "$addToSet"
           const query = {
               _id: this.getObjectId(payload.convoid)
           }
           let mutableElements = {
               "text": {
               speaker_id: payload.speakerid,
               turn_id: payload.turnid,
               pos: payload.pos, 
               words: payload.words
               }
           }
           return await this.mongoUpdateOne(query, operator, mutableElements)
       } catch (error) {
           console.error(error)
           return error
       }
    }
   
   //delete turn in a conversation
   async deleteTurns(payload) {
    //takes a convo id and a *list* of turn_ids
        try{
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text": {
                    turn_id: {"$in": payload.turnids}
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //updates turn text after merging with other turns
    async replaceTurnText(payload){
        //takes a convoid and a turn id and an array of word objects
        try{
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[elem].words": payload.text
            }
            let arrayFilters = {
                "arrayFilters" : [{"elem.turn_id": payload.turnid}]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    //updates all text turns
    async replaceText(payload){
        //takes a convoid and an entire text object 
        try{
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text": payload.turns
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getTurns(payload){ 
        //returns list of turns from a single conversation with either turn ids or turn positions specified in payload
        try{
            console.log(payload)
            const project = {"$project": {
                "text": {
                    "$filter": {
                        input: "$text", 
                        as: "turn", 
                        cond: payload.hasOwnProperty('turnids') 
                        ? {"$in": ["$$turn.turn_id", payload.turnids]} 
                        : {"$in": ["$$turn.pos", payload.positions]}
                    }
                }
            }}
            const match = {"$match": {_id: this.getObjectId(payload.convoid)}}
            const query = [match, project]
            return await this.mongoAggregate(query)
        } catch (error){
            console.error(error)
            return error
        }
    }

    async getAllTurns(convoid){
        try {
            const query = {
                _id: this.getObjectId(convoid)
            }
            const projection = {
                text: 1
            }
            return await this.mongoRequest(query, projection)
        } catch(error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new ConvoModel()