const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')


async function createhighlight(req, res, next) {
    try {
        if (!!req.body.wordids && !!req.body.label && !!req.body.color) {

            let payload = {
                convoid: req.params.conversationid,
            }

            let getHighlights = await convoModel.getHighlightTypes(payload)

            //check that highlight name unique
            if (!!getHighlights[0].highlights && getHighlights[0].highlights.length > 0) {
                let highlightExist = getHighlights[0].highlights.filter(hi => hi.label === req.body.label)
                if (highlightExist.length > 0) {
                    res.status(202).send({
                        txtStatus: 'warning',
                        msg: 'Highlight label already exists'
                    })
                }
            }

            //if name is unique, create hid add new highlight to highlight field 

            const hid = uuidv4()
            payload["hid"] = hid
            payload["label"] = req.body.label
            payload["color"] = req.body.color

            let highlightType = await convoModel.addHighlightType(payload)

            if (highlightType !== 'success') {
                throw highlightType
            }

            //add new highlight id to each word

            payload["wordids"] = req.body.wordids
            payload["operator"] = "add"

            let highlightWords = await convoModel.highlightWords(payload)
            if (highlightWords === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'highlight created'
                })
            } else {
                throw highlightWords
            }
        } else  {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        console.error(error)
            // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error creating highlight'
        })
    }
}

async function deletehighlight(req, res, next) {
    try {
        if (!!req.params.conversationid && !!req.params.hid) {

            let payload = {
                convoid: req.params.conversationid,
                hid: req.params.hid
            }

            //remove highlight from Highlights field
            let deleteHighlight = await convoModel.deleteHighlightField(payload)
            if (deleteHighlight !== 'success') {
                throw deleteHighlight
            }

            //find words with hid
            let wordids = await convoModel.getHighlightWordids(payload)

            if (!!wordids[0].wids && wordids[0].wids.length > 0) {
                payload["wordids"] = wordids[0].wids
                payload["operator"] = "remove"
            } else {
                throw wordids
            }

            //remove words with hid 
            let highlightWords = await convoModel.highlightWords(payload)

            if (highlightWords === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'highlight deleted'
                })
            } else {
                throw highlightWords
            }

        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error deleting highlight'
        })
    }
}

async function updatehighlightwords(req, res, next) {
    try {
        if (!!req.body.wordids) {

            let payload = {
                convoid: req.params.conversationid,
                hid: req.params.hid,
                wordids: req.body.wordids,
                operator: req.body.operator
            }

            let highlightWords = await convoModel.highlightWords(payload)

            if (highlightWords === 'success') {
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'highlight updated'
                })
            } else {
                throw highlightWords
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

async function updatehighlighttype(req, res, next) {
    try {
        if (!!req.body.label || !!req.body.color) {
            const payload = {
                convoid: req.params.conversationid,
                hid: req.params.hid,
            }
            if (!!req.body.label) {
                payload["label"] = req.body.label
            }
            if (!!req.body.color) {
                payload["color"] = req.body.color
            }

            let updateHighlight = await convoModel.modifyHighlightType(payload)

            // Success
            if (updateHighlight === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'highlight information updated'
                })
            } else {
                throw updateHighlight
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error updating highlight'
        })
    }
}


module.exports = {
    createhighlight,
    deletehighlight,
    updatehighlighttype,
    updatehighlightwords
}