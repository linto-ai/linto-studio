import AudioPlayer from './audio-player.js'
import Conversation from './conversation.js'
import EditorSettings from './editor-settings.js'
import Syllabic from './lib/syllabic/syllabic.js'
import Toolbox from './toolbox.js'
import SpeakerToolbox from './spk-toolbox.js'

export default class Editor extends EventTarget {
    constructor(data) {
        super()
        this.editorWrapper = document.getElementById(data.wrapperId)

        this.editorSettingsWrapper = document.createElement('div')
        this.editorSettingsWrapper.setAttribute('id', 'editor-settings')
        this.editorWrapper.append(this.editorSettingsWrapper)

        // Create converastion wrapper
        this.conversationWrapper = document.createElement('div')
        this.conversationWrapper.setAttribute('id', 'tanscript-editor-conversation')
        this.editorSettingsWrapper.classList.add('flex')
        this.editorSettingsWrapper.classList.add('row')
        this.editorWrapper.append(this.conversationWrapper)

        this.editorSettings = new EditorSettings({ wrapperId: 'editor-settings', pagination: data.pagination })

        // Conversation
        this.conversationId = data.conversationId
        this.conversation = new Conversation({
                conversationId: data.conversationId,
                language: data.language,
                pagination: data.pagination,
                conversation: data.conversation
            })
            // language
        this.language = data.language || 'fr-FR'

        // Audio player
        this.audioPlayer = new AudioPlayer({
            audio: data.conversation.audio,
            playerWrapperId: data.playerWrapperId
        })
        this.timeWatcher = null

        // Words/selection toolbox
        this.toolbox = new Toolbox()

        // Speaker toolbox
        this.spkToolbox = new SpeakerToolbox()
        this.spkToolbox.addEventListener('update_speaker', (e) => {
            this.conversation.updateSpeaker(e)
        })
        this.spkToolbox.addEventListener('create_and_update_speaker', (e) => {
            this.conversation.createAndUpdateSpeaker(e.detail)
        })

        // Audio player Events
        this.audioPlayer.player.addEventListener('timeupdate', (e) => {
            this.audioPlayer.updateTimeline(this.audioPlayer.player.currentTime)
            this.updateCurrentTurn()
            this.updatePlayedWord()
        })
        this.audioPlayer.player.addEventListener('playing', () => {
            this.audioPlayer.playBtn.classList.add('playing')
            this.audioPlayer.playBtn.classList.remove('pause')
            this.audioPlayer.audioState = 'playing'
            this.startWatchTime()
        })
        this.audioPlayer.player.addEventListener('pause', () => {
            this.audioPlayer.playBtn.classList.add('pause')
            this.audioPlayer.playBtn.classList.remove('playing')
            this.audioPlayer.audioState = 'pause'
            this.stopWatchTime()
        })

        // Conversation Events
        this.bindConversationEvents()

        // Toolbox Events
        this.toolbox.addEventListener('play_from_word', (e) => {
            this.audioPlayer.player.currentTime = e.detail.time
            this.audioPlayer.player.play()
        })

        this.editorSettings.addEventListener('pagination_settings_update', (e) => {
            this.pagination = e.detail.value
            this.conversation.pagination = this.pagination
            this.conversation.clean()
            this.conversation.render()
        })
    }

    static syllabic = new Syllabic()

    startWatchTime() {
        this.timeWatcher = setInterval(() => {
            this.updatePlayedWord()
        }, 50)
    }
    stopWatchTime() {
        clearInterval(this.timeWatcher)
    }
    updateCurrentTurn() {
        let currentTime = this.audioPlayer.player.currentTime
        let currentTurn = this.conversation.turns.find(turn => turn.startTime <= currentTime && turn.endTime >= currentTime)

        if (currentTurn !== undefined) {
            let currentTurnIndex = this.conversation.turns.findIndex(turn => turn.turnId === currentTurn.turnId)
            let currentPage = this.conversation.paginationPage
            let currentPagination = this.conversation.pagination
            let turnPage = Math.floor(currentTurnIndex / currentPagination)
            if (turnPage !== currentPage) {
                this.conversation.paginationGoToPage(turnPage)
            }
        }
    }
    closeAllToolbox() {
        this.toolbox.hide()
        this.spkToolbox.hide()
    }
    updatePlayedWord() {

        // TODO > optimize it to avoid a full conversation loop

        let currentTime = this.audioPlayer.player.currentTime
        for (let i = 0; i < this.conversation.turns.length; i++) {
            /*if (this.conversation.turns[i].startTime <= currentTime && this.conversation.turns[i].endTime >= currentTime) {
                if (i > 0 && this.conversation.pagination % (i - 1) !== 0) {
                    this.conversation.turns[i - 1].renderPlayedWord(currentTime)
                }
                if (i < this.conversation.turns.length - 1 && this.conversation.pagination % (i + 1) !== 0) {
                    this.conversation.turns[i + 1].renderPlayedWord(currentTime)
                }*/
            this.conversation.turns[i].renderPlayedWord(currentTime)
        }
        //}
    }
    bindConversationEvents() {
        this.conversation.addEventListener('open_word_toolbox', clickWord.bind(this))

        this.conversation.addEventListener('open_spk_toolbox', clickSpk.bind(this))

        this.conversation.addEventListener('player_update_currenttime', (e) => {
            this.audioPlayer.player.currentTime = e.detail.time
        })
        this.conversation.addEventListener('toolbox_close', (e) => {
            this.closeAllToolbox()
        })
    }
    addClickWordEvent() {
        this.conversation.addEventListener('click_word', this.clickWordEvent)
    }
    addClickSpkEvent() {
        this.clickSpkEvent = clickSpk.bind(this)
        for (let turn of this.conversation.turns) {
            turn.addEventListener('click_spk', this.clickSpkEvent)
        }
    }
}

function clickWord(e) {
    this.closeAllToolbox()
    this.toolbox.show(e.detail.spanCoord.top, e.detail.spanCoord.left, e.detail.words)
}

function clickSpk(e) {
    this.closeAllToolbox()
    this.spkToolbox.show(e.detail.spkCoord.top, e.detail.spkCoord.left, e.detail.turnId, e.detail.turnStartTime, e.detail.turnEndTime, e.detail.speakerId, this.conversation.conversationObj.speakers)
}