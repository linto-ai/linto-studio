const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const { v4: uuidv4 } = require('uuid')
const clone = require('rfdc')()


async function createConvoBase(req, res, next) {//WIP TODO check userid
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

async function renumberTurns(req, res, next){
    try{
        const payload = req.body
        let response = await convoModel.getAllTurns(payload.convoid)
        if (response.length > 0){
            const turns = response[0].text.sort((a,b) => a.pos - b.pos)
            position = 0
            turns.forEach((elem => {
                elem.pos = position
                position ++
            }))
            new_payload = {
                convoid: payload.convoid, 
                turns: turns
            }
            let newtext = await convoModel.replaceText(new_payload)
            if (newtext.result['ok'] === 1){
                res.json({
                    status: '200', 
                    msg: 'success!'
                })
            } else {
                res.json({
                    msg: "couldn't replace turns"
                })
            }
        } else {
            res.json({
                msg: "couldn't retrieve turns"
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
        let response = await convoModel.createTurn(payload)
        if (response.result['ok'] === 1) {
            console.log("turn creation success")
            next() //re-order turns
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
            console.log("turn deletion success")
            next() //reorder turns
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
                turns.forEach(turn => {
                    words = turn.words.sort((a,b) => a.pos - b.pos)
                    words.forEach(w => {
                        w.pos = position
                        new_words.push(w)
                        position ++
                    } )
                })
                //replace first turn's words with concat set
                first_turn = turns[0].turn_id
                new_payload = {
                    convoid: payload.convoid, 
                    turnid: first_turn, 
                    text: new_words
                }
                
                let response = await convoModel.replaceTurnText(new_payload)
                if (response.result['ok'] === 1) {
                    //if speakerid defined, then replace speaker id
                    if (payload.hasOwnProperty('speakerid')){
                        new_payload.speakerid = payload.speakerid
                        let response = await convoModel.updateTurnSpeakerId(new_payload)
                        if (response.result['ok'] !== 1) {
                            console.error("couldn't replace speaker name")
                            //in this case speaker of the merged turn will just be the 
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
                        console.log("merge success")
                        next() //re-order text 
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
    // takes 1 or 2 turn positions, a pair of word ids and a speaker id
    try{
        const payload = req.body
        //check how many turns and then expand payload positions if needed
        words = payload.wordids
        nums = payload.positions
        if(nums.length > 1){
            payload.positions = [...Array(nums[1] + 1).keys()].slice(nums[0])
        }
        // get all turns
        let response = await convoModel.getTurns(payload)
        if (response !== "undefined") {
            turns = response[0].text.sort((a,b) => a.pos - b.pos)
            start_words = turns[0].words.sort((a,b) => a.pos - b.pos)
            if(nums.length == 1){
                end_words = start_words
            } else {
                end_words = turns[turns.length -1].words.sort((a,b) => a.pos - b.pos)
            }
            
            last_pos = end_words[end_words.length-1].pos

            //get starting word position
            start_word = start_words.filter(obj => {
                return obj.wid === payload.wordids[0]
              })
            const start_pos = start_word[0].pos

            //get ending word position
            if (words.length > 1){
                end_word = end_words.filter(obj => {
                    return obj.wid === payload.wordids[1]
                })
            } else {
               end_word = start_word   
            }

            const end_pos = end_word[0].pos
            
            //case 1: check that user selection is not coextensive with just one turn
            if (start_pos === 0 && end_pos === last_pos && nums.length == 1){
                res.json({
                    msg: "selected turn already exists"
                })
            //case 1: start_pos == 0 and end_pos == last_pos
            //case 2: start_pos != 0 and end_pos != last_pos
            //case 3: start_pos == 0 and end_pos != last_pos
            //case 4: start_pos != 0 and end_pos == last_pos
            } else {
                const until_word = (arr, pos) => arr.filter((elem) => elem.pos <= pos)
                const from_word = (arr, pos) => arr.filter((elem) => elem.pos >= pos)
                const extract_words = (arr, start, end) => arr.filter((elem) => elem.pos >= start && elem.pos <= end)
                if (start_pos !== 0){ // handle first turn cases 2 or 4
                    let turnid = uuidv4()
                    new_payload = {
                        convoid: payload.convoid, 
                        speakerid: turns[0].speaker_id, 
                        turnid: turnid, 
                        pos: turns[0].pos, 
                        words: until_word(start_words, start_pos-1)
                    }
                    let response = await convoModel.createTurn(new_payload)
                    if (response.result['ok'] === 1) {
                        console.log("turn creation successful")
                    } else {
                        res.json({
                            status: '400',
                            msg: "turn creation unsuccessful"
                        })
                    }
                }
                if (end_pos != last_pos){ // handle last turn case 2 or 3
                    new_end_words = clone(end_words)
                    end_turn_words = from_word(new_end_words, end_pos + 1)
                    position = 0
                    end_turn_words.forEach(elem => {
                        elem.pos = position
                        position ++
                    })
                    let turnid = uuidv4()
                    new_payload = {
                        convoid: payload.convoid, 
                        speakerid: turns[turns.length-1].speaker_id, 
                        turnid: turnid, 
                        pos: turns[turns.length -1].pos + .75, 
                        words: end_turn_words
                    }
                    let response = await convoModel.createTurn(new_payload)
                    if (response.result['ok'] === 1) {
                        console.log("turn creation successful")
                    } else {
                        res.json({
                            status: '400',
                            msg: "turn creation unsuccessful"
                        })
                    }
                }
                //handle selected text for turn
                new_words = []
                position = 0

                if(nums.length == 1){ //for single turn selections
                    extract_words(start_words, start_pos, end_pos).forEach(elem => {
                        elem.pos = position
                        new_words.push(elem)
                        position ++
                    })

                } else { 
                    // handle start
                    if (start_pos != 0){ //case 2 or 4
                        from_word(start_words, start_pos).forEach((elem => {
                            elem.pos = position
                            new_words.push(elem)
                            position ++
                        }))
                    } else { // case 1 or 3
                        start_words.forEach(elem => {
                            elem.pos = position
                            new_words.push(elem)
                            position ++
                        })
                    }    

                    //handle "middle turns" if any     
                    middle_turns = turns.slice(1,-1)
              
                    middle_turns.forEach(turn => {
                        words = turn.words.sort((a,b) => a.pos - b.pos)
                        words.forEach(w => {
                            w.pos = position
                            new_words.push(w)
                            position ++
                        } )
                    })

                    // handle end 
                    if (end_pos !== last_pos){ // case 2 or 3
                        until_word(end_words, end_pos).forEach(elem => {
                            elem.pos = position
                            new_words.push(elem)
                            position ++
                        })
                    } else { // case 1 or 4
                        end_words.forEach(elem => {
                            elem.pos = position
                            new_words.push(elem)
                            position ++
                        })
                    }
                }    
                // create new selected turn     
                let turnid = uuidv4()
                new_payload = {
                    convoid: payload.convoid, 
                    speakerid: payload.speakerid, 
                    turnid: turnid, 
                    pos: turns[0].pos + .5, //until reordered
                    words: new_words
                }
                let response = await convoModel.createTurn(new_payload)
                if (response.result['ok'] === 1) {
                    //now delete original turns
                    delete_payload = {
                        convoid: payload.convoid, 
                        turnids: turns.map(a => a.turn_id)
                    }
                    let response = await convoModel.deleteTurns(delete_payload)
                    if (response.result['ok'] === 1){
                        console.log("turn split success")
                        next() //reorder turns
                    } else {
                        res.json({
                            status: '400',
                            msg: "turn deletion unsuccessful"
                        })
                    }
                } else {
                    res.json({
                        status: '400', 
                        msg: 'could not make turn'
                    })
                }
            }
        } else {
            res.json({
                msg: "couldn't retrieve turns"
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
    splitTurns, 
    renumberTurns
}