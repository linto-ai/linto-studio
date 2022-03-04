const middleware = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)
const fs = require('fs')
const debug = require('debug')(`app:conversation-manager:components:WebServer:routeControllers`)
const convoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

async function createConvoBase(req, res, next) { //WIP TODO check userid
    try {
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
            throw ({
                status: 'error',
                msg: 'error'
            })
        }
    } catch (error) {
        console.error(error)
        res.json({ error })
    }
}

async function updateSpeakerAudio(req, res, next) {
    try {
        const payload = req.body
        let response = await convoModel.updateSpeakerAudio(payload)
        if (response.result['ok'] === 1) {
            res.json({
                status: "200",
                msg: "success!"
            })
        } else {
            throw ({
                status: 'error',
                msg: 'error'
            })
        }
    } catch (error) {
        console.error(error)
        res.json({ error })
    }
}

async function deleteConvo(req, res, next) {
    if (req.body.conversationId != "") {
        const conversationId = req.body.conversationId
        try {
            let response = await convoModel.deleteConversationById(conversationId)
            res.json(response)
        } catch (error) {
            debug(error)
            res.json({
                status: "error",
                msg: error
            })
        }
    } else {
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on delete conversation'
        })
    }
}

async function updateTitle(req, res, next) {
    try {
        if (!!req.body.title) {
            let payload = {
                convoid: req.params.conversationid,
                name: req.body.title
            }
            let updateTitle = await convoModel.updateMetaData(payload)
            if (updateTitle === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'title updated'
                })
            } else {
                throw updateTitle
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error updating title'
        })
    }
}

async function updateAgenda(req, res, next) {
    try {
        if (!!req.body.agenda) {

            let payload = {
                convoid: req.params.conversationid,
                agenda: req.body.agenda
            }

            let updateAgenda = await convoModel.updateMetaData(payload)

            if (updateAgenda === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'agenda updated'
                })
            } else {
                throw updateAgenda
            }

        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        console.error(error)
            // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error updating highlight'
        })
    }
}

async function updateDescription(req, res, next) {
    try {
        if (!!req.body.description) {

            let payload = {
                convoid: req.params.conversationid,
                description: req.body.description
            }

            let updateDescription = await convoModel.updateMetaData(payload)

            if (updateDescription === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'adescription updated'
                })
            } else {
                throw updateDescription
            }

        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        console.error(error)
            // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error updating highlight'
        })
    }
}

async function updateConvoType(req, res, next) {
    try {
        if (!!req.body.convoType) {

            let payload = {
                convoid: req.params.conversationid,
                convoType: req.body.convoType
            }

            let updateConvoType = await convoModel.updateMetaData(payload)

            if (updateConvoType === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'conversation type updated'
                })
            } else {
                throw updateConvoType
            }

        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        console.error(error)
            // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error updating highlight'
        })
    }
}
async function deleteConversation(req, res, next) {
    try {
        let convoid = req.params.conversationid
        let getConvo = await convoModel.getConvoById(convoid)


        if (getConvo.length > 0) {
            let convo = getConvo[0]
            let audiofile = convo.audio.filepath
            let filePath = `${process.cwd()}/storages/${audiofile}`
            let deleteConvo = await convoModel.deleteConversationById(convoid)

            if (deleteConvo.status === 'success') {
                fs.unlink(filePath, async(err) => {
                    if (err) {
                        res.json({ status: 'error', mgs: 'Error on deleting audiofile', error: err })
                    } else  {
                        res.json({ status: 'success', msg: 'The conversation has been deleted' })
                    }
                })
            } else {
                throw 'Error on deleting conversation'
            }
        } else {
            throw 'Conversation not found'
        }
    } catch (error) {
        console.error(error)
            // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error deleting conversation'
        })
    }
}

module.exports = {
    createConvoBase,
    deleteConversation,
    updateSpeakerAudio,
    deleteConvo,
    updateTitle,
    updateDescription,
    updateAgenda,
    updateConvoType
}