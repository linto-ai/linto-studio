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


//{"convoid":"5e9d6376c8ffff536c0a2b8d","turnids": ["586f291240414844b04ab777d82b0ec5"],"words":[{"word":"your","pos":0},{"word":"mama","pos":1},{"word":"so","pos":2},{"word":"fat","pos":3}]}

async function replaceTurnText(req, res, next) {
    // takes a text field, ie. a list of word objects with text and position numbers
    try {
        const payload = req.body
        num_words = payload.words.length
        const { convoid, turnids } = payload
        const newPayload = { convoid, turnids }
        let response = await convoModel.getTurns(newPayload)
        let testresponse = response[0].text[0] //why didn't this work like above??

        if (response !== "undefined") {
            //sort words in turn take first word stime
            words = testresponse.words.sort((a, b) => a.pos - b.pos)
                //words = response[0].text[0].words.sort((a, b) => a.pos - b.pos)
            stime = words[0].stime
            etime = words[words.length - 1].etime
            whole = etime - stime
            summand = whole / num_words
                //for word in list payload.words
                //stime == sttime, new_etime == stime + summand, [insert times, generate id] stime == new_etime
            new_words = payload.words.sort((a, b) => a.pos - b.pos)
            new_words.forEach((elem => {
                    elem.wid = uuidv4()
                    elem.stime = stime
                    new_etime = stime + summand
                    elem.etime = new_etime
                    stime = new_etime
                }))
                //once done, substitute last new_etime with etime (to prevent numerical drag?)
            new_words[new_words.length - 1].etime = etime
                //update turn
            let finalpayload = { words: new_words, convoid: payload.convoid, turnid: payload.turnids[0] }

            let response = await convoModel.replaceWords(finalpayload)
            if (response.result['ok'] === 1) {
                // RESPONSE 
                res.json({
                    status: "200",
                    msg: "success!"
                })
            } else {
                res.json({
                    status: '400',
                    msg: 'could not update turn words'
                })
            }
        } else {
            res.json({
                msg: "couldn't retrieve turn"
            })
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createConvoBase,
    updateSpeakerAudio,
    replaceTurnText
}