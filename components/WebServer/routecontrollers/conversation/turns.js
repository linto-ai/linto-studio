const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const { v4: uuidv4 } = require('uuid')
const clone = require('rfdc')()

async function createTurn(req, res, next) {
    //so far this function is not used by the user... 
    //but convoModel.createTurn is used by other routecontroller functions.
    try {
        console.log(req.params)
        if (!!req.params.speakerid) { ///made speaker id a param string-KT
            let payload = {
                convoid: req.params.conversationid,
                speakerid: req.params.speakerid,
                turnid: uuidv4(),
                pos: 0.5, //default to first position (taken care of in renumber turns)
                words: []
            }
            console.log(payload)
            let addTurn = await convoModel.createTurn(payload)
            if (addTurn === 'success') {
                console.log("turn creation success")
                next() //re-order turns
            } else {
                throw addTurn
            }
        } else  {
            throw { message: 'Missing information in the payload object' }
        }

    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error creating a new turn'
        })
    }
}

async function deleteTurns(req, res, next) {
    try {
        if (!!req.body.length > 0) { ///can't add a name to the req body so for now just check for array-KT
            const payload = {
                convoid: req.params.conversationid,
                turnids: req.body
            }
            let deleteTurns = await convoModel.deleteTurns(payload)
            if (deleteTurns === 'success') {
                console.log("turn deletion success")
                next() //reorder turns
            } else {
                throw deleteTurns
            }
        } else {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error deleting turns'
        })
    }
}

async function identifyTurnSpeaker(req, res, next) { //WIP
    try {
        // We build the payload by getting req.params (parameters in the url) and req.body (data in the body)
        if (!!req.body.speakerid) {
            const payload = {
                speakerid: req.body.speakerid,
                convoid: req.params.conversationid,
                turnid: req.params.turnid
            }

            // Todo : Check if speaker exists first ? 

            let updateTurn = await convoModel.updateTurnSpeakerId(payload)
            if (updateTurn === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'speaker name updated'
                })
            } else {
                throw updateTurn
            }
        } else  {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on identifying speaker for this turn'
        })
    }
}


async function mergeTurns(req, res, next) {
    //takes a convo id and list of turn ids and a speaker id
    try {
        if (req.body.turnids.length > 1 && !!req.body.speakerid) {
            const payload = {
                convoid: req.params.conversationid,
                turnids: req.body.turnids,
                speakerid: req.body.speakerid,
            }
            let getTurns = await convoModel.getTurns(payload)
          
            if (getTurns !== "undefined") {
                //console.log(response[0]["text"])
                //sort turns in ascending order
                let turns = getTurns[0]["text"].sort((a, b) => a.pos - b.pos)

                //check all turns are same speaker or speaker id given and turns consecutive
                const samespeaker = arr => arr.every(v => v['speaker_id'] === arr[0]['speaker_id'])
                const consecutive = arr => arr.every((elem, i) => i === arr.length - 1 || elem.pos === arr[i + 1].pos - 1)
                if ((payload.hasOwnProperty('speakerid') || samespeaker(turns)) && consecutive(turns)) {
                    //concat all words under all turns
                    let new_words = []
                    let position = 0
                    turns.forEach(turn => {
                        words = turn.words.sort((a, b) => a.pos - b.pos)
                        words.forEach(w => {
                            w.pos = position
                            new_words.push(w)
                            position++
                        })
                    })

                    //replace first turn's words with concat set
                    let first_turn = turns[0].turn_id
                    let new_payload = {
                        convoid: payload.convoid,
                        turnid: first_turn,
                        text: new_words,
                        speakerid: payload.speakerid
                    }


                    let replaceTurnText = await convoModel.replaceTurnText(new_payload)

                    if (replaceTurnText === 'success') {
                        //if speakerid defined, then replace speaker id
                        /*if (payload.hasOwnProperty('speakerid')) {
                            let updateTurnSpeakerId = await convoModel.updateTurnSpeakerId(new_payload)
                            console.log('updateTurnSpeakerId', updateTurnSpeakerId)
                            if (updateTurnSpeakerId !== 'success') {
                                throw ({
                                    message: "couldn't replace speaker name"
                                })

                                //in this case speaker of the merged turn will just be the 
                                //speaker of the first turn
                            }
                        }*/
                        //delete remaining turnsw
                        turns.shift()
                        let turn_list = turns.map(elem => elem.turn_id)
                        let delete_payload = {
                            convoid: payload.convoid,
                            turnids: turn_list
                        }

                        let deleteTurns = await convoModel.deleteTurns(delete_payload)
                        if (deleteTurns === 'success') {
                            console.log("merge success")
                            next()
                        } else {
                            res.json({
                                msg: "turn deletion unsuccessful"
                            })
                        }
                    } else {
                        throw replaceTurnText
                    }
                } else {
                    throw ({
                        message: "speakers not same or turns not consecutive"
                    })
                }
            }
        } else  {
            throw { message: 'Missing information in the payload object' }
        }
    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on merging turns'
        })
    }
}

