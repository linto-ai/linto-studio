const convoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')

async function replaceTurn(convoid, payload) { //payload = turn
    try {
        const words = payload.words.sort((a, b) => a.pos - b.pos)
        let newwords = [] //this will be the final list used to update the turn
        let sublist = []

        let abs_etime = null //initialize abs time variables
        let abs_stime = null

        const new_payload = {
            turnid: payload.turn_id,
            convoid
        }
        let audiotime = await convoModel.getTurnAudioTime(new_payload)

        if (!!audiotime) {
            abs_stime = parseFloat(audiotime[0].min)
            abs_etime = parseFloat(audiotime[0].max)
        } else {
            throw { message: 'Problem with turn object -- might be empty' }
        }

        let starttime = abs_stime
        words.forEach(elem => {
            if (elem.wid === "todefine") { //if elem is new word object
                sublist.push(elem)
            } else if (sublist.length > 0) { //if not a new word && immediately preceding word(s) are new

                let endtime = elem.stime //starttime of this elem is the endtime of the sublist 
                    //NB: the starttime of the sublist is the endtime of the last non-new word

                let num_words = sublist.length
                let whole = endtime - starttime

                if (num_words === 1) { //!!if just one subelem, add with starttime and endtime
                    let subelem = sublist[0]
                    subelem.wid = uuidv4()
                    subelem.stime = starttime
                    subelem.etime = endtime


                    newwords.push(subelem)

                } else {
                    let summand = whole / num_words //divide time evenly over sublist words
                        //let div = whole/num_words
                        //let summand = Math.round((div + Number.EPSILON) * 100) / 100
                    sublist.forEach((subelem) => {
                        subelem.wid = uuidv4()
                        let raw_etime = starttime + summand
                        new_etime = Math.round((raw_etime + Number.EPSILON) * 100) / 100
                        subelem.etime = new_etime
                        subelem.stime = Math.round((starttime + Number.EPSILON) * 100) / 100
                        newwords.push(subelem) //add word to final list
                        starttime = raw_etime
                    })
                }

                sublist = []
                starttime = elem.etime
                newwords.push(elem) //endtime of current element becomes new startime 

            } else { //if not a new word and none of immediately preceding word(s) are new
                starttime = parseFloat(elem.etime)
                newwords.push(elem)
            }
        })
        if (sublist.length > 0) { //if every word in the turn has been checked && sublist is not empty
            endtime = abs_etime
            let num_words = sublist.length

            if (num_words === 1) {
                //!!if just one subelem, add with starttime and endtime
                let subelem = sublist[0]
                subelem.wid = uuidv4()
                subelem.stime = starttime
                subelem.etime = endtime
                newwords.push(subelem)
            } else {
                let whole = endtime - starttime
                let summand = whole / num_words //divide time evenly over sublist words
                    // let div = whole/num_words
                    // let summand = Math.round((div + Number.EPSILON) * 100) / 100
                sublist.forEach((subelem) => {
                    subelem.wid = uuidv4()
                    let raw_etime = starttime + summand
                    new_etime = Math.round((raw_etime + Number.EPSILON) * 100) / 100
                    subelem.etime = new_etime
                    subelem.stime = Math.round((starttime + Number.EPSILON) * 100) / 100
                    newwords.push(subelem) //add word to final list
                    starttime = raw_etime
                })
            }
        }

        let turnPayload = {
            words: newwords,
            turnid: payload.turn_id,
            convoid
        }
        if (turnPayload.words.length > 0) {
            for (let word of turnPayload.words) {
                word.etime = parseFloat(word.etime)
                word.stime = parseFloat(word.stime)
            }
        }
        const replaceWords = await convoModel.replaceWords(turnPayload)
        if (replaceWords === 'success') {
            return 'success'
        } else if (!!replaceWords.error && replaceWords.error === 'no_match') {
            return 'no change'
        } else  {
            throw replaceWords
        }
    } catch (error) {
        //console.error(error)
        return { error }
    }
}

async function replaceFullText(req, res, next) {
    try {
        if (!req.body.text) {
            throw 'Missing informations'
        }
        const convoid = req.params.conversationid
        let text = req.body.text // fullObject [{turn}, {turn}...]
        let tosplice = []
        if (text.length > 0) {
            let index = 0
            for (let turn of text) {
                // Create turn if turn(s) have been added
                if (turn.turn_id === 'todefine') {
                    let createTurnPayload = turn
                    createTurnPayload.pos -= 0.5
                    createTurnPayload.convoid = convoid
                    createTurnPayload.turnid = uuidv4()
                    createTurnPayload.speakerid = turn.speaker_id
                    await convoModel.createTurn(createTurnPayload)
                } else if (turn.pos === -1) {
                    let deleteturn = await convoModel.deleteTurns({
                        convoid,
                        turnids: [turn.turn_id]
                    })
                    tosplice.push(index)
                }
                index++
            }
            newText = text.filter(turntxt => turntxt.pos !== -1)

            // Renumber turns
            await convoModel.renumberTurns(convoid)

            // Get current object in database
            let currentObj = await convoModel.getConvoById(convoid)

            // get "turn_id" by "pos" for each turns
            let turnPosId = []
            if (currentObj.length > 0) {
                currentObj[0].text.map(t => {
                    turnPosId[t.pos] = t.turn_id
                })
            }

            // Replace turn text for each turns
            let position = 0
            for (let turn of newText) {
                let turnPayload = turn
                turnPayload.turn_id = turnPosId[position]
                let update = await replaceTurn(convoid, turnPayload)
                position++
                if (update !== 'success' &&  update !== 'no change') {
                    throw update
                }
            }
            res.json({ status: 'success', msg: 'text have been updated' })
        } else {
            throw 'Text not found'
        }
    } catch (error) {
        console.error(error)
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on replacing turn text'
        })
    }
}

