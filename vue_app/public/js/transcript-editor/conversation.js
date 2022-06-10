import { v4 as uuidv4 } from 'uuid';
import Turn from './turn.js'

export default class Conversation extends EventTarget {
    constructor(data) {
        super()
        this.wrapperId = 'tanscript-editor-conversation'
        this.conversationWrapper = null
        this.conversationId = data.conversationId
        this.language = data.language
        this.turns = []
        this.renderedTurns = []
        this.conversationObj = data.conversation
        this.pagination = data.pagination
        this.paginationPage = 0

        for (let sentence of this.conversationObj.text) {
            let turn = new Turn({...sentence, language: this.language, speakerName: getSpeakerNameById.call(this, sentence.speaker_id) })
            this.turns.push(turn)
        }

        // Event for merge / split
        this.addEventListener('turn_update', () => {
            udpateTurn.call(this)
        })
        this.render()
    }

    clean() {
        this.unbindTurnsEvents()
        let wrapper = document.getElementById(this.wrapperId)
        wrapper.innerHTML = ''
    }

    render() {
        this.renderedTurns = []
        this.conversationWrapper = document.getElementById(this.wrapperId)

        // Pagination enabled 
        if (this.pagination > 0) {
            let startIndex = this.paginationPage * this.pagination
            let endIndex = startIndex + this.pagination - 1 > this.turns.length - 1 ? this.turns.length - 1 : startIndex + this.pagination - 1

            // Clean all turns
            for (let turn of this.turns) {
                turn.clean()
            }

            // Render turns (by page)
            for (let i = startIndex; i <= endIndex; i++) {
                if (this.pagination > 0 &&
                    this.paginationPage >= 0) {
                    this.turns[i].render('span', this.wrapperId)
                    this.renderedTurns.push(this.turns[i])
                }
            }
            this.renderPagination()
        } else {
            // Clean all turns
            for (let turn of this.turns) {
                turn.clean()
                turn.render('span', this.wrapperId)
                this.renderedTurns.push(turn)
            }
        }

        this.bindTurnsEvents()

        this.conversationWrapper.onclick = (e) => {
            // Close toolbox if click on "blank" field
            let elem = e.target
            let elemId = elem.getAttribute('id')
            if (elem.classList.contains('conversation-speaker') || elemId === this.wrapperId || elemId === 'conversation-pagination') {
                this.dispatchEvent(new CustomEvent('toolbox_close'), {})
            }
        }
    }

    // Create events listeners on rendered turns
    bindTurnsEvents() {
        this.addTurnUpdateHandler()
        this.addTurnSplitHandler()
        this.addTurnMergeHandler()
        this.addTurnCloseToolboxHandler()
        this.addTurnSpkClickHandler()
        this.addTurnWordClickHandler()
    }

    // Remove events listeners on rendered turns
    unbindTurnsEvents() {
        this.removeTurnSplitHandler()
        this.removeMergeSplitHandler()
        this.removeTurnUpdateHandler()
        this.removeTurnCloseToolboxHandler()
        this.removeTurnSpkClickHandler()
        this.removeTurnWordClickHandler()
    }

