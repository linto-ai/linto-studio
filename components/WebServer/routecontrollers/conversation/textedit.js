const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const { v4: uuidv4 } = require('uuid')
//const clone = require('rfdc')()

async function renumberWords(req, res, next){ //WIP
    try{
        const payload = req.body
        let response = await convoModel.getAllWords(payload)
        if (response.length > 0){
            const words = response[0].text[0].words.sort((a,b) => a.pos - b.pos)
            position = 0
            words.forEach((elem => {
                elem.pos = position
                position ++
            }))
            new_payload = {
                convoid: payload.convoid, 
                turnid: payload.turnid,
                words: words
            }
            let newwords = await convoModel.replaceWords(new_payload)
            if (newwords.result['ok'] === 1){
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
    } catch(error) {
        console.error(error)
    }
}

async function updateWordText(req, res, next){ //WIP
    try {
        const payload = req.body
        const changes = payload.changes

        new_payload = {
            convoid: payload.convoid, 
            turnid: payload.turnid
        }

        async function asyncForEach(array, callback) {//move this to some sort of UTIL folder??
            for (let index = 0; index < array.length; index++) {
              await callback(array[index], index, array)
            }
        }

        if (changes[0].length === 0){ //case 1: "add" 
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
           
        } else if (changes[0].length === changes[1].length){ //case 3: "one-one replace"
            const update = async() => {
                failures = []
                await asyncForEach([...Array(changes[0].length).keys()], async(i) => {
                    new_payload.wid = changes[0][i]
                    new_payload.word = changes[1][i]
                    let response = await convoModel.updateWordText(new_payload)
                    if(response.result.nModified != 1){
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

    } catch(error) {
        console.error(error)
    }
}

async function deleteWordText(req, res, next){ //WIP--what do we do with the time once we delete?
    try{
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
    } catch(error) {
        console.error(error)
    }
}

async function insertWords(req, res, next){ //WIP
    //takes a convoid, turnid, array of word ids, array of words, position array
    try{
        const payload = req.body
        //calculate positions, etimes/stimes, create word ids
        //insert words
        //reorder words
        let response = await convoModel.getWords(payload)
        console.log(response)
        if (response !== "undefined") {
            console.log(response)
            words = response[0].words.sort((a,b) => a.pos - b.pos)
            startpos = words[0].pos
            startetime = words[0].etime
            endstime = words[1].stime

            let num_words = payload.words.length 
            let pos_inc = +Number(1/(num_words + 1)).toFixed(2)
            let freetime = endstime - startetime
            let time_inc = freetime/num_words //if freetime == 0 then time_inc == 0

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

    } catch(error) {
        console.error(error)
    }

}

module.exports = {
    updateWordText, 
    deleteWordText, 
    renumberWords, 
    insertWords
}