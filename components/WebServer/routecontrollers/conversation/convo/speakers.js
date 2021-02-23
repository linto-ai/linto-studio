const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')

async function getSpeakers(req, res, next) { //WIP
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

async function createNewSpeaker(req, res, next) { // OK
    try {
        // We build the payload by getting req.params (parameters in the url) and req.body (data in the body)
        if (!!req.body.speakername) { // check payload informations
            const payload = {
                convoid: req.params.conversationid,
                speakername: req.body.speakername,
                speakerid: uuidv4()
            }
            const getSpeakers = await convoModel.getConvoSpeakers(payload.convoid)
            console.log('getSpeakers', getSpeakers)

            if (!!getSpeakers[0].speakers && getSpeakers[0].speakers.length > 0) {
                // check if speaker_name already exists
                let speakerExist = getSpeakers[0].speakers.filter(spk => spk.speaker_name === payload.speakername)
                if (speakerExist.length > 0) {
                    res.status(202).send({
                        txtStatus: 'warning',
                        msg: 'Speaker already exists'
                    })
                } else {
                    let createSpeaker = await convoModel.createSpeaker(payload)

                    // Success
                    if (createSpeaker === 'success') {
                        // Response 
                        res.status(200).send({
                            txtStatus: 'success',
                            msg: 'A speaker has been added to the conversation'
                        })
                    } else {
                        throw createSpeaker
                    }
                }
            } else { // if no speaker exists
                let createSpeaker = await convoModel.createSpeaker(payload)

                // Success
                if (createSpeaker === 'success') {
                    // Response 
                    res.status(200).send({
                        txtStatus: 'success',
                        msg: 'A speaker has been added to the conversation'
                    })
                } else {
                    throw createSpeaker
                }
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

async function identifySpeaker(req, res, next) { //WIP
    try {
        // We build the payload by getting req.params (parameters in the url) and req.body (data in the body)
        if (!!req.body.newname) { // check payload informations
            const payload = {
                convoid: req.params.conversationid,
                speakerid: req.params.speakerid,
                speakername: req.body.newname
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
        console.log('par la ', req.body, !!req.body.newspeakerid)
        if (!!req.body.newspeakerid) {

            const payload = {
                convoid: req.params.conversationid,
                speakerid: req.params.speakerid,
                newspeakerid: req.body.newspeakerid
            }
            console.log('>', payload)

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