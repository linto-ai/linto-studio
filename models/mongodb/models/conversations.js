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
            const projection = {}
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
            const projection = { speakers: 1 }
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
    async checkSpeakerId(payload) {
        try {
            const query = {
                _id: this.getObjectId(payload.convoid),
                "text.speaker_id": payload.speakerid
            }
            const projection = { _id: 0, "text.$": 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //change all instances of a speaker id in transcript
    async changeSpeakerIds(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[elem].speaker_id": payload.newspeakerid
            }
            let arrayFilters = {
                "arrayFilters": [{ "elem.speaker_id": payload.speakerid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //deletes a speaker from speakermap 
    async deleteSpeaker(payload) {
        try {
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
                "identifyTurnSpeakerspeakers.$.stime": payload.stime
            }
            const test = await this.mongoUpdateOne(query, operator, mutableElements)
            console.log('>', test)
            return test
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
                "arrayFilters": [{ "elem.turn_id": payload.turnid }]
            }
            console.log(query, operator, mutableElements, arrayFilters)
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
        //Romlop: We don't use the "position", shouldn't we ?

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
        try {
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text": {
                    turn_id: { "$in": payload.turnids }
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //updates turn text after merging with other turns
    async replaceTurnText(payload) {
        //takes a convoid and a turn id and an array of word objects
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[elem].words": payload.text,
                "text.$[elem].speaker_id": payload.speakerid,
            }
            let arrayFilters = {
                "arrayFilters": [{ "elem.turn_id": payload.turnid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    //updates all text turns
    async replaceText(payload) {
        //takes a convoid and an entire text object 
        try {
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

    //updates all words for a turn
    async replaceWords(payload) {
        //takes a convoid, turnid and an entire words object 
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[turnelem].words": payload.words
            }
            let arrayFilters = {
                "arrayFilters": [{ "turnelem.turn_id": payload.turnid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getTurns(payload) {
        //returns list of turns from a single conversation with either turn ids or turn positions specified in payload
        try {
            const project = {
                "$project": {
                    "text": {
                        "$filter": {
                            input: "$text",
                            as: "turn",
                            cond: payload.hasOwnProperty('turnids') ? { "$in": ["$$turn.turn_id", payload.turnids] } : { "$in": ["$$turn.pos", payload.positions] }
                        }
                    }
                }
            }
            const match = { "$match": { _id: this.getObjectId(payload.convoid) } }
            const query = [match, project]
            return await this.mongoAggregate(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getAllTurns(convoid) {
        try {
            const query = {
                _id: this.getObjectId(convoid)
            }
            const projection = {
                text: 1
            }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getWords(payload) { //WIP
        // //returns list of words from a single conversation/turn/array of wordids
        // try{
        //     const project = {"$project": {
        //         "words": {
        //             "$filter": {
        //                 input: "$words", 
        //                 as: "word", 
        //                 cond: {"$and": [
        //                     {"$eq": ["$$turn.turn_id", payload.turnid]}, 
        //                     {"$in": ["$$turn.words.wid", payload.wordids]}
        //                 ]}
        //             }
        //         }
        //     }}
        //     const match = {
        //         "$match": {_id: this.getObjectId(payload.convoid)}, 
        //     }
        //     const unwind= {
        //         "$unwind": {"$convo.text"}
        //     }

        //     { $unwind: '$list'},
        //     { $match: {'list.a': {$gt: 3}}},
        //     { $group: {_id: '$_id', list: {$push: '$list.a'}}}
        //     const query = [match, project]
        //     console.log(query)
        //     return await this.mongoAggregate(query)
        // } catch (error){
        //     console.error(error)
        //     return error
        // }
    }

    async getAllWords(payload) { //WIP
        try {
            const query = {
                _id: this.getObjectId(payload.convoid),
                "text.turn_id": payload.turnid
            }
            const projection = { _id: 0, "text.$.words": 1 }
            return await this.mongoRequest(query, projection)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //delete words in a conversation
    async deleteWords(payload) { //WIP!!!
        //takes a convo id, turnid and an array of word ids
        try {
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[turnelem].words": {
                    wid: { "$in": payload.wordids }
                }
            }
            let arrayFilters = {
                "arrayFilters": [{ "turnelem.turn_id": payload.turnid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // create a new word in a turn
    async createWords(payload) { //WIP!!!
        //takes a convo id, turn id and an array of word objects
        try {
            const operator = "$addToSet"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[turnelem].words": payload.words
            }
            let arrayFilters = {
                "arrayFilters": [{ "turnelem.turn_id": payload.turnid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateAllText(payload) {
        try {
            console.log('conversation FOUND')
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let newText = payload.text
            newText.map(turn => {
                if (turn.words.length > 0) {
                    turn.words.map(word => {
                        if (word.wid === 'todefine') {
                            word.wid = this.createObjectId()
                        }
                    })
                }
            })
            let mutableElements = {
                "text": newText
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }


}

module.exports = new ConvoModel()