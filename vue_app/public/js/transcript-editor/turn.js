import Word from "./word.js"
import Editor from './editor.js'
import { v4 as uuidv4 } from 'uuid';
export default class Turn extends EventTarget {
    constructor(data) {
        super()
        this.turnId = data.turn_id
        this.speakerId = data.speaker_id
        this.speakerName = data.speakerName
        this.words = []
        this.turnDiv = null
        this.speakerDiv = null
        this.speakerBtn = null
        this.language = data.language
        this.startTime = 0
        this.endTime = 0
        this.segment = !!data.segment ? data.segment : ''
        this.raw_segment = !!data.raw_segment ? data.raw_segment : ''
        this.focused = false
        this.clickTimer = null
        this.clickNb = 0

        // Set turn startTime & endTime & "words" Array
        for (let i = 0; i < data.words.length; i++) {
            if (i === 0) {
                this.startTime = data.words[i].stime || data.words[i].startTime
            }
            if (i === data.words.length - 1) {
                this.endTime = data.words[i].etime || data.words[i].endTime
            }
            data.words[i].turnId = this.turnId
            let word = new Word(data.words[i])
            this.words.push(word)
        }
    }

    render(type, wrapperId) {
        let container = document.getElementById(wrapperId)
        let speakerDiv = document.getElementById(`spk-${this.turnId}`)

        // Create speaker div if it doesn't exist
        if (speakerDiv !== null) {
            this.speakerDiv = speakerDiv
        } else {
            this.speakerDiv = document.createElement('div')
            container.append(this.speakerDiv)
        }
        this.speakerDiv.setAttribute('id', `spk-${this.turnId}`)
        this.speakerDiv.classList.add('conversation-speaker')
        this.speakerBtn = document.createElement('span')
        this.speakerBtn.classList.add('conversation-speaker-name')
        this.speakerBtn.innerHTML = this.speakerName

        this.speakerDiv.innerHTML = ''
        this.speakerDiv.append(this.speakerBtn)

        // Create turn div if it doesn't exist
        let turnDiv = document.getElementById(this.turnId)
        if (turnDiv !== null) {
            this.turnDiv = turnDiv
        } else {
            this.turnDiv = document.createElement('div')
            container.append(this.turnDiv)

            // Turn Events
            this.turnDiv.addEventListener('blur', (e) => {
                this.dispatchEvent(new CustomEvent('turn_update', {}))
                this.turnDiv.setAttribute('contentEditable', false)
                this.renderWords('span')
                this.focused = false
            })

            this.turnDiv.addEventListener('focus', (e) => {
                this.turnDiv.addEventListener('keydown', (e) => {
                    const selection = document.getSelection()
                    let wordsLength = this.turnDiv.innerHTML.length - 1
                    let isFirstChar = selection.anchorOffset === 0 && selection.extentOffset === 0
                    let isLastChar = selection.anchorOffset === wordsLength && selection.extentOffset === wordsLength

                    // Backspace (first character)
                    if (e.key === 'Backspace' || e.keyCode === 8) {
                        if (isFirstChar) {
                            this.dispatchEvent(new CustomEvent('turn_merge_with_previous', {
                                detail: {
                                    turnId: this.turnId
                                }
                            }))
                        }
                    }
                    // Enter (first or last character)
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        if (isFirstChar || isLastChar) {
                            e.preventDefault()
                        }
                    }
                })
            })
            this.turnDiv.addEventListener('focusout', (e) => {
                this.focused = false
            })
            this.turnDiv.addEventListener('click', handleClick.bind(this))
            this.turnDiv.addEventListener('input', handleInput.bind(this))
        }
        this.turnDiv.setAttribute('data-turn-id', this.turnId)
        this.turnDiv.setAttribute('class', 'turn')
        this.turnDiv.setAttribute('id', this.turnId)
        this.turnDiv.setAttribute('contentEditable', false)
        this.renderWords(type)

