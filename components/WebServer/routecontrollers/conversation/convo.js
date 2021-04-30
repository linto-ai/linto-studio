const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:convo`)
const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const { v4: uuidv4 } = require('uuid')
const clone = require('rfdc')()


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
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch (error) {
        console.error(error)
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
            res.json({
                status: 'error',
                msg: 'error'
            })
        }
    } catch (error) {
        console.error(error)
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


module.exports = {
    createConvoBase,
    updateSpeakerAudio,
    deleteConvo
}