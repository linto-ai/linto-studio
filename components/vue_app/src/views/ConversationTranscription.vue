<template>
  <div class="flex col no-padding-left" v-if="dataLoaded">
    <div class="flex1 flex row" id="transcription-wrapper">
      <!-- LEFT PART -->
      <div class="flex col conversation-infos-container">
        <div class="flex row" style="margin-bottom: 20px;">
          <a :href="`/interface/conversation/${convoId}`" class="btn btn--txt-icon blue"> 
            <span class="label">{{ $t('buttons.conversation_landing') }}</span>
            <span class="icon icon__backto"></span>
          </a>
        </div>
        <h2>{{ $t('page.conversation_transcription.h2') }}</h2>
        <div class="conversation-infos-items">
            <!-- Keywords -->
          <div class="conversation-infos-item">
            <div class="conversation-infos-item--label">
              <div class="flex row">
                <span class="conversation-infos-item--icon conversation-infos-item--icon__keywords"></span>
                <span class="conversation-infos-item--title flex1">{{ $t('array_labels.keywords') }}</span>
                <span class="conversation-infos-item--icon conversation-infos-item--icon__visible"></span>
              </div>
            </div>
            <div class="flex col transcription-options" v-if="!!keywordsOptions && keywordsOptions.length > 0">
              <div class="flex row transcription-options--item" v-for="kw in keywordsOptions" :key="kw.kid">
                <span class="transcription-options--item-label flex1">{{ kw.label }}</span>
                <button 
                  class="transcription-options--item-checkbox"
                  :class="kw.selected ? 'selected' : ''"
                  @click="updateKeywords(kw)"
                ></button>
              </div>
            </div>
          </div>
            <!-- Highlights -->
          <div class="conversation-infos-item">
            <div class="conversation-infos-item--label">
              <div class="flex row">
                <span class="conversation-infos-item--icon conversation-infos-item--icon__highlights"></span>
                <span class="conversation-infos-item--title flex1">{{ $t('array_labels.highlights') }}</span>
                <span class="conversation-infos-item--icon conversation-infos-item--icon__colors"></span>
                <span class="conversation-infos-item--icon conversation-infos-item--icon__visible"></span>
              </div>
            </div>
            <div class="flex col transcription-options" v-if="highlightsOptions.length > 0">
              <div class="flex row transcription-options--item" v-for="hl in highlightsOptions" :key="hl.hid">
                <span class="transcription-options--item-label flex1">{{ hl.label }}</span>
                <input 
                  type="color" 
                  :value="hl.color" 
                  class="transcription-options--item-color"
                  @change="updateHighlightColor($event, hl)"
                >
                <button 
                  class="transcription-options--item-checkbox"
                  :class="hl.selected === true ? 'selected' : ''"
                  @click="updateHighlight(hl)"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END LEFT PART -->
      <!-- RIGHT PART -->
      <div class="flex1 flex col transcritpion-container">
        <div id="transcription-loader" class="flex col" :class="refreshing === true ? 'visible': 'hidden'">
            <span class="icon loader"></span>
        </div>
        <div class="flex row">
          <h1 style="padding: 0;" class="flex row flex1">{{ convo.name }}</h1>
          <div class="flex row flex1 edition__btns" v-if="!userAccess.readOnly">
            <span class="edition__btns-label">{{ $t('page.conversation_transcription.edition_mode') }} : </span>
            <button 
              @click="editionMode = true"
              :class="editionMode ? 'enabled' : 'disabled'"
              class="edition__btn-toggle"
            >
              <span class="edition__btn-toggle-circle" :class="editionMode ? 'enabled' : 'disabled'"></span>
            </button>
            <button 
              v-if="editionMode" 
              @click="cancelEditionMode()" 
              class="btn--icon btn--icon__cancel-edition grey"
            >
              <span class="icon icon--cancel"></span>
            </button>
            <button 
              v-if="editionMode" 
              @click="validateEdition()" 
              class="btn--icon btn--icon__apply-edition"
            >
              <span class="icon icon--apply"></span>
            </button>
          </div>
        </div>
        <!-- FILTERS -->
        <div class="transcription-filters flex row">
            <!-- by speaker -->
            <div class="flex col flex1">
              <span class="transcription-filters__select-label">{{ $t('array_labels.speakers')}}:</span>
              <div class="flex row">
                <select id="filter-speaker" class="transcription-filters__select flex1" v-model="convoFilter.speaker" :disabled="editionMode ? true: false">
                  <option v-for="spk in convo.speakers" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                  <option value="">{{ $t('array_labels.none') }}</option>
                </select>
                <button v-if="convoFilter.speaker !== '' && !editionMode" @click="convoFilter.speaker = ''" class="cancel-filter-btn"></button>
              </div>
            </div>
            <!-- by highlights -->
            <div class="flex col flex1">
              <span class="transcription-filters__select-label">{{ $t('array_labels.highlights') }}:</span>
              <div class="flex row">
                <select id="filter-highlights" class="transcription-filters__select flex1" v-model="convoFilter.highlights" :disabled="editionMode ? true: false">
                  <option v-for="hl in convo.highlights" :key="hl.hid" :value="hl.hid">{{ hl.label }}</option>
                  <option value="">{{ $t('array_labels.none') }}</option>
                </select>
                <button v-if="convoFilter.highlights !== '' && !editionMode" @click="convoFilter.highlights = ''" class="cancel-filter-btn"></button>
              </div>
            </div>
            <!-- by keywords -->
            <div class="flex col flex1">
              <span class="transcription-filters__select-label">{{ $t('array_labels.keywords') }}:</span>
              <div class="flex row">
                <select id="filter-highlights" class="transcription-filters__select flex1" v-model="convoFilter.keywords" :disabled="editionMode ? true: false">
                  <option v-for="kw in convo.keywords" :key="kw.kid" :value="kw.kid">{{ kw.label }}</option>
                  <option value="">{{ $t('array_labels.none') }}</option>
                </select>
                <button v-if="convoFilter.keywords !== '' && !editionMode" @click="convoFilter.keywords = ''" class="cancel-filter-btn"></button>
            </div>
          </div>
          <div class="transcription-export-btn-container flex row">
            <button @click="exportTranscription()" class="btn btn--txt-icon blue">
              <span class="label">{{ $t('buttons.export') }}</span>
              <span class="icon icon__transcription"></span>
            </button>
          </div>
        </div>
        <!-- TRANSCRIPTION -->
        <Transcription
          :currentTurn="currentTurn" 
          :currentTime="currentTime" 
          :convoText="convoText"
          :convoId="convo._id"
          :convoSpeakers="convo.speakers"
          :editionMode="editionMode" 
          :speakersArray="speakersArray"
          :key="refreshConversation"
          :convoIsFiltered="convoIsFiltered"
          :highlightsOptions="highlightsOptions"
          :keywordsOptions="keywordsOptions"
          :userAccess="userAccess"
          v-if="!!convo.text && convo.text.length > 0 && speakersArray.length > 0"
        ></Transcription>
      </div>
      <HighlightModal :conversationId="convoId"></HighlightModal>
      <EditSpeakerTranscriptionFrame></EditSpeakerTranscriptionFrame>

      <SelectedTextToolbox :conversationId="convoId" :editionMode="editionMode"></SelectedTextToolbox>

      <TranscriptionKeyupHandler
        :editionMode="editionMode"
      ></TranscriptionKeyupHandler>
      <KeyboardCommandsFrame></KeyboardCommandsFrame>
      <!-- Modals -->
      <ModalMergeSentences></ModalMergeSentences>
      <ModalSplitTurns></ModalSplitTurns>
      <ModalMergeSpeakersWithTarget :convoId="convoId"></ModalMergeSpeakersWithTarget>

    </div>
    <div class="flex row">
      <!-- AUDIO PLAYER -->
      <AudioPlayer 
        :audioPath="audioPath" 
        :duration="convo.audio.duration" 
        :editionMode="editionMode" 
        :nbTurns="convo.text.length" 
        :currentTurn="currentTurn" 
        :convoIsFiltered="convoIsFiltered"
        :convoText="convoText"
      ></AudioPlayer>
    </div>
  </div>
  <div v-else>Loading</div>