async function renumberTurns(req, res, next) {
    try {
        const convoid = req.params.conversationid
        let allTurns = await convoModel.getAllTurns(convoid)
        if (allTurns.length > 0) {
            const turns = allTurns[0].text.sort((a, b) => a.pos - b.pos)
            let position = 0
            turns.forEach((elem => {
                elem.pos = position
                position++
            }))
            new_payload = {
                convoid: convoid,
                turns: turns
            }
            let newtext = await convoModel.replaceText(new_payload)
            if (newtext === 'success') {
                // Response 
                res.status(200).send({
                    txtStatus: 'success',
                    msg: 'Turn positions have been updated'
                })
            } else {
                throw newtext
            }
        } else {
            throw { message: 'couldn\'t retrieve turns' }
        }
    } catch (error) {
        // Error
        if (!!error.error && error.error === 'no_match') { // if no match
            res.status(200).send({
                txtStatus: 'success',
                msg: 'Turns already up to date' 
                //NB: if you merge all turns in a conversation and then reorder you get this error--KT
            })
        } else {
            res.status(400).send({
                status: 'error',
                msg: !!error.message ? error.message : 'error on identifying speaker for this turn'
            })
        }
    }
}
/*async function createNewTurnSpeaker(req, res, next) {
    try {
        const speakerid = req.params.speakerid
        const convoid = req.params.conversationid

        // check if user exists
        const convoSpeakers = await convoModel.getConvoSpeakers(convoid)

        if (!!convoSpeakers[0].speakers && convoSpeakers[0].speakers.length > 0) {
            let speakerFound = convoSpeakers[0].speakers.filter(spk => spk.speaker_id === speakerid)
            console.log('speakerFound', speakerFound)
            if (speakerFound.length > 0) {
                console.log('OK... next')
            }
        }
        res.json({ test: 'test' })
    } catch (error) {
        console.error(error)
    }
}*/

