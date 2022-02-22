const MongoModel = require(`${process.cwd()}/models/mongodb/model`)
const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversations')


class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    // Create conversation
    async createConversation(conversation) {
        try {
            return await this.mongoInsert(conversation)
        } catch (error) {
            console.error(error)
            return error
        }
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

    //update conversation metadata -- title, description, metadata
    async updateMetaData(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid),
            }
            let mutableElements = {}
            if (!!payload.name) {
                mutableElements["name"] = payload.name
            } else if (!!payload.agenda) {
                mutableElements["agenda"] = payload.agenda
            } else if (!!payload.description) {
                mutableElements["description"] = payload.description
            } else {
                mutableElements["conversationType"] = payload.convoType
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    //update conversation speakermap
    async updateSpeakerMap(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid),
            }
            let mutableElements = {}
            mutableElements["speakers"] = payload.newspeakermap

            console.log(mutableElements)
            return await this.mongoUpdateOne(query, operator, mutableElements)
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
            const projection = { owner: 1, sharedWith: 1 }
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
                    etime: payload.etime,
                    stime: payload.stime
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
                "text.$[elem].speaker_id": payload.replaceby
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
    async updateSpeakerAudio(payload) { //WIP
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
        //The position is given by the function that calls createTurn (eg.splitTurn), it is never called by itself--KT

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
        console.log('Delete model', payload)
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

    //updates all text turns in a conversation -- used in renumberTurns
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

    async getTurnAudioTime(payload) {
        //returns the absolute start and end time for a single turn
        try {

            const match1 = { "$match": { _id: this.getObjectId(payload.convoid) } }

            const unwind1 = { "$unwind": "$text" }
            const unwind2 = { "$unwind": "$text.words" }
            const match2 = { "$match": { "text.turn_id": payload.turnid } }
            const group = {
                "$group": {
                    _id: null,
                    max: {
                        "$max": "$text.words.etime"
                    },
                    min: {
                        "$min": "$text.words.stime"
                    }
                }
            }

            const query = [match1, unwind1, unwind2, match2, group]

            return await this.mongoAggregate(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getSpeakerAudio(payload) {
        //takes a conversation id and returns each speaker id and the audio times from that 
        //speaker's first turn 
        try {
            const match = { "$match": { _id: this.getObjectId(payload) } }
            const unwind = { "$unwind": "$text" }
            const group = {
                "$group": {
                    _id: "$text.speaker_id",
                    turn: { "$min": "$text.pos" },
                    stimes: {
                        "$min": "$text.words.stime"
                    },
                    etimes: {
                        "$min": "$text.words.etime"
                    }
                }
            }
            const project = {
                "$project": {
                    _id: 1,
                    turn: 1,
                    stime: { "$min": "$stimes" },
                    etime: { "$max": "$etimes" }
                }
            }
            const query = [match, unwind, group, project]
            return await this.mongoAggregate(query)
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

    // async getWords(payload) { //WIP
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
    //}

    // async getAllWords(payload) { //WIP
    //     try {
    //         const query = {
    //             _id: this.getObjectId(payload.convoid),
    //             "text.turn_id": payload.turnid
    //         }
    //         const projection = { _id: 0, "text.$.words": 1 }
    //         return await this.mongoRequest(query, projection)
    //     } catch (error) {
    //         console.error(error)
    //         return error
    //     }
    // }

    // //delete words in a conversation
    // async deleteWords(payload) { //WIP!!!
    //     //takes a convo id, turnid and an array of word ids
    //     try {
    //         const operator = "$pull"
    //         const query = {
    //             _id: this.getObjectId(payload.convoid)
    //         }
    //         let mutableElements = {
    //             "text.$[turnelem].words": {
    //                 wid: { "$in": payload.wordids }
    //             }
    //         }
    //         let arrayFilters = {
    //             "arrayFilters": [{ "turnelem.turn_id": payload.turnid }]
    //         }
    //         return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
    //     } catch (error) {
    //         console.error(error)
    //         return error
    //     }
    // }

    // // create a new word in a turn
    // async createWords(payload) { //WIP!!!
    //     //takes a convo id, turn id and an array of word objects
    //     try {
    //         const operator = "$addToSet"
    //         const query = {
    //             _id: this.getObjectId(payload.convoid)
    //         }
    //         let mutableElements = {
    //             "text.$[turnelem].words": payload.words
    //         }
    //         let arrayFilters = {
    //             "arrayFilters": [{ "turnelem.turn_id": payload.turnid }]
    //         }
    //         return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
    //     } catch (error) {
    //         console.error(error)
    //         return error
    //     }
    // }

    async getHighlightWordids(payload) {
        //returns a list of wordids associated with a highlight id
        try {

            const match1 = { "$match": { _id: this.getObjectId(payload.convoid) } }

            const unwind1 = { "$unwind": "$text" }
            const unwind2 = { "$unwind": "$text.words" }

            const match2 = { "$match": { "text.words.highlights": payload.hid } }
            const group = {
                "$group": {
                    _id: null,
                    wids: {
                        "$push": "$text.words.wid"
                    }
                }
            }

            const query = [match1, unwind1, unwind2, match2, group]

            return await this.mongoAggregate(query)

        } catch (error) {
            console.error(error)
            return error
        }
    }

    async highlightWords(payload) {
        //takes a convo id, highlight id, an array of wids, push/pull keyword
        //adds/removes highlight id to each word 
        try {
            let operator = null
            if (payload.operator === "add") {
                operator = "$push"
            } else {
                operator = "$pull"
            }

            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "text.$[].words.$[wordelem].highlights": payload.hid
            }

            let arrayFilters = {}
            let identifiers = []
            payload.wordids.forEach(elem => {
                identifiers.push({ "wordelem.wid": elem })
            })
            let innerfilter = {}
            innerfilter["$or"] = identifiers
            arrayFilters["arrayFilters"] = [innerfilter]

            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)

        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getHighlightTypes(payload) {
        //takes convo id and returns information from the Highlights field

        try {
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            const projection = { highlights: 1 }
            return await this.mongoRequest(query, projection)

        } catch (error) {
            console.error(error)
            return error
        }
    }

    async addHighlightType(payload) {
        //takes convo id and adds a new highlight to the Highlights field 
        try {
            const operator = "$addToSet"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "highlights": {
                    hid: payload.hid,
                    label: payload.label,
                    color: payload.color
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }

    }

    async modifyHighlightType(payload) {
        //takes convo id and hid and changes label and/or color associated with the hid
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid),
                "highlights.hid": payload.hid
            }
            let mutableElements = {}
            if (!!payload.label) {
                mutableElements["highlights.$.label"] = payload.label
            }
            if (!!payload.color) {
                mutableElements["highlights.$.color"] = payload.color
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)

        } catch (error) {
            console.error(error)
            return error
        }
    }

    async deleteHighlightField(payload) {
        try {
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "highlights": {
                    hid: payload.hid
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // async deleteHighlightWords(payload) { //WIP
    //     try {
    //         const operator = "$pull"
    //         const query = {
    //             _id: this.getObjectId(payload.convoid)
    //         }
    //         let mutableElements = {
    //             "text.$[].words.$[wordelem].highlights": payload.hid
    //         }
    //         return await this.mongoUpdateOne(query, operator, mutableElements)
    //     } catch (error) {
    //         console.error(error)
    //         return error
    //     }
    // }


    // async updateAllText(payload) {
    //     try {
    //         const operator = "$set"
    //         const query = {
    //             _id: this.getObjectId(payload.convoid)
    //         }
    //         let newText = payload.text
    //         newText.map(turn => {
    //             if (turn.words.length > 0) {
    //                 turn.words.map(word => {
    //                     if (word.wid === 'todefine') {
    //                         word.wid = this.createObjectId()
    //                     }
    //                 })
    //             }
    //         })
    //         let mutableElements = {
    //             "text": newText
    //         }
    //         return await this.mongoUpdateOne(query, operator, mutableElements)
    //     } catch (error) {
    //         console.error(error)
    //         return error
    //     }
    // }


    // delete a user
    async deleteConversationById(id) {
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

    // SHARE WITH (conversation)
    async addShareWith(payload) {
        try {
            const operator = "$addToSet"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "sharedWith": {
                    "$each": payload.sharewith
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async removeShareWith(payload) {
        try {
            const operator = "$pull"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "sharedWith": {
                    user_id: payload.userid
                }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }
    async updateShareWith(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload.convoid)
            }
            let mutableElements = {
                "sharedWith.$[elem]": {
                    user_id: payload.userid,
                    rights: payload.rights
                }
            }
            let arrayFilters = {
                "arrayFilters": [{ "elem.user_id": payload.userid }]
            }
            return await this.mongoUpdateOne(query, operator, mutableElements, arrayFilters)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    async update(payload) {
        try {
            const query = {
                _id: payload._id
            }
            delete payload._id
            let mutableElements = payload
            return await this.mongoUpdate(query, mutableElements)
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

    async renumberTurns(convoid) {
        try {
            let allTurns = await this.getAllTurns(convoid)
            if (allTurns.length > 0) {
                const turns = allTurns[0].text.sort((a, b) => a.pos - b.pos)
                let position = 0
                turns.forEach((elem => {
                    elem.pos = position
                    position++
                }))
                let new_payload = {
                    convoid: convoid,
                    turns: turns
                }
                return await this.replaceText(new_payload)
            } else {
                throw { message: 'couldn\'t retrieve turns' }
            }
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new ConvoModel()