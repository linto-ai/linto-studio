const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')
    /*
    async function demo (req,res,next) {
      try {
        if (!!req.body.NEEDED_VALUE) { 

        } else {
          throw { message: 'Missing information in the payload object' }

        }
      } catch (error) {
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on creating speaker'
        })

      }
    }*/

async function getSpeakers(req, res, next) { //pulls speaker map for a conversation
    try {
        const convoId = req.params.conversationid
        let speakers = await convoModel.getConvoSpeakers(convoId)
        if (speakers && speakers.length) {
            res.json({
                status: speakers[0]
            })
        } else {
            throw speakers
        }
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on getting speakers'
        })
    }
}

async function createNewSpeaker(req, res, next) { 
    try {
        if (!!req.body.speakername) { // check payload information

            const payload = {
                convoid: req.params.conversationid,
                speakername: req.body.speakername,
                speakerid: uuidv4(),
                etime: null,
                stime: null 
            }

            const getSpeakers = await convoModel.getConvoSpeakers(payload.convoid)

            //first check that speaker name unique
            if (!!getSpeakers[0].speakers && getSpeakers[0].speakers.length > 0) {
                let speakerExist = getSpeakers[0].speakers.filter(spk => spk.speaker_name === payload.speakername)
                if (speakerExist.length > 0) {
                    throw { message: 'Speaker name already exists' }
                } 
            } else {
                res.status(202).send({
                    txtStatus: 'warning',
                    msg: 'couldn\'t pull speakers'
                })  
            }
            
            //if in a turn 
            if (!!req.body.turnid) {
                const new_payload = {
                    turnid: req.body.turnid, 
                    convoid: req.params.conversationid
                }
                let audiotime = await convoModel.getTurnAudioTime(new_payload)
                if(!!audiotime){
                    let startime = audiotime[0].min
                    let endtime = audiotime[0].max
                    //make sure it's not too long // WIP!!

                    payload.stime = startime 
                    payload.etime = endtime 
                }  
            }

            //create the speaker (will show up in speaker map)

            let createSpeaker = await convoModel.createSpeaker(payload)

            // Success
            if (createSpeaker === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'A speaker has been added to the conversation'
                })
                //if speaker created, change speaker name in turn 
                if (!!req.body.turnid){
                    const new_payload = {
                        turnid: req.body.turnid, 
                        convoid: req.params.conversationid, 
                        speakerid: payload.speakerid 
                    }
                    let updateTurn = await convoModel.updateTurnSpeakerId(new_payload)
                    if (updateTurn !== 'success') {
                        throw updateTurn
                    }
                }
            } else {
                throw createSpeaker
            }   
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on creating speaker'
        })
    }
}

async function identifySpeaker(req, res, next) { 
    try {
        if (!!req.body.newspeakername) { 
            console.log(req.body)
            const payload = {
                convoid: req.params.conversationid,
                speakerid: req.params.speakerid,
                speakername: req.body.newspeakername
            }
            let updateSpeaker = await convoModel.updateSpeakerName(payload)

            // Success
            if (updateSpeaker === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'speaker name updated'
                })
            } else {
                throw updateSpeaker
            }
        } else  {
            throw { message: 'Missing information in the payload object' }
        }

    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on identifying speaker'
        })
    }
}

async function deleteSpeaker(req, res, next) {
    try {
        const payload = {
            convoid: req.params.conversationid,
            speakerid: req.params.speakerid
        }

        //checks that a speaker id is not used in any turn before
        let check = await convoModel.checkSpeakerId(payload)
        if (check.length > 0) {
            const turn = check[0]['text'][0]['turn_id']
            console.log(`speaker found in turn ${turn}`)
            res.status(428).send({
                turn_number: turn,
                msg: `speaker can't be deleted, found in turn: ${turn}`
            })
        } else {
            // remove speaker from conversation
            let delSpeaker = await convoModel.deleteSpeaker(payload)
            if (!!delSpeaker.error) {
                throw delSpeaker
            }

            // Success
            if (delSpeaker === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'speaker deleted'
                })
            } else {
                throw delSpeaker
            }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on deleting speaker'
        })
    }
}

async function combineSpeakerIds(req, res, next) {
    try {
        if (!!req.body.newspeakerid) {
            const payload = {
                convoid: req.params.conversationid,
                speakerid: req.params.speakerid,
                newspeakerid: req.body.newspeakerid
            }

            // Update speaker turns
            let updateSpeakers = await convoModel.changeSpeakerIds(payload)
            if (updateSpeakers === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'Speaker turns updated'
                })
            } else {
                throw updateSpeakers
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on updating speaker turns'
        })
    }
}

module.exports = {
    combineSpeakerIds,
    createNewSpeaker,
    deleteSpeaker,
    identifySpeaker,
    getSpeakers
}