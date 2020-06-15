const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const { v4: uuidv4 } = require('uuid')

// create a conversation base 
// TODO: check user id
async function createConvoBase(req, res, next) {
    try{
        const payload = req.body
        // const name = payload.name
        //payload.ownerId = req.session.userid
        const createBase = await convoModel.createConvoBase(payload)
        if (createBase != undefined) {
            res.json({
                status: 'success',
                msg: 'convo has been created'
            })
            //update the user as the convo owner w createBase convo id
            newPayload = {
                userId: payload.ownerId,
                convoId: createBase,
                userRights: 'owner'
            }
            const userUpdate = await userModel.updateUserAccess(newPayload)
            if (userUpdate != undefined) {
                console.error({ //debug!!!
                    status: 'success', 
                    msg: 'convo added to user'
                })
            } else {
                throw ({
                    status: 'error',
                    msg: 'convo not added to user',
                })
            }
        } else {
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function getSpeakers(req, res, next){ //WIP
    try {
        if (req.params.conversationid != "undefined") {
            const convoId = req.params.conversationid
            let response = await convoModel.getConvoSpeakers(convoId)
            if (response && response.length) {
                res.json({
                    status: response[0]
                })
            } else {
                res.json({
                    msg: "convo id doesn't exist"
                })
            }
        } else {
            res.status(400) // bad request
        } 
    } catch(error) {
        console.error(error)
    }
}

async function identifySpeaker(req, res, next){ //WIP
    try{
        const payload = req.body
        let response = await convoModel.updateSpeakerName(payload)
        if (response.result['ok'] === 1) {
            res.json({
                status: "200", 
                msg: "success!"
            })
        } else {
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function identifyTurnSpeaker(req, res, next){ //WIP
    try{
        const payload = req.body
        let response = await convoModel.updateTurnSpeakerId(payload)
        if (response.result['ok'] === 1) {
            res.json({
                status: "200", 
                msg: "success!"
            })
        } else {
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function createNewSpeaker(req, res, next){
    try{
        const payload = req.body
        const speakerid = uuidv4()
        payload.speakerid = speakerid
        let response = await convoModel.createSpeaker(payload)
        if (response.result['ok'] === 1) {
            res.json({
                status: "200", 
                msg: "success!"
            })
        } else {
            res.json({
                msg: "update unsuccessful"
            })
        }
    } catch(error) {
        console.error(error)   
    }
}

async function createNewTurnSpeaker(req, res, next){ 
    try{
        const payload = req.body
        const speakerid = uuidv4()
        payload.speakerid = speakerid
        let response = await convoModel.createSpeaker(payload)
        if (response.result['ok'] === 1) {
            let response = await convoModel.updateTurnSpeakerId(payload)
            if (response.result['ok'] === 1) {
                res.json({
                    status: '200', 
                    msg: 'success!'
                })
            } else {
                res.json({
                    status: 'error',
                    msg: 'update unsuccessful'
                })
            }
        } else {
            res.json({
                status: 'error', 
                msg: "speaker creation unsuccessful"
            })
        }
    } catch(error) {
        console.error(error)   
    }
}

async function deleteSpeaker(req, res, next){
    //checks that a speaker id is not used in any turn before
    //deleting speaker from speakers
    // how to force a 428 status?
    try{
        const payload = req.body
        let check = await convoModel.checkSpeakerId(payload)
        if(check.length > 0){
            const turn = check[0]['text'][0]['turn_id']
            console.log(`speaker found in turn ${turn}`)
            res.json({
                turn_number: turn,
                status: '428',
                msg: `speaker found in ${turn}`
            })
        } else {
            let response = await convoModel.deleteSpeaker(payload)
            res.json({
                status: response
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function updateSpeakerAudio(req, res, next){
    try{
        const payload = req.body
        let response = await convoModel.updateSpeakerAudio(payload)
        if (response.result['ok'] === 1) {
            res.json({
                status: "200", 
                msg: "success!"
            })
        } else {
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function combineSpeakerIds(req, res, next){
    try{
        const payload = req.body
        let response = await convoModel.changeSpeakerIds(payload)
        if (response.result['ok'] === 1) {
            console.log(response.result)
            //delete speaker from speakers
            let deletespeaker = await convoModel.deleteSpeaker(payload)
            res.json({
                status: deletespeaker
            })
            //need to update startime and endtime on new speaker
        } else {
            res.json({
                msg: "update unsuccessful"
            })
        }

    } catch(error) {
        console.error(error)
    }
}

async function createTurn(req, res, next){
    try{
        const payload = req.body
        const turnid = uuidv4()
        payload.turnid = turnid
        console.log(payload)
        let response = await convoModel.createTurn(payload)
        if (response.result['ok'] === 1) {
            console.log(response.result)
            res.json({
                status: '200', 
                msg: 'success!'
            })
        } else {
            res.json({
                msg: "turn creation unsuccessful"
            })
        }
    } catch(error) {
        console.error(error)
    }
}


async function deleteTurns(req, res, next){
    try{
        const payload = req.body
        let response = await convoModel.deleteTurns(payload)
        if (response.result['ok'] === 1) {
            console.log(response.result)
            res.json({
                status: '200', 
                msg: 'success!'
            })
        } else {
            res.json({
                msg: "turn deletion unsuccessful"
            })
        }
    } catch(error) {
        console.error(error)
    }
}

async function mergeTurns(req, res, next){ 
    //takes a convo id and list of turn ids and optionally a speaker id
    try{
        const payload = req.body
        console.log(payload)
        let response = await convoModel.getTurns(payload)
        if (response !== "undefined") {
            turns = response[0]["text"].sort((a,b) => a.pos - b.pos)
            //check all turns are same speaker or speaker id given and turns consecutive
            const samespeaker = arr => arr.every(v => v['speaker_id'] === arr[0]['speaker_id'])
            const consecutive = arr => arr.every((elem, i) => i === arr.length -1 || elem.pos < arr[i+1].pos)
            if ((samespeaker(turns)|| payload.hasOwnProperty('speakerid')) && consecutive(turns)) {
                //concat all words under all turns
                new_words = []
                position = 0
                for (let t of turns){
                    words = t.words.sort((a,b) => a.pos - b.pos)
                    for(let w of words){
                        w.pos = position
                        new_words.push(w)
                        position ++
                    }
                }
                //replace first turn's words with concat set
                first_turn = turns[0].turn_id
                new_payload = {}
                new_payload.convoid = payload.convoid
                new_payload.turnid = first_turn
                new_payload.text = new_words
                try{
                    let response = await convoModel.replaceTurnText(new_payload)
                    if (response.result['ok'] === 1) {
                        //if speakerid defined, then replace speaker id
                        if (payload.hasOwnProperty('speakerid')){
                            new_payload.speakerid = payload.speakerid
                            let response = await convoModel.updateTurnSpeakerId(new_payload)
                            if (response.result['ok'] !== 1) {
                                console.error("couldn't replace speaker name")
                                //then the speaker of the merged turn would just be the 
                                //speaker of the first turn
                            } 
                        } 
                        //delete remaining turns
                        turns.shift()
                        turn_list = turns.map(elem => elem.turn_id)
                        delete_payload = {}
                        delete_payload.convoid = payload.convoid
                        delete_payload.turnids = turn_list
                        let response = await convoModel.deleteTurns(delete_payload)
                        if (response.result['ok'] === 1){
                            res.json({
                                status: '200', 
                                msg: 'success!'
                            })
                        } else {
                            res.json({
                                msg: "turn deletion unsuccessful"
                            })
                        }
                    } else {
                        res.json({
                            msg: "replace turn text unsuccessful"
                        })
                    }
                } catch(error) {
                    console.error(error)
                }
            } else {
                res.json({
                    msg: "speakers not same or turns not consecutive"
                })
            }
        } else {
            res.json({
                msg: "convo id doesn't exist"
            })
        }
    } catch(error){
        console.error(error)
    }
}

async function splitTurns(req, res, next){ //WIP
    //TODO: change structure to relfect responses
    // takes a pair of turn positions and a pair of word ids and a speaker id
    try{
        const payload = req.body
        //!!!!check how many turns and then expand payload 
        // get all turns implicated in one request
        let response = await convoModel.getTurns(payload)
        if (response !== "undefined") {
            turns = response[0].text.sort((a,b) => a.pos - b.pos)
            start_words = turns[0].words.sort((a,b) => a.pos - b.pos)
            end_words = turns[turns.length -1].words.sort((a,b) => a.pos - b.pos)
            last_pos = end_words[end_words.length-1].pos

            //get starting word position
            let start_word = start_words.filter(obj => {
                return obj.wid === payload.wordids[0]
              })
            const start_pos = start_word[0].pos

            //and ending word position
            let end_word = end_words.filter(obj => {
                return obj.wid === payload.wordids[1]
              })
            const end_pos = end_word[0].pos
            
            console.log(start_pos)
            console.log(end_pos)
            console.log(last_pos)

            //case 1: start_pos == 0 and end_pos == last_pos
            //case 2: start_pos != 0 and end_pos != last_pos
            //case 3: start_pos == 0 and end_pos != last_pos
            //case 4: start_pos != 0 and end_pos == last_pos
            
            //case 1
            if (start_pos === 0 && end_pos === last_pos){
                if (turns.length == 1){
                    res.json({
                        msg: "turn already exists"
                    })
                } else {
                    //this is just a simple merge of 2 or more turns
                    let response = await convoModel.mergeTurns(payload)
                    if (response.result['ok'] === 1) {
                        res.json({
                            msg: "turns merged"
                        })
                    } else {
                        res.json({
                            msg: "couldn't merge turns"
                        })
                    }
                }
            //cases 2/3/4
            } else {
                const until_word = (arr, pos) => arr.every((elem) => elem.pos < pos)
                const from_word = (arr, pos) => arr.every((elem) => elem.pos >= pos)
                if (start_pos !== 0){
                    let turnid = uuidv4()
                    new_payload = {
                        convoid: payload.convoid, 
                        speakerid: turns[0].speaker_id, 
                        turnid: turnid, 
                        pos: turns[0].pos, 
                        words: until_word(start_words, start_pos)
                    }
                    let response = await convoModel.createTurn(new_payload)
                    if (response.result['ok'] === 1) {
                        //then do middle turn
                        new_words = []
                        position = 0
                        for (w in from_word(start_words, start_pos)){
                            w.pos == position 
                            new_words.push(w)
                            position ++
                        }
                        //then concat until pentultimate word 
                        middle_turns = turns.slice(1,-1)
                        if (middle_turns.length > 0){
                            for (let t of _middle_turns){
                                words = t.words.sort((a,b) => a.pos - b.pos)
                                for(let w of words){
                                    w.pos = position
                                    new_words.push(w)
                                    position ++
                                }
                            }
                        } else {
                            //then check last word status 
                            if (end_pos !== last_pos){
                                //add just the words up to last word
                                for (w in until_word(end_words, end_pos)){
                                    w.pos = position
                                    new_words.push(w)
                                    position ++
                                }
                                // deal with last turn!
                                let turnid = uuidv4()
                                new_payload = {
                                    convoid: payload.convoid, 
                                    speakerid: turns[turns.length-1].speaker_id, 
                                    turnid: turnid, 
                                    pos: turns[turns.length -1].pos, 
                                    words: from_word(end_words, end_pos)
                                }
                                let response = await convoModel.createTurn(new_payload)
                                if (response.result['ok'] === 1) {
                                    console.log("turn creation successful")
                                } else {
                                    console.error("nope")
                                }

                            } else {
                                //selection goes all the way to the end 
                                for (w in end_words){
                                    w.pos = position
                                    new_words.push(w)
                                    position ++
                                }
                            }
                        }
                        //create middle turn
                        let turnid = uuidv4()
                        new_payload = {
                            convoid: payload.convoid, 
                            speakerid: payload.speaker_id, 
                            turnid: turnid, 
                            pos: turns[0].pos + .5, 
                            words: new_words
                        }
                        let response = await convoModel.createTurn(new_payload)
                        if (response.result['ok'] === 1) {
                            console.log("turn creation successful")
                        } else {
                            console.error("nope")
                        }
                           
                    } else {
                        console.error("nope")
                    }

                } else {
                    //start pos does equal 0 so pull all turns until end pos
                    //for every turn in the list except the last add to a new words field
                }
                //don't forget to delete all turns!
            }
            
        } else {
            res.json({
                msg: "couldn't get turns"
            })
        }
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    createConvoBase, 
    getSpeakers, 
    identifySpeaker, 
    identifyTurnSpeaker,
    createNewSpeaker,
    createNewTurnSpeaker,
    deleteSpeaker,
    updateSpeakerAudio,
    combineSpeakerIds, 
    createTurn, 
    deleteTurns, 
    mergeTurns, 
    splitTurns
}