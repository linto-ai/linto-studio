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
    //takes a convo id and list of turn ids
    try{
        const payload = req.body
        let response = await convoModel.getTurns(payload)
        if (response !== "undefined") {
            //check all turns are same speaker and consecutive
            turns = response[0]["text"].sort((a,b) => a.pos - b.pos)
            const samespeaker = arr => arr.every(v => v['speaker_id'] === arr[0]['speaker_id'])
            const consecutive = arr => arr.every((elem, i) => i === arr.length -1 || elem.pos < arr[i+1].pos)
            if (samespeaker(turns) && consecutive(turns)) {
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
    // takes a pair ((turn_id_1, word_id_1), (turn_id_2, word_id_2)) and a speaker id
    try{
        //first check if turn_id_1 === turn_id_2
        //then check how many different turns are implicated
        //if n > 2 then...

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
    combineSpeakerIds, 
    createTurn, 
    deleteTurns, 
    mergeTurns, 
    splitTurns
}