    // Word click
    addTurnWordClickHandler() {
        this.handleWordClick = wordClick.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('click_word', this.handleWordClick)
        }
    }
    removeTurnWordClickHandler() {
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('click_word', this.handleWordClick)
        }
    }

    // SPk click
    addTurnSpkClickHandler() {
        this.handleSpkClick = spkClick.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('click_spk', this.handleSpkClick)
        }
    }
    removeTurnSpkClickHandler() {
        this.handleSpkClick = spkClick.bind(this)
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('click_spk', this.handleSpkClick)
        }
    }

    // Turn close toolbox
    addTurnCloseToolboxHandler() {
        this.handleTurnCloseToolbox = closeToolbox.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('toolbox_close', this.handleTurnCloseToolbox)
        }
    }
    removeTurnCloseToolboxHandler() {
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('toolbox_close', this.handleTurnCloseToolbox)
        }
    }

    // Update turn event
    addTurnUpdateHandler() {
        this.handleTurnUpdate = udpateTurn.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('turn_update', this.handleTurnUpdate)
        }
    }
    removeTurnUpdateHandler() {
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('turn_update', this.handleTurnUpdate)
        }
    }

    // Split turn event
    addTurnSplitHandler() {
        this.handleTurnSplit = splitTurn.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('turn_split', this.handleTurnSplit)
        }
    }
    removeTurnSplitHandler() {
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('turn_split', this.handleTurnSplit)
        }
    }

    // Merge turn event
    addTurnMergeHandler() {
        this.handleTurnMerge = mergeTurnWithPrevious.bind(this)
        for (let turn of this.renderedTurns) {
            turn.addEventListener('turn_merge_with_previous', this.handleTurnMerge)
        }
    }
    removeMergeSplitHandler() {
        for (let turn of this.renderedTurns) {
            turn.removeEventListener('turn_merge_with_previous', this.handleTurnMerge)
        }
    }

    renderPagination() {
        // pagination wrapper
        let paginationDiv = document.createElement('div')
        paginationDiv.setAttribute('id', 'conversation-pagination')

        // pagination previous
        let pagiPrev = document.createElement('button')
        pagiPrev.setAttribute('id', 'pagination-prev')
        paginationDiv.append(pagiPrev)
        this.conversationWrapper.append(paginationDiv)

        // Pagination pages numbers
        let nbPages = Math.ceil(this.turns.length / this.pagination)
        for (let i = 1; i <= nbPages; i++) {
            let pageBtn = document.createElement('button')
            pageBtn.classList.add('pagination-btn')
            if (i === this.paginationPage + 1) {
                pageBtn.classList.add('active')
            }
            pageBtn.innerHTML = i

            paginationDiv.append(pageBtn)
            pageBtn.onclick = (e) => {
                if (!pageBtn.classList.contains('active')) {
                    this.paginationGoToPage(i - 1)
                }
            }
        }
        // Pagination next
        let pagiNext = document.createElement('button')
        pagiNext.setAttribute('id', 'pagination-next')
        paginationDiv.append(pagiNext)

        pagiNext.onclick = (e) => {
            this.paginationNext()
        }
        pagiPrev.onclick = (e) => {
            this.paginationPrev()
        }
    }
    paginationNext() {
        if (this.paginationPage <= Math.floor(this.turns.length / this.pagination)) {
            this.paginationGoToPage(this.paginationPage + 1)
        }
    }
    paginationPrev() {
        if (this.paginationPage > 0) {
            this.paginationGoToPage(this.paginationPage - 1)
        }
    }
    paginationGoToPage(pageIndex) {
        this.clean()
        this.paginationPage = pageIndex
        let turnIndex = this.paginationPage * this.pagination
        let playerTime = this.turns[turnIndex].startTime + 0.0001
        this.dispatchEvent(new CustomEvent('player_update_currenttime', {
            detail: {
                time: playerTime
            }
        }))
        this.render()
    }

    updateSpeaker(e) {
        let updateMode = e.detail.updateMode
        let currentSpeaker = e.detail.currentSpeaker
        let turnId = e.detail.turnId
        let allSpeakers = this.conversationObj.speakers
        let targetSpeaker = allSpeakers.find(spk => spk.speaker_id === e.detail.targetSpeaker)

        if (updateMode === 'turn') {
            let targetTurn = this.turns.find(turn => turn.turnId === turnId)
            targetTurn.speakerId = targetSpeaker.speaker_id
            targetTurn.speakerName = targetSpeaker.speaker_name
        } else if (updateMode === 'conversation') {
            let targetTurns = this.turns.filter(turn => turn.speakerId === currentSpeaker)
            for (let turn of targetTurns) {
                turn.speakerId = targetSpeaker.speaker_id
                turn.speakerName = targetSpeaker.speaker_name
            }
        }
        updateConversationObj.call(this)
        this.clean()
        this.render()
        this.dispatchEvent(new CustomEvent('conversation_update', {}))
    }
    createAndUpdateSpeaker(data) {
        let currentSpeaker = data.currentSpeaker
        let speakerName = data.speaker_name
        let turnEndTime = data.turnEndTime
        let turnStartTime = data.turnStartTime
        let updateMode = data.updateMode
        let turnId = data.turnId

        // Create new speaker
        let newSpkObj = {
            speaker_id: uuidv4(),
            speaker_name: speakerName,
            stime: turnStartTime,
            etime: turnEndTime - turnStartTime <= 5 ? turnEndTime : turnStartTime + 5
        }
        this.conversationObj.speakers.push(newSpkObj)
        this.dispatchEvent(new CustomEvent('speaker_created', {}))

        // update speaker(s) in conversation text
        setTimeout(() => {
            this.updateSpeaker({
                detail: {
                    updateMode,
                    turnId,
                    currentSpeaker,
                    targetSpeaker: newSpkObj.speaker_id
                }
            })
        })
    }
}