</template>
<script>
import ModalMergeSentences from '@/components/ModalMergeSentences.vue'
import EditSpeakerTranscriptionFrame from '@/components/EditSpeakerTranscriptionFrame.vue'
import HighlightModal from '@/components/HighlightModal.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import SelectedTextToolbox from '@/components/SelectedTextToolbox.vue'
import ModalSplitTurns from '@/components/ModalSplitTurns.vue'
import Transcription from '@/components/Transcription.vue'
import TranscriptionKeyupHandler from '@/components/TranscriptionKeyupHandler.vue'
import KeyboardCommandsFrame from '@/components/KeyboardCommandsFrame.vue'
import ModalMergeSpeakersWithTarget from '@/components/ModalMergeSpeakersWithTarget.vue'

import _ from 'lodash'
import { bus } from '../main.js'
export default {
  data () {
    return {
      convoLoaded: false,
      usersLoaded: false,
      currentTime: 0,
      cursorX: 0,
      cursorY: 0,
      showSelectToolbox: false,
      editionMode: false,
      editionObj: [],
      clickTime: 0,
      selectionObj: null,
      keywordsOptions: [],
      refreshConversation: 1,
      editConvoTmp: [],
      filterSpeaker: '',
      convoFilter: {
        speaker: '',
        highlights:'',
        keywords:''
      },
      highlightsOptions: [],
      refreshing: false
    }
  },
  async mounted () {
    // Set conversation Id
    this.convoId = this.$route.params.convoId
    
    // Get conversation
    await this.dispatchConversations()
    await this.dispatchUsersInfo()

    // BUS listeners
    
    // Close navigation menu
    bus.$emit('vertical_nav_close', {}) 
    
    bus.$on('update_speaker', async (data) => {
      await this.dispatchConversations()
      this.refreshConversation++
      this.refreshHighlights()
    })
    
    bus.$on('show_highlight', (data) => {
        let hid = data.hid
        let targetHl = this.highlightsOptions.find(hl => hl.hid === hid)
        this.updateHighlight(targetHl)
    })

    // Show Loader on transcription
    bus.$on('loading_conversation', (data) => {
      this.refreshing = true
    })

    // Reload the conversation with updated data
    bus.$on('refresh_conversation', async (data) => {
      console.log('>>> Refresh conversation', data)
      if(!!data.closeToolBox && data.closeToolBox) {
        bus.$emit('close_selected_toolbox', {})
      }
      await this.dispatchConversations()
      this.refreshConversation++
      setTimeout(()=>{
        this.refreshHighlights()
        if(!!data.turnPos) {
          bus.$emit('scroll_to_turn', {turnPos: data.turnPos})
        } else {
          bus.$emit('scroll_to_turn', {})
        }
        this.refreshing = false
      }, 500)
      
    })
    bus.$on('audio_player_currenttime', (data) => {
      this.currentTime = data.time
    })

    window.editionMode = this.editionMode
  },
  computed: {
    dataLoaded () {
      return this.convoLoaded && this.speakersArray.length > 0 && !!this.userAccess
    },
    convo () {
      return this.$store.getters.conversationById(this.convoId)
    },
    audioPath () {
      return `${process.env.VUE_APP_URL}/${this.convo.audio.filepath}`
    },
    speakersArray () {
      return this.$store.getters.speakersByConversationId(this.convoId)
    },
    currentTurn () {
      if(!!this.convo && !!this.convo.text && this.convo.text.length > 0) {
        let turn = this.convo.text.filter(txt => txt.words[0].stime <= this.currentTime && txt.words[txt.words.length -1].etime >= this.currentTime)
        if(turn.length > 0){
          return turn[0].pos
        }
      }
      return 0
    },
    convoText () { // Return conversation text filtered by speakers, highlights and keywords
      let convoText = this.convo.text
      // Filter by speaker
      if (this.convoFilter.speaker !== '') {
        convoText = convoText.filter(turn => turn.speaker_id === this.convoFilter.speaker)
      }
      // Filter by highlights
      if(this.convoFilter.highlights !== '') {
        let convoTextHl = []
        convoText.map(turn => {
          if(!!turn.words && turn.words.length > 0) {
            turn.words.map(word => {
              if (word.highlights.indexOf(this.convoFilter.highlights) >= 0 && convoTextHl.indexOf(turn) < 0) {
                convoTextHl.push(turn)
              }
            })
          }
        })
        convoText = convoTextHl
      }
      // Filter by keywords
      if(this.convoFilter.keywords !== '') {
        let convoTextKw = []
        convoText.map(turn => {
          if(!!turn.words && turn.words.length > 0) {
            turn.words.map(word => {
              if (word.keywords.indexOf(this.convoFilter.keywords) >= 0 && convoTextKw.indexOf(turn) < 0) {
                convoTextKw.push(turn)
              }
            })
          }
        })
        convoText = convoTextKw
      }
      return convoText
    },
    convoIsFiltered () {
      return (this.convoFilter.speaker !== '' || this.convoFilter.highlights !== '' || this.convoFilter.keywords !== '' )
    },
    userAccess () {
      return this.$store.getters.getUserRightsByConversation(this.convoId)
    }
  },
  watch: {
    convoIsFiltered (data) {
      window.convoIsFiltered = data
      bus.$emit('filter_update', {convoText: this.convoText})
    },
    'convoFilter.speaker' (data) {
      bus.$emit('filter_update', {convoText: this.convoText})
    },
    'convoFilter.highlights' (data) {
      bus.$emit('filter_update', {convoText: this.convoText})
      this.refreshHighlights()
    },
    'convoFilter.keywords' (data) {
      bus.$emit('filter_update', {convoText: this.convoText})
    },
    editionMode (data) {
      window.editionMode = data
      if(data) {
        bus.$emit('close_selected_toolbox', {})
        bus.$emit('disable_text_selection', {})
      } else {
        bus.$emit('enable_text_selection', {})
      }
    },
    'convo.keywords' (data) { // Build keywordsOptions object
      if (data.length > 0) {
        data.map(kw => {
          if (this.keywordsOptions.findIndex(kwo => kwo.kid === kw.kid) >= 0) {
            this.keywordsOptions[this.keywordsOptions.findIndex(kwo => kwo.kid === kw.kid)].label = kw.label
          } else {
            this.keywordsOptions.push({...kw, selected: false, words: []})
          }
        })
        let convo = this.convo.text
        if (convo.length > 0) { 
          for (let turn of convo) {
            if (!!turn.words && turn.words.length > 0) {
              for (let word of turn.words) {
                if (word.keywords.length > 0) {
                  for (let kw of word.keywords) {
                    this.keywordsOptions.find(allKW => allKW.kid === kw).words.push(word.wid)
                  }
                }
              }
            }
          }
        }
      }
    },
    'convo.highlights' (data) { // Build highlightsOptions object
      if (data.length > 0) {
        data.map(hl => {
          if (this.highlightsOptions.findIndex(allhl => allhl.hid === hl.hid) >= 0) {
            this.highlightsOptions[this.highlightsOptions.findIndex(allhl => allhl.hid === hl.hid)].label = hl.label
          } else {
            this.highlightsOptions.push({...hl, selected: false, words: []})
          }
          this.highlightsOptions[this.highlightsOptions.findIndex(allhl => allhl.hid === hl.hid)].words = []
        })
        let convo = this.convo.text
        if (convo.length > 0) { 
          for (let turn of convo) {
            if (!!turn.words && turn.words.length > 0) {
              for (let word of turn.words) {
                if (word.highlights.length > 0) {
                  for (let hl of word.highlights) {
                    this.highlightsOptions.find(allHL => allHL.hid === hl).words.push(word.wid)
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    /*** DOWNLOAD TRANSCRIPTION ***/

    // Create a download link from a generated blob
    downloadTranscription (blob, name = 'transcription.txt') {
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = name
      document.body.appendChild(link)
      link.dispatchEvent(
        new MouseEvent('click', { 
          bubbles: true,
          cancelable: true,
          view: window
        })
      )
      // Remove link from body
      document.body.removeChild(link);
    },
    // Generate a txt file blob from transcription text (filtered or not)
    async exportTranscription () {
      try {
        let payload = {
          speakers: this.convo.speakers,
          highlights: this.convo.highlights,
          keywords: this.convo.keywords,
          name: this.convo.name,
          created: this.convo.created,
          text: this.convoText
        }
        let transcriptionText = this.$options.filters.generateTranscriptionText(payload, this.convoFilter)
        const blob = new Blob([transcriptionText], { type: "text/plain;charset=utf-8"})
        this.downloadTranscription(blob) // Trigger download
      } catch (error) {
        console.error(error)
      }
    },

    /*** KEYWORDS ***/

    // Set/Unset transcription keywords
    updateKeywords (kw) {
      let kwItemIndex = this.keywordsOptions.findIndex(kwo => kwo.kid === kw.kid)
      if (kwItemIndex >= 0) {
        this.keywordsOptions[kwItemIndex].selected = !this.keywordsOptions[kwItemIndex].selected
      }
      bus.$emit('transcription_update_keywords', {keywordsOptions: this.keywordsOptions})
    },

    /*** HIGHLIGHTS ***/

    refreshHighlights () {
      setTimeout(() => {bus.$emit('transcription_update_highlights', {highlightsOptions: this.highlightsOptions})}, 100)
    },
    // Set/Unset transcription highlight
    updateHighlight (hl) {
      let hlItemIndex = this.highlightsOptions.findIndex(hlo => hlo.hid === hl.hid)
      if (hlItemIndex >= 0) {
        this.highlightsOptions[hlItemIndex].selected = !this.highlightsOptions[hlItemIndex].selected
      }
      this.refreshHighlights()
    },
    // Update Highlight color
    async updateHighlightColor (event, hl) {
      try {
        const color = event.srcElement.value
        const payload =  { color }
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/highlight/${hl.hid}`, 'patch', payload)

        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          let hlOptionIndex = this.highlightsOptions.findIndex(hlo => hlo.hid === hl.hid)
          if(hlOptionIndex >= 0) {
            this.highlightsOptions[hlOptionIndex].color = color
          }
          bus.$emit('refresh_conversation', {})
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.msg ? error.msg : 'Error on updating speaker',
          timeout: null
        })
      }
    },

    /*** EDITION MODE ***/

    // Cancel edition mode
    async cancelEditionMode () {
      await this.dispatchConversations()
      this.refreshConversation++
      this.editionMode = false
    },
    async validateEdition() {
      try {
        this.refreshing = true
        this.editionMode = false
        const newObject = this.buildTextObject()
        console.log('newObject', newObject)
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/fulltext`, 'put', {text: newObject})
        if(req.status !== 200) {
            throw req
        } else {
          bus.$emit('refresh_conversation', {})
        }
      } catch (error) {
        console.error(error)
      }
    },
    // build text object for transcription update
    buildTextObject () {
      const allTurns = document.getElementsByClassName('transcription-speaker-sentence')
      let textPayload = []
      for(let turn of allTurns) {
        let turnPayload = {
          speaker_id: turn.getAttribute('data-speaker'),
          turn_id: turn.getAttribute('data-turn-id'),
          pos: parseInt(turn.getAttribute('data-pos')),
          words: []
        }
        let words = turn.childNodes
        let realPos = 0
        for (let i = 0; i < words.length; i++) {
          const wordVal = words[i].innerHTML.replace('&nbsp;', ' ').trim()
          const wordSplit = wordVal.split(' ')

          if (wordSplit[0] === "") { // If words have been deleted
            // console.log('word deleted ?')
            i++
          }

          if (wordSplit.length > 1) { // If words have been added
            // console.log('word added ?')
            for (let j = 0; j < wordSplit.length; j++) {
              let wordObj = {}
              const wordId = words[i].getAttribute('data-word-id')
              const wordOptions = this.getHlAndKwByWordId(wordId)
              wordObj = {
                wid: 'todefine',
                etime: words[i].getAttribute('data-etime') ? words[i].getAttribute('data-etime') : -1,
                stime: words[i].getAttribute('data-stime') ? words[i].getAttribute('data-stime') : -1,
                pos: realPos,
                word: wordSplit[j],
                highlights: wordOptions.highlights,
                keywords: wordOptions.keywords
                
              }
              turnPayload.words.push(wordObj)
              realPos++
            }
          } else if(wordSplit.length === 1 && wordSplit[0] !== "") {
            const wordId = words[i].getAttribute('data-word-id')
            const wordOptions = this.getHlAndKwByWordId(wordId)
            let wordObj = {
              wid: wordId,
              etime: words[i].getAttribute('data-etime'),
              stime: words[i].getAttribute('data-stime'),
              pos: realPos,
              word: wordVal,
              highlights: wordOptions.highlights,
              keywords: wordOptions.keywords
            }
            turnPayload.words.push(wordObj)
            realPos++
          }
        }
        textPayload.push(turnPayload)
      }
      
      return textPayload
    },
    // Get Highlights and Keywords by id
    getHlAndKwByWordId (wordId) {
      let options = {
        highlights: [],
        keywords: []
      }
      this.convo.text.map(turn => {
        turn.words.map(word => {
          if (word.wid === wordId) {
            options.keywords = word.keywords
            options.highlights = word.highlights
          }
        })
      })
      return options
    },

    /*** DISPATCH STORE ***/
    async dispatchConversations () {
      try {
        let getConvos = await this.$options.filters.dispatchStore('getConversations')
        if(getConvos.status === 'success') {
          this.convoLoaded = true
        }
      } catch (error) {
        console.error(error)
      }
    },
    async dispatchUsersInfo () {
      try {
        let getUsers = await this.$options.filters.dispatchStore('getUsers')
        if(getUsers.status === 'success') {
          this.usersLoaded = true
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  components: {
    EditSpeakerTranscriptionFrame,
    AudioPlayer,
    SelectedTextToolbox,
    HighlightModal,
    ModalMergeSentences,
    ModalSplitTurns,
    Transcription,
    TranscriptionKeyupHandler,
    KeyboardCommandsFrame,
    ModalMergeSpeakersWithTarget
  }
}
</script>