        this.speakerBtn.addEventListener('click', handleSpeakerClick.bind(this))
    }

    renderWords(type) {
        this.clean()
        if (type === 'txt') {
            let txt = ''
            for (let word of this.words) {
                if (word.value !== '') txt += word.value + ' '
            }
            this.turnDiv.append(txt)
        } else if (type === 'span') {
            for (let word of this.words) {
                word.render(this.turnId)
            }
        }
    }
    clean() {
        if (document.getElementById(this.turnId) !== null) document.getElementById(this.turnId).innerHTML = ''
    }
    renderPlayedWord(currentTime) {
        for (let word of this.words) {
            word.updatePlayedWord(currentTime)
        }
    }
}

// Compare changes in turn
function compareTurnContent() {
    let turnTxt = ''
    for (let word of this.words) {
        turnTxt += word.value + ' '
    }
    let newContent = normalizeTxt(this.turnDiv.innerHTML)
    let baseTxt = normalizeTxt(turnTxt)
    let turnWordsArray = baseTxt.split(' ').filter(word => word !== '')
    let newContentArray = newContent.split(' ').filter(word => word !== '')

    if (newContentArray.indexOf('</div>') >= 0) {
        newContentArray.splice(newContentArray.indexOf('</div>'), 1)
    }

    if (newContentArray.indexOf('<div>') >= 0) {
        prepareSplitTurn.call(this)
    }

    if (baseTxt !== newContent) {
        if (turnWordsArray.length === newContentArray.length) {
            console.log('same length but change')
            updateTurnWordValue.call(this, newContentArray)
        } else if (turnWordsArray.length > newContentArray.length) {
            console.log('Word deleted')
            deleteTurnWord.call(this, newContentArray, turnWordsArray.length - newContentArray.length)
        } else if (turnWordsArray.length < newContentArray.length) {
            console.log('Word added')
            insertTurnWord.call(this, newContentArray, newContentArray.length - turnWordsArray.length)
        }
    }
}

function normalizeTxt(string) {
    return string.trim().replace(/&nbsp;/g, ' ')
        // TODO: Add tests for special char
}

// Get syllables count by string
function getSyllable(string) {
    return Editor.syllabic.count(string) !== null ? Editor.syllabic.count(string) : 1
}

// Preparing object before splitting turn
async function prepareSplitTurn() {
    let turnObjWords = this.words.filter(word => word.value !== '')
    let newContent = normalizeTxt(this.turnDiv.innerHTML)
    let newContentArray = newContent.split(' ').filter(word => word !== '' && word !== '</div>')
    let splitIndex = 0
    for (let i = 0; i < newContentArray.length; i++) {
        // split before a word
        if (newContentArray[i].indexOf('<div>') === 0) {
            splitIndex = i - 1

            if (newContentArray[i] === '<div>') {
                newContentArray.splice(i, 1)
            }
            i = newContentArray.length - 1
        }
        // split in or after a word
        if (newContentArray[i].indexOf('<div>') > 0) {
            splitIndex = i
            i = newContentArray.length - 1
        }
    }
    let targetWord = turnObjWords[splitIndex]
    let targetWordIndex = this.words.findIndex(word => word.wordId === targetWord.wordId)
    let splittedWord = newContentArray[splitIndex].split('<div>').filter(val => val !== '')

    // Turn split in the middle of a word
    if (splittedWord.length > 1) {
        newContentArray[splitIndex] = splittedWord[0]
        newContentArray.splice(splitIndex + 1, 0, splittedWord[1])
        await splitWord.call(this, newContentArray, splitIndex)
    }
    splitAfterIndex.call(this, targetWordIndex)
}

// Check if empty Words exist after a target Word index and return an array of empty Words
function getTimeBoxAfterWord(wordIndex) {
    let emptyWords = []
    for (let i = wordIndex + 1; i < this.words.length; i++) {
        if (this.words[i].value === '') {
            emptyWords.push(this.words[i])
        } else {
            i = this.words.length
        }
    }
    return emptyWords
}

// replace words values by newContentArray words values
function updateTurnWordValue(newContentArray) {
    let turnObjWords = this.words.filter(word => word.value !== '')
    for (let i = 0; i < turnObjWords.length; i++) {
        // Find Word to update
        if (turnObjWords[i].value !== newContentArray[i] && newContentArray[i] !== '') {
            turnObjWords[i].value = newContentArray[i]
        }
    }
}

