const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const Blob = require('cross-blob')


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


module.exports = {
    createConvoBase,
    updateSpeakerAudio,
}