function updateConversationObj() {
    let text = []
    for (let turn of this.turns) {
        let words = []
        let turnObj = {
            speaker_id: turn.speakerId,
            turn_id: turn.turnId,
            raw_segment: turn.raw_segment,
            segment: turn.segment,
            words: []
        }
        let newSegment = ''

        for (let word of turn.words) {
            let wordObj = {
                wid: word.wordId,
                stime: word.startTime,
                etime: word.endTime,
                word: word.value,
                confidence: word.confidence,
                highlights: [], // todo,
                keywords: [] //todo
            }
            words.push(wordObj)
            if (word.value !== '') newSegment += word.value + ' '
        }
        turnObj.words = words
        turnObj.segment = newSegment.trim()
        text.push(turnObj)
    }
    this.conversationObj.text = text
}

function getSpeakerNameById(speakerId) {
    let speaker = this.conversationObj.speakers.find(spk => spk.speaker_id === speakerId)
    return speaker.speaker_name
}

function splitTurn(e) {
    let turnId = e.detail.turnId
    let wordIndex = e.detail.wordIndex
    let targetTurn = this.turns.find(turn => turn.turnId === turnId)
    let targetTurnIndex = this.turns.findIndex(turn => turn.turnId === turnId)
    let newTurnWords = []
    let newTurnId = uuidv4()
    let currentTurnEndTime = targetTurn.words[wordIndex].endTime
        // get new turn words
    for (let i = wordIndex + 1; i < targetTurn.words.length; i++) {
        targetTurn.words[i].turnId = newTurnId
        newTurnWords.push(targetTurn.words[i])
    }

    // Remove words from current Turn
    for (let j = targetTurn.words.length - 1; j > wordIndex; j--) {
        targetTurn.words.splice(j, 1)
    }

    let newTurnObj = {
        turn_id: newTurnId,
        speaker_id: targetTurn.speakerId,
        speakerName: getSpeakerNameById.call(this, targetTurn.speakerId),
        words: newTurnWords,
        language: this.language
    }

    targetTurn.words[wordIndex].endTime = currentTurnEndTime
    this.turns.splice(targetTurnIndex + 1, 0, new Turn(newTurnObj))
    this.clean()
    this.render()
    this.dispatchEvent(new CustomEvent('turn_update', {}))
}

function mergeTurnWithPrevious(e) {
    let turnIndex = this.turns.findIndex(turn => turn.turnId === e.detail.turnId)
    let currentTurn = this.turns[turnIndex]
    let previousTurn = this.turns[turnIndex - 1]
    previousTurn.endTime = currentTurn.endTime
    previousTurn.words = [...previousTurn.words, ...currentTurn.words]
    this.turns.splice(turnIndex, 1)
    this.clean()
    this.render()
    this.dispatchEvent(new CustomEvent('turn_update', {}))

}

function udpateTurn(e) {
    updateConversationObj.call(this)
    this.dispatchEvent(new CustomEvent('conversation_update', { msg: 'turn_update' }))
}

function closeToolbox() {
    this.dispatchEvent(new CustomEvent('toolbox_close', {}))
}

function spkClick(e) {
    this.dispatchEvent(new CustomEvent('open_spk_toolbox', { detail: e.detail }))
}

function wordClick(e) {
    this.dispatchEvent(new CustomEvent('open_word_toolbox', { detail: e.detail }))
}