async function replaceTurnText(req, res, next) {
    try {
        //console.log(req.params)
        if (!!req.body.words && !!req.body.turnid) {
            //takes a text field (a list of word objects) and adds word ids and calculates times for new words
            let payload = req.body
            const words = payload.words.sort((a, b) => a.pos - b.pos)
            let newwords = [] //this will be the final list used to update the turn
            let sublist = []

            let abs_etime = null //initialize abs time variables
            let abs_stime = null

            const new_payload = {
                turnid: req.body.turnid,
                convoid: req.params.conversationid
            }

            let audiotime = await convoModel.getTurnAudioTime(new_payload)

            if (!!audiotime) {
                abs_stime = parseFloat(audiotime[0].min)
                abs_etime = parseFloat(audiotime[0].max)
            } else {
                throw { message: 'Problem with turn object -- might be empty' }
            }

            let starttime = abs_stime

            words.forEach((elem => {
                if (elem.wid === "todefine") { //if elem is new word object
                    sublist.push(elem)
                } else if (sublist.length > 0) { //if not a new word && immediately preceding word(s) are new

                    let endtime = elem.stime //starttime of this elem is the endtime of the sublist 
                        //NB: the starttime of the sublist is the endtime of the last non-new word

                    let num_words = sublist.length
                    let whole = endtime - starttime

                    if (num_words === 1) { //!!if just one subelem, add with starttime and endtime
                        let subelem = sublist[0]
                        subelem.wid = uuidv4()
                        subelem.stime = starttime
                        subelem.etime = endtime


                        newwords.push(subelem)

                    } else {
                        let summand = whole / num_words //divide time evenly over sublist words
                            //let div = whole/num_words
                            //let summand = Math.round((div + Number.EPSILON) * 100) / 100
                        sublist.forEach((subelem) => {
                            subelem.wid = uuidv4()
                            let raw_etime = starttime + summand
                            new_etime = Math.round((raw_etime + Number.EPSILON) * 100) / 100
                            subelem.etime = new_etime
                            subelem.stime = Math.round((starttime + Number.EPSILON) * 100) / 100
                            newwords.push(subelem) //add word to final list
                            starttime = raw_etime
                        })
                    }

                    sublist = []
                    starttime = elem.etime
                    newwords.push(elem) //endtime of current element becomes new startime 

                } else { //if not a new word and none of immediately preceding word(s) are new
                    starttime = parseFloat(elem.etime)
                    newwords.push(elem)
                }
            }))

            if (sublist.length > 0) { //if every word in the turn has been checked && sublist is not empty
                endtime = abs_etime
                let num_words = sublist.length

                if (num_words === 1) {
                    //!!if just one subelem, add with starttime and endtime
                    let subelem = sublist[0]
                    subelem.wid = uuidv4()
                    subelem.stime = starttime
                    subelem.etime = endtime
                    newwords.push(subelem)
                } else {
                    let whole = endtime - starttime
                    let summand = whole / num_words //divide time evenly over sublist words
                        // let div = whole/num_words
                        // let summand = Math.round((div + Number.EPSILON) * 100) / 100
                    sublist.forEach((subelem) => {
                        subelem.wid = uuidv4()
                        let raw_etime = starttime + summand
                        new_etime = Math.round((raw_etime + Number.EPSILON) * 100) / 100
                        subelem.etime = new_etime
                        subelem.stime = Math.round((starttime + Number.EPSILON) * 100) / 100
                        newwords.push(subelem) //add word to final list
                        starttime = raw_etime
                    })
                }
            }

            //replace words in payload and update turn 
            payload.words = newwords
            payload.convoid = req.params.conversationid

            if (payload.words.length > 0) {
                for (let word of payload.words) {
                    word.etime = parseFloat(word.etime)
                    word.stime = parseFloat(word.stime)
                }
            }
            const replaceWords = await convoModel.replaceWords(payload)
            if (replaceWords === 'success') {
                res.json({
                    txtStatus: 'success',
                    msg: "Text has been updated"
                })
            } else if (!!replaceWords.error && replaceWords.error === 'no_match') {
                res.json({
                    txtStatus: 'success',
                    msg: "Text didn't change"
                })
            } else  {
                throw replaceWords
            }

        } else {
            throw { message: 'Missing information in payload object' }
        }
    } catch (error) {
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on replacing turn text'
        })
    }
}

module.exports = {
    replaceTurnText,
    replaceFullText
}