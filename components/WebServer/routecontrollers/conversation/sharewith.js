const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

async function addShareWith(req, res, next) { //pulls speaker map for a conversation
    try {
        const convoid = req.params.conversationid
        if (!!req.body.sharewith) { // check payload information
            let payload = {
                convoid,
                sharewith: req.body.sharewith
            }
            let addSW = await convoModel.addShareWith(payload)
            if (addSW === 'success') {
                res.json({
                    status: 'success',
                    msg: 'Conversation shared'
                })
            } else {
                throw addSW
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on sharing with users'
        })
    }
}

async function removeShareWith(req, res, next) { //pulls speaker map for a conversation
    try {
        const convoid = req.params.conversationid
        const userid = req.params.userid
        let payload = {
            convoid,
            userid
        }
        let removeSW = await convoModel.removeShareWith(payload)
        if (removeSW === 'success') {
            res.json({
                status: 'success',
                msg: 'User removed from the conversation'
            })
        } else {
            throw removeSW
        }

    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on sharing with users'
        })
    }
}

async function updateShareWith(req, res, next) { //pulls speaker map for a conversation
    try {
        const convoid = req.params.conversationid
        const userid = req.params.userid
        if (!!req.body.rights) { // check payload information
            let payload = {
                convoid,
                userid,
                rights: req.body.rights
            }
            let updateSW = await convoModel.updateShareWith(payload)
            if (updateSW === 'success') {
                res.json({
                    status: 'success',
                    msg: 'User rights have been updated'
                })
            } else {
                throw updateSW
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on sharing with users'
        })
    }
}


module.exports = {
    addShareWith,
    removeShareWith,
    updateShareWith
}