async function splitTurns(req, res, next) {
    // takes 1 or 2 turn positions, one or two word ids and a speaker id
    try {
        if (!!req.body.speakerid && !!req.body.wordids && !!req.body.positions) {
            const payload = {
                speakerid: req.body.speakerid,
                wordids: req.body.wordids,
                positions: req.body.positions,
                convoid: req.params.conversationid
                //splitype: 'youmom'
            }
            let words = payload.wordids
            let nums = payload.positions
                if (nums.length > 1) {
                    payload.positions = [...Array(nums[1] + 1).keys()].slice(nums[0])
                }
                
            // get all turns
            let getTurns = await convoModel.getTurns(payload)


            if (getTurns !== "undefined") {
                // take first turn and sort words in that turn and put in start_words variable
                let turns = getTurns[0].text.sort((a, b) => a.pos - b.pos)

                let start_words = turns[0].words.sort((a, b) => a.pos - b.pos)
                let end_words = null

                if (nums.length == 1) {
                    //if only one turn position was given, then make start words same as end words
                    end_words = start_words
                } else {
                    //else the end words are the sorted words of the last turn
                    end_words = turns[turns.length - 1].words.sort((a, b) => a.pos - b.pos)
                }
                
                //keep last word of last turn in last_pos variable
                let last_pos = end_words[end_words.length - 1].pos

                //get starting word position from start word id
                let start_word = start_words.filter(obj => {
                    return obj.wid === payload.wordids[0]
                })
                const start_pos = start_word[0].pos

                //get ending word id
                if (words.length > 1) {
                    //if more than one word id was provided
                    end_word = end_words.filter(obj => {
                        return obj.wid === payload.wordids[1]
                    })
                } else {
                    end_word = start_word
                }

                //get end word position
                const end_pos = end_word[0].pos

                console.log("start word pos", start_pos)
                console.log("end word pos", end_pos)

                //case 1: start_pos == 0 and end_pos == last_pos
                //case 2: start_pos != 0 and end_pos != last_pos
                //case 3: start_pos == 0 and end_pos != last_pos
                //case 4: start_pos != 0 and end_pos == last_pos
                //case 5: start_pos == last pos **

                //case 1: check that user selection is not coextensive with just one Did you mean: c'estturn
                if (start_pos === 0 && end_pos === last_pos && nums.length == 1) {
                    throw ({
                        message: "selected turn already exists"
                    })
                } else {
                    const until_word = (arr, pos) => arr.filter((elem) => elem.pos <= pos)
                    const from_word = (arr, pos) => arr.filter((elem) => elem.pos >= pos)
                    const extract_words = (arr, start, end) => arr.filter((elem) => elem.pos >= start && elem.pos <= end)
                    
                    if (start_pos === end_pos){ //case 5
                        //create first turn 
                        //convention: user selects word they want to split *infront of*
                        let firstturnid = uuidv4()
                        let first_turn_payload = {
                            convoid: payload.convoid,
                            speakerid: turns[0].speaker_id,
                            turnid: firstturnid,
                            pos: turns[0].pos,
                            words: until_word(start_words, start_pos - 1)
                            //words: until_word(start_words, start_pos)
                        }
                        let createFirstTurn = await convoModel.createTurn(first_turn_payload)
                        if (createFirstTurn === 'success') {
                            console.log("turn creation successful")
                        } else {
                            throw createTurn
                        }
                        //create second turn
                        //from the word selected until the end of the turn
                        let new_end_words = clone(end_words)
                        let end_turn_words = from_word(new_end_words, end_pos)
                        let position = 0
                        end_turn_words.forEach(elem => {
                            elem.pos = position
                            position++
                        })
                        let secondturnid = uuidv4()
                        let second_turn_payload = {
                            convoid: payload.convoid,
                            speakerid: turns[turns.length - 1].speaker_id,
                            turnid: secondturnid,
                            pos: turns[turns.length - 1].pos + .75,
                            words: end_turn_words
                        }
                        let createSecondTurn = await convoModel.createTurn(second_turn_payload)
                        if (createSecondTurn === 'success') {
                            console.log("turn creation successful--now deleting old turns")
                            //now delete original turns
                            delete_payload = {
                                convoid: payload.convoid,
                                turnids: turns.map(a => a.turn_id)
                            }
                            let deleteTurns = await convoModel.deleteTurns(delete_payload)
                            if (deleteTurns === 'success') {
                                console.log("turn split success")
                                next() //reorder turns
                            } else {
                                throw deleteTurns
                            }
                        } else {
                            throw createTurn
                        }
                    } else { // cases 2,3,4
                        if (start_pos !== 0) { // handle first turn cases 2 or 4
                            let turnid = uuidv4()
                            let new_payload = {
                                convoid: payload.convoid,
                                speakerid: turns[0].speaker_id,
                                turnid: turnid,
                                pos: turns[0].pos,
                                words: until_word(start_words, start_pos - 1)
                            }
                            let createTurn = await convoModel.createTurn(new_payload)
                            if (createTurn === 'success') {
                                console.log("turn creation successful")
                            } else {
                                throw createTurn
                            }
                        } 
                        if (end_pos != last_pos) { // handle last turn case 2 or 3
                            let new_end_words = clone(end_words)
                            let end_turn_words = from_word(new_end_words, end_pos + 1)
                            let position = 0
                            end_turn_words.forEach(elem => {
                                elem.pos = position
                                position++
                            })
                            let turnid = uuidv4()
                            let new_payload = {
                                convoid: payload.convoid,
                                speakerid: turns[turns.length - 1].speaker_id,
                                turnid: turnid,
                                pos: turns[turns.length - 1].pos + .75,
                                words: end_turn_words
                            }
                            let createTurn = await convoModel.createTurn(new_payload)
                            if (createTurn === 'success') {
                                console.log("turn creation successful")
                            } else {
                                throw createTurn
                            }
                        }
                        //handle selected text for turn
                        let new_words = []
                        let position = 0

                        if (nums.length == 1) { //for single turn selections
                            extract_words(start_words, start_pos, end_pos).forEach(elem => {
                                elem.pos = position
                                new_words.push(elem)
                                position++
                            })

                        } else {
                            // handle start
                            if (start_pos != 0) { //case 2 or 4
                                from_word(start_words, start_pos).forEach((elem => {
                                    elem.pos = position
                                    new_words.push(elem)
                                    position++
                                }))
                            } else { // case 1 or 3
                                start_words.forEach(elem => {
                                    elem.pos = position
                                    new_words.push(elem)
                                })
                            }

                            //handle "middle turns" if any     
                            let middle_turns = turns.slice(1, -1)

                            middle_turns.forEach(turn => {
                                words = turn.words.sort((a, b) => a.pos - b.pos)
                                words.forEach(w => {
                                    w.pos = position
                                    new_words.push(w)
                                    position++
                                })
                            })

                            // handle end 
                            if (end_pos !== last_pos) { // case 2 or 3
                                until_word(end_words, end_pos).forEach(elem => {
                                    elem.pos = position
                                    new_words.push(elem)
                                    position++
                                })
                            } else { // case 1 or 4
                                end_words.forEach(elem => {
                                    elem.pos = position
                                    new_words.push(elem)
                                    position++
                                })
                            }
                        }
                        // create new selected turn     
                        let turnid = uuidv4()
                        let new_payload = {
                            convoid: payload.convoid,
                            speakerid: payload.speakerid,
                            turnid: turnid,
                            pos: turns[0].pos + .5, //until reordered
                            words: new_words
                        }
                        let createTurn = await convoModel.createTurn(new_payload)
                        if (createTurn === 'success') {
                            //now delete original turns
                            delete_payload = {
                                convoid: payload.convoid,
                                turnids: turns.map(a => a.turn_id)
                            }
                            let deleteTurns = await convoModel.deleteTurns(delete_payload)
                            if (deleteTurns === 'success') {
                                console.log("turn split success")
                                next() //reorder turns
                            } else {
                                throw deleteTurns
                            }
                        } else {
                            throw createTurn
                        }
                    }
                }

            } else {

                throw ({ message: "couldn't retrieve turns" })
            }

        } else  {
            throw ({ message: 'Missing information in the payload object' })
        }

    } catch (error) {
        // Error
        res.status(400).send({
            status: 'error',
            msg: !!error.message ? error.message : 'error on splitting turns'
        })
    }
}

module.exports = {
    //createNewTurnSpeaker,
    createTurn,
    deleteTurns,
    identifyTurnSpeaker,
    mergeTurns,
    renumberTurns,
    splitTurns
}