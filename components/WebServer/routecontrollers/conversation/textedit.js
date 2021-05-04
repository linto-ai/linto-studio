const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')
    //const clone = require('rfdc')()

// async function updateAllText(req, res, next) {
//     try {
//         if (!!req.body.text) {
//             const payload = {
//                 convoid: req.params.conversationid,
//                 text: req.body.text
//             }
//             const updateText = await convoModel.updateAllText(payload)
//             console.log('updateText', updateText)
//             if (updateText === 'success') {
//                 res.json({
//                     txtStatus: 'success',
//                     msg: "Text has been updated"
//                 })
//             } else  {
//                 throw updateText
//             }
//         } else {
//             throw { message: 'Missing information in the payload object' }
//         }
//     } catch (error) {
//         // Error
//         res.status(400).send({
//             status: 'error',
//             msg: !!error.message ? error.message : 'error on splitting turns'
//         })
//     }
// }

async function replaceTurnText(req, res, next) {
    try {
        //console.log(req.params)
        if(!!req.body.words && !!req.body.turnid){
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
            if(!!audiotime){
                abs_stime = audiotime[0].min
                abs_etime = audiotime[0].max
            } else {
                throw  { message: 'Problem with turn object -- might be empty' }
            }
            
            let starttime =  abs_stime

            words.forEach((elem => {
                if(elem.wid === "todefine"){ //if elem is new word object

                    sublist.push(elem)

                } else if(sublist.length > 0) { //if not a new word && immediately preceding word(s) are new

                    let endtime = elem.stime //starttime of this elem is the endtime of the sublist 
                    //NB: the starttime of the sublist is the endtime of the last non-new word
                
                    let num_words = sublist.length
                    let whole = endtime - starttime 

                    if (num_words === 1){  //!!if just one subelem, add with starttime and endtime
                        let subelem = sublist[0]
                        subelem.wid = uuidv4()
                        subelem.stime = starttime
                        subelem.etime = endtime
                        newwords.push(subelem)

                    } else {
                        let summand = whole/num_words  //divide time evenly over sublist words
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

                    starttime = elem.etime
                    newwords.push(elem)
                }
            }))
            
            if(sublist.length > 0){//if every word in the turn has been checked && sublist is not empty
                endtime = abs_etime 
                let num_words = sublist.length

                if (num_words === 1){
                    //!!if just one subelem, add with starttime and endtime
                    let subelem = sublist[0]
                    subelem.wid = uuidv4()
                    subelem.stime = starttime
                    subelem.etime = endtime
                    newwords.push(subelem)
                } else {
                    let whole = endtime - starttime 
                    let summand = whole/num_words  //divide time evenly over sublist words
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

            //verify that times are floats
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
            } else  {
                throw replaceWords
            }

        } else {
            throw {message: 'Missing information in payload object'}
        }
    } catch (error) {
        res.status(400).send({
            status: 'error', 
            msg: !!error.message ? error.message: 'error on replacing turn text'
        })
    }
}

/* 
async function renumberWords(req, res, next) { //WIP
    try {
        const payload = req.body
        let response = await convoModel.getAllWords(payload)
        if (response.length > 0) {
            const words = response[0].text[0].words.sort((a, b) => a.pos - b.pos)
            position = 0
            words.forEach((elem => {
                elem.pos = position
                position++
            }))
            new_payload = {
                convoid: payload.convoid,
                turnid: payload.turnid,
                words: words
            }
            let newwords = await convoModel.replaceWords(new_payload)
            if (newwords.result['ok'] === 1) {
                res.json({
                    status: '200',
                    msg: 'success!'
                })
            } else {
                res.json({
                    msg: "couldn't replace words"
                })
            }
        } else {
            res.json({
                msg: "couldn't retrieve words"
            })
        }
    } catch (error) {
        console.error(error)
    }
}

async function updateWordText(req, res, next) { //WIP
    try {
        const payload = req.body
        const changes = payload.changes

        new_payload = {
            convoid: payload.convoid,
            turnid: payload.turnid
        }

        async function asyncForEach(array, callback) { //move this to some sort of UTIL folder??
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array)
            }
        }

        if (changes[0].length === 0) { //case 1: "add" 
            //check position -- if 0 position null then at the beginning of the turn
            //if 1 position null then at the end of the turn
            //else find times between word ids of two positions
            //calculate new times
            //calculate new positions
            //insert new words object for each word
            //reposition


        } else if (changes[1].length === 0) { //case 2: "delete" 
            //TBD: what happens if we don't redistribute the times??
            //calculate time deleted
            //add to first or last word??
            //delete, reposition 
            new_payload.wordids = changes[0]
            let response = await convoModel.deleteWords(new_payload)
            if (response.result['ok'] === 1) {
                console.log("word deletion success")

            } else {
                res.json({
                    msg: "word deletion unsuccessful"
                })
            }

        } else if (changes[0].length === changes[1].length) { //case 3: "one-one replace"
            const update = async() => {
                failures = []
                await asyncForEach([...Array(changes[0].length).keys()], async(i) => {
                    new_payload.wid = changes[0][i]
                    new_payload.word = changes[1][i]
                    let response = await convoModel.updateWordText(new_payload)
                    if (response.result.nModified != 1) {
                        success.push(elem)
                    }
                })
                return failures
            }

            const final = await update()

            if (final.length < 1) {
                res.json({
                    status: "200",
                    msg: "success!"
                })
            } else {
                res.json({
                    status: 'warning',
                    msg: `${failures} not updated`
                })
            }

        } else { //case 4: "redistribute"
            //retrieve start time, end time, positions
            //calculate new times
            //calculate interim positions
            //for each word create new word object
            //delete old words
            //reposition

        }

    } catch (error) {
        console.error(error)
    }
}

async function deleteWordText(req, res, next) { //WIP--what do we do with the time once we delete?
    try {
        console.log("we are here!!")
        const payload = req.body
        let response = await convoModel.deleteWords(payload)
        if (response.result['ok'] === 1) {
            console.log("word deletion success")
            next() //reorder words
        } else {
            res.json({
                msg: "word deletion unsuccessful"
            })
        }
    } catch (error) {
        console.error(error)
    }
}

async function insertWords(req, res, next) { //WIP
    //takes a convoid, turnid, array of word ids, array of words, position array
    try {
        const payload = req.body
            //calculate positions, etimes/stimes, create word ids
            //insert words
            //reorder words
        let response = await convoModel.getWords(payload)
        console.log(response)
        if (response !== "undefined") {
            console.log(response)
            words = response[0].words.sort((a, b) => a.pos - b.pos)
            startpos = words[0].pos
            startetime = words[0].etime
            endstime = words[1].stime

            let num_words = payload.words.length
            let pos_inc = +Number(1 / (num_words + 1)).toFixed(2)
            let freetime = endstime - startetime
            let time_inc = freetime / num_words //if freetime == 0 then time_inc == 0

            new_words = []
            position = +Number(startpos + pos_inc).toFixed(2)
            stime = startetime
            etime = stime + time_inc

            words.forEach(elem => {
                newarray = Array()
                let wid = uuidv4()

                newarray.wid = wid
                newarray.stime = stime
                newarray.etime = etime
                newarray.word = elem
                newarray.pos = position
                new_words.push(newarray)

                position = +Number(position + inc).toFixed(2)
                stime = etime
                etime = stime + time_inc
            })

            payload.words = new_words

            //insert new array 
            let response = await convoModel.createWords(payload)
            if (response.result['ok'] === 1) {
                console.log("word addition success")
                next() //reorder words
            } else {
                res.json({
                    msg: "word addition unsuccessful"
                })
            }

        } else {
            res.json({
                msg: "words ids don't exist"
            })
        }

    } catch (error) {
        console.error(error)
    }

}
*/
module.exports = {
    replaceTurnText
}