// Remove a word value + keep empty timeBox
function deleteTurnWord(newContentArray, diff) {
    let turnObjWords = this.words.filter(word => word.value !== '')
    let diffIndex = 0
    let wordFirstPos = false
    let wordLastPos = false

    // check if deleted word was on first position
    if (turnObjWords[0].value !== newContentArray[0]) {
        wordFirstPos = true
        diffIndex = 0
    }

    // check if deleted word was on last position
    else if (turnObjWords[turnObjWords.length - 1].value !== newContentArray[newContentArray.length - 1]) {
        wordLastPos = true
        diffIndex = turnObjWords.length - 1
    } else {
        for (let i = 0; i < turnObjWords.length; i++) {
            // find changing word index
            if (turnObjWords[i].value !== newContentArray[i]) {
                diffIndex = i
                i = turnObjWords.length - 1
            }
        }
    }
    let merged = false
        // check if Words have been merged ?
    if (wordFirstPos) {
        if (turnObjWords[0].value + turnObjWords[1].value === newContentArray[0]) {
            merged = true
            mergeWords.call(this, 0)
        }
    } else if (wordLastPos) {
        if (turnObjWords[diffIndex - 1].value + turnObjWords[diffIndex].value === newContentArray[newContentArray.length - 1]) {
            merged = true
            mergeWords.call(this, diffIndex - 1)
        }
    } else {
        if (turnObjWords[diffIndex].value + turnObjWords[diffIndex + 1].value === newContentArray[diffIndex]) {
            // Merge words
            merged = true
            let wordIndex = this.words.findIndex(word => word.wordId === turnObjWords[diffIndex].wordId)
            mergeWords.call(this, wordIndex)
        }
    }
    if (!merged) {
        // Remove words = set empty value
        for (let d = 0; d < diff; d++) {
            turnObjWords[diffIndex + d].value = ''
        }
    }
}

// Insert word in turn
async function insertTurnWord(newContentArray, diff) {
    let turnObjWords = this.words.filter(word => word.value !== '')
    let changeIndex = 0
    let wordValWas = ''

    let wordLastPos = false

    // Check if added word is in last position
    if (newContentArray[newContentArray.length - 1] !== turnObjWords[turnObjWords.length - 1].value) {
        wordLastPos = true
        changeIndex = turnObjWords.length - 1
        wordValWas = turnObjWords[changeIndex].value

    } else {
        // Get word index where word changed
        for (let i = 0; i < turnObjWords.length; i++) {
            if (normalizeTxt(turnObjWords[i].value) !== normalizeTxt(newContentArray[i]) && newContentArray[i] !== '') {
                changeIndex = i
                wordValWas = turnObjWords[i].value
                i = turnObjWords.length
            }
        }
    }

    let wordIsSplitted = wordValWas === newContentArray[changeIndex] + newContentArray[changeIndex + 1] ? true : false

    // WORD HAS BEEN SPLITTED
    if (wordIsSplitted) {
        splitWord.call(this, newContentArray, changeIndex)
    }
    // WORD(S) HAVE BEEN ADDED
    else {
        let initWord = wordLastPos ? turnObjWords[changeIndex] : turnObjWords[changeIndex - 1]
        let initWordIndex = this.words.findIndex(word => word.wordId === initWord.wordId)
        let timeBoxAvailable = getTimeBoxAfterWord.call(this, initWordIndex)

        // get words to insert
        let start = wordLastPos ? changeIndex + 1 : changeIndex
        let wordsToInsert = []
        for (let i = start; i <= start + diff - 1; i++) {
            wordsToInsert.push({
                value: newContentArray[i],
                syl: await getSyllable(newContentArray[i])
            })
        }
        // Replace existing timeBox (empty word with timebox)
        if (timeBoxAvailable.length > 0) {
            // If there are enought timeBox, replace them by added words
            if (diff <= timeBoxAvailable.length) {
                putWordsInTimebox.call(this, timeBoxAvailable, wordsToInsert)
            }
            // If there are more words than available timeBox, merge then create needed timeBox
            else {
                resetTimeBox.call(this, timeBoxAvailable, wordsToInsert)
            }
        }
        // No TimeBox available
        else {
            // Get first word real index (in "turnObj")
            let prevWord = wordLastPos ? turnObjWords[turnObjWords.length - 1] : turnObjWords[changeIndex - 1]
            let prevWordIndex = this.words.findIndex(word => word.wordId === prevWord.wordId)
            addWordsAfterIndex.call(this, prevWordIndex, wordsToInsert, wordLastPos)
        }
    }
}

