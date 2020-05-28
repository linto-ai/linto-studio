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

async function mergeTurns(req, res, next){ //WIP
    //takes a list of turn ids
    //check that all speaker ids are the same
    //order by pos then concat all text from later turns to turn in first position
    //appendTurnText
    //re-index word pos
    //delete later turns deleteTurns
    try{
        //const payload = req.body
    } catch(error){
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
    mergeTurns
}