// Merge two words of a turn
function mergeWords(wordIndex) {
    let firstWord = this.words[wordIndex]
    let secondWordIndex = 0
    for (let i = wordIndex + 1; i < this.words.length; i++) {
        if (this.words[i].value !== '') {
            secondWordIndex = i
            i = this.words.length
        }
    }
    let secondWord = this.words[secondWordIndex]
    firstWord.value = firstWord.value + secondWord.value // merge value

    // remove timeBox between both merged words
    for (let j = secondWordIndex; j > wordIndex; j--) {
        this.words[j].value = ''
    }
}

// Split a word in a turn
async function splitWord(newContentArray, changeIndex) {
    // Words array without empty words
    let turnObjWords = this.words.filter(word => word.value !== '')

    // Get Word data before splitting it
    let initWord = turnObjWords[changeIndex]
    let initWordId = initWord.wordId
    let initWordStartTime = parseFloat(initWord.startTime.toFixed(2))
    let initWordEndTime = parseFloat(initWord.endTime.toFixed(2))

    let initWordIndex = this.words.findIndex(word => word.wordId === initWordId)

    // Get splitted words syllables
    let initWordSyllable = await getSyllable(newContentArray[changeIndex])
    let newWordSyllable = await getSyllable(newContentArray[changeIndex + 1])
    let nbSyllables = initWordSyllable + newWordSyllable


    // Calculate Time diff between the two words
    let timeDiff = parseFloat((initWordEndTime - initWordStartTime).toFixed(2)) / nbSyllables

    // Insert new Word
    let newWordObj = {
        turnId: initWord.turnId,
        wid: uuidv4(),
        stime: parseFloat((initWordStartTime + timeDiff * initWordSyllable).toFixed(2)),
        etime: initWordEndTime,
        word: newContentArray[changeIndex + 1]
    }
    this.words.splice(initWordIndex + 1, 0, new Word(newWordObj))

    // Update splitted init word
    initWord.value = newContentArray[changeIndex]
    initWord.endTime = parseFloat((initWordStartTime + timeDiff * initWordSyllable).toFixed(2))
}

// split a turn after a word index
function splitAfterIndex(index) {
    this.dispatchEvent(new CustomEvent('turn_split', {
        detail: {
            turnId: this.turnId,
            wordIndex: index
        }
    }))
}

// Insert a word after a word index
async function addWordsAfterIndex(changeIndex, wordsToInsert, wordLastPos) {
    let prevWord = this.words[changeIndex]
    let nextWord = null
    if (!wordLastPos) nextWord = this.words[changeIndex + 1]

    // Get timeBox limits
    let newStime = parseFloat(prevWord.endTime.toFixed(2))
    let newEtime = wordLastPos ? parseFloat(prevWord.endTime.toFixed(2)) : parseFloat(nextWord.startTime.toFixed(2))

    // Get number of syllables to insert
    let nbSyllables = 0
    for (let word of wordsToInsert) {
        nbSyllables += word.syl
    }
    let timeDiff = 0

    if (nbSyllables > 0) {
        timeDiff = parseFloat((newEtime - newStime).toFixed(2)) / nbSyllables
    }

    // Calculate Time diff between the two words
    createWords.call(this, newStime, timeDiff, changeIndex, wordsToInsert)
}

// Replace empty timebox by new word value
function putWordsInTimebox(timeBoxAvailable, wordsToInsert) {
    for (let i = 1; i <= wordsToInsert.length; i++) {
        let wordVal = wordsToInsert[i - 1].value
        let targetWord = timeBoxAvailable[timeBoxAvailable.length - 1 - (wordsToInsert.length - i)]
        targetWord.value = wordVal
    }
}

// Reset timebox between two timestamps to reallocate them
function resetTimeBox(timeBoxAvailable, wordsToInsert) {
    // Get new total time box
    let newStime = parseFloat(timeBoxAvailable[0].startTime.toFixed(2))
    let newEtime = parseFloat(timeBoxAvailable[timeBoxAvailable.length - 1].endTime.toFixed(2))

    // Get Word index to change
    let changeIndex = this.words.findIndex(word => word.wordId === timeBoxAvailable[0].wordId) - 1

    // Get number of syllables to insert
    let nbSyllables = 0
    for (let word of wordsToInsert) {
        nbSyllables += word.syl
    }
    // Get time diff by syllable
    let timeDiff = 0
    if (nbSyllables > 0) {
        timeDiff = parseFloat((newEtime - newStime).toFixed(2)) / nbSyllables
    }

    // Remove empty words
    for (let i = timeBoxAvailable.length - 1; i >= 0; i--) {
        let wordIndex = this.words.findIndex(w => w.wordId === timeBoxAvailable[i].wordId)
        this.words.splice(wordIndex, 1)
    }
    createWords.call(this, newStime, timeDiff, changeIndex, wordsToInsert)
}

// Create a new word
function createWords(newStime, timeDiff, changeIndex, wordsToInsert) {
    let sylLength = 0
    for (let j = 0; j < wordsToInsert.length; j++) {
        let newWordObj = {
            wid: uuidv4(),
            stime: parseFloat((newStime + (timeDiff * sylLength)).toFixed(2)),
            etime: 0,
            word: wordsToInsert[j].value,
            turnId: this.turnId
        }
        sylLength += wordsToInsert[j].syl
        newWordObj.etime = parseFloat((newStime + (sylLength * timeDiff)).toFixed(2))
        this.words.splice(changeIndex + j + 1, 0, new Word(newWordObj))
    }
}

// Handle simple and double click
function handleClick(e) {
    this.clickNb += 1
        // Simple click
    if (this.clickNb === 1) {
        this.clickTimer = setTimeout(() => {
            this.clickNb = 0
            if (!this.focused && e.target.classList.contains('word')) {
                let selection = window.getSelection()
                let firstWord = selection.baseNode
                let lastWord = selection.focusNode
                let comapreWords = comapreSelection.call(this, firstWord, lastWord)
                if (comapreWords[0] !== undefined) {
                    let firstSpanCoord = comapreWords[0].wordSpan.getBoundingClientRect()
                    this.dispatchEvent(new CustomEvent('click_word', {
                        detail: {
                            spanCoord: firstSpanCoord,
                            words: comapreWords
                        }
                    }))
                    for (let word of comapreWords) {
                        word.wordSpan.classList.add('selected')
                    }
                }
            } else if (!this.focused && !e.target.classList.contains('word')) {
                this.dispatchEvent(new CustomEvent('toolbox_close', {}))
            }
        }, 400)
    }
    // Double click
    else {
        clearTimeout(this.clickTimer)
        this.clickNb = 0
        this.turnDiv.setAttribute('contentEditable', true)
        this.renderWords('txt')
        this.turnDiv.focus()
        this.focused = true
    }
}

function comapreSelection(firstWord, lastWord) {
    let firstSpan = null
    let lastSpan = null
    if (firstWord.nodeName === '#text') {
        firstSpan = firstWord.parentElement
    }
    if (lastWord.nodeName === '#text') {
        lastSpan = lastWord.parentElement
    }
    let firstSpanId = firstSpan.getAttribute('id')
    let lastSpanId = lastSpan.getAttribute('id')
    if (firstSpanId === lastSpanId) {
        return [this.words.find(word => word.wordId === firstSpanId)]
    } else {
        let firstWordIndex = this.words.findIndex(word => word.wordId === firstSpanId)
        let lastWordIndex = this.words.findIndex(word => word.wordId === lastSpanId)
        return this.words.slice(firstWordIndex, lastWordIndex + 1)
    }
}

function handleInput(e) {
    if (e.inputType === 'insertParagraph') {
        prepareSplitTurn.call(this)
    } else {
        compareTurnContent.call(this)
    }
}

function handleSpeakerClick(e) {
    let spkCoord = this.speakerDiv.getBoundingClientRect()
    this.dispatchEvent(new CustomEvent('click_spk', {
        detail: {
            spkCoord: spkCoord,
            turnId: this.turnId,
            turnStartTime: this.startTime,
            turnEndTime: this.endTime,
            speakerId: this.speakerId
        }
    }))
}