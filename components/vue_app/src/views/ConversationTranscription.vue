<template>
  <div class="flex row no-padding-left" v-if="dataLoaded">
    <!-- LEFT PART -->
    <div class="flex col conversation-infos-container">
      <h2>Transcription display options</h2>
      <div class="conversation-infos-items">
          <!-- Keywords -->
        <div class="conversation-infos-item">
          <div class="conversation-infos-item--label">
            <div class="flex row">
              <span class="conversation-infos-item--icon conversation-infos-item--icon__keywords"></span>
              <span class="conversation-infos-item--title flex1">Keywords</span>
              <span class="conversation-infos-item--icon conversation-infos-item--icon__visible"></span>
            </div>
          </div>
          <div class="flex col transcription-options" v-if="!!keywordsOptions && keywordsOptions.length > 0">
              <div class="flex row transcription-options--item" v-for="kw in keywordsOptions" :key="kw._id">
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
              <span class="conversation-infos-item--title flex1">Highlights</span>
              <span class="conversation-infos-item--icon conversation-infos-item--icon__colors"></span>
              <span class="conversation-infos-item--icon conversation-infos-item--icon__visible"></span>
            </div>
          </div>

          <div class="flex col transcription-options" v-if="highlightsOptions.length > 0">
            <div class="flex row transcription-options--item" v-for="hl in highlightsOptions" :key="hl._id">
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
      <div class="flex row" style="margin-bottom: 20px;">
         <a :href="`/interface/conversation/${convoId}`" class="btn btn--txt-icon blue"> 
          <span class="label">Back to conversation</span>
          <span class="icon icon__backto"></span>
        </a>
      </div>
      <h1>{{ convo.name }}</h1>
      <div class="flex row edition__btns">
        <span class="edition__btns-label">Edition mode : </span>
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
       <!-- FILTERS -->
      <div class="transcription-filters flex row">
          <!-- by speaker -->
          <span class="transcription-filters-label">Filters :</span>
          <div class="flex col flex1">
            <span class="transcription-filters__select-label">Speakers:</span>
            <div class="flex row">
              <select id="filter-speaker" class="transcription-filters__select flex1" v-model="convoFilter.speaker">
                <option v-for="spk in convo.speakers" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                <option value="">None</option>
              </select>
              <button v-if="convoFilter.speaker !== ''" @click="convoFilter.speaker = ''" class="cancel-filter-btn"></button>
            </div>
          </div>
          <!-- by highlights -->
          <div class="flex col flex1">
            <span class="transcription-filters__select-label">Highlights:</span>
            <div class="flex row">
              <select id="filter-highlights" class="transcription-filters__select flex1" v-model="convoFilter.highlights">
                <option v-for="hl in convo.highlights" :key="hl._id" :value="hl._id">{{ hl.label }}</option>
                <option value="">None</option>
              </select>
              <button v-if="convoFilter.highlights !== ''" @click="convoFilter.highlights = ''" class="cancel-filter-btn"></button>
            </div>
          </div>
          <!-- by keywords -->
          <div class="flex col flex1">
            <span class="transcription-filters__select-label">Keywords:</span>
            <div class="flex row">
              <select id="filter-highlights" class="transcription-filters__select flex1" v-model="convoFilter.keywords">
                <option v-for="kw in convo.keywords" :key="kw._id" :value="kw._id">{{ kw.label }}</option>
                <option value="">None</option>
              </select>
              <button v-if="convoFilter.keywords !== ''" @click="convoFilter.keywords = ''" class="cancel-filter-btn"></button>
          </div>
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
        v-if="!!convo.text && convo.text.length > 0 && speakersArray.length > 0"
      ></Transcription>
       <div> 
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
    <HighlightModal :conversationId="convoId"></HighlightModal>
    <EditSpeakerTranscriptionFrame></EditSpeakerTranscriptionFrame>

    <SelectedTextToolbox :conversationId="convoId" :content="selectedText" :editionMode="editionMode"></SelectedTextToolbox>

    <TranscriptionKeyupHandler
      :editionMode="editionMode"
    ></TranscriptionKeyupHandler>
    <KeyboardCommandsFrame></KeyboardCommandsFrame>
    <!-- Modals -->
    <ModalMergeSentences></ModalMergeSentences>
    <ModalSplitTurns></ModalSplitTurns>
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
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      convoLoaded: false,
      currentTime: 0,
      selectedText: [],
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
      highlightsOptions: []
    }
  },
  async mounted () {
    
    this.convoId = this.$route.params.convoId
    await this.dispatchStore('getConversations')

    bus.$emit('vertical_nav_close', {})
      
    
    bus.$on('update_speaker', async (data) => {
      await this.dispatchStore('getConversations')
    })

    bus.$on('refresh_conversation', async () => {
      await this.dispatchStore('getConversations')
    })

    bus.$on('audio_player_currenttime', (data) => {
      this.currentTime = data.time
    })

  },
  computed: {
    convo () {
      return this.$store.getters.conversationById(this.convoId)
    },

    audioPath() {
      return `${process.env.VUE_APP_URL}/${this.convo.audio.filepath}`
    },
    speakersArray () {
      let speakersArray = [] 
      if(!!this.convo && !!this.convo.speakers && this.convo.speakers.length > 0) {
        this.convo.speakers.map(speaker => {
          speakersArray.push({
            speaker_id: speaker.speaker_id,
            speaker_name: speaker.speaker_name
          })
        })
      }
      return speakersArray
    },
    currentTurn () {
      let currentTurn = 0
      if(!!this.convo && !!this.convo.text && this.convo.text.length > 0) {
        
        for(let i = 0; i < this.convo.text.length; i++) {
          if (
            i !== this.convo.text.length - 1 && 
            !!this.currentTime && 
            this.convo.text[i].words.length > 0 && 
            this.convo.text[i+1].words.length > 0) {
            if (
              !!this.convo.text[i].words[0].stime && 
              !!this.convo.text[i+1].words[0].stime && 
              this.currentTime >= this.convo.text[i].words[0].stime && 
              this.currentTime < this.convo.text[i+1].words[0].stime) {
              currentTurn = this.convo.text[i].pos
            }
          }
        }
      } 
      return currentTurn
    },
    dataLoaded () {
      return this.convoLoaded && this.speakersArray.length > 0 
    },
    convoText () {
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
    }
  },
  watch: {
    editionMode (data) {
      if(data) {
        bus.$on('close_selected_toolbox', {})
      }
    },
    'convo.keywords' (data) {
      if (data.length > 0) {
        data.map(kw => {
          if (this.keywordsOptions.findIndex(kwo => kwo._id === kw._id) >= 0) {
            this.keywordsOptions[this.keywordsOptions.findIndex(kwo => kwo._id === kw._id)].label = kw.label
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
                    this.keywordsOptions.find(allKW => allKW._id === kw).words.push(word.wid)
                  }
                }
              }
            }
          }
        }
      }
    },
    'convo.highlights' (data) {
      if (data.length > 0) {
        data.map(hl => {
          if (this.highlightsOptions.findIndex(allhl => allhl._id === hl._id) >= 0) {
            
            this.highlightsOptions[this.highlightsOptions.findIndex(allhl => allhl._id === hl._id)].label = hl.label
          } else {
            this.highlightsOptions.push({...hl, selected: false, words: []})
          }
        })
        let convo = this.convo.text
        if (convo.length > 0) { 
          for (let turn of convo) {
            if (!!turn.words && turn.words.length > 0) {
              for (let word of turn.words) {
                if (word.highlights.length > 0) {
                  for (let hl of word.highlights) {
                    this.highlightsOptions.find(allHL => allHL._id === hl).words.push(word.wid)
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
    /* KEYWORDS */
    updateKeywords (kw) {
      let kwItemIndex = this.keywordsOptions.findIndex(kwo => kwo._id === kw._id)
      if (kwItemIndex >= 0) {
        this.keywordsOptions[kwItemIndex].selected = !this.keywordsOptions[kwItemIndex].selected
      }
      bus.$emit('transcription_update_keywords', {keywordsOptions: this.keywordsOptions})
    },
    updateKeyword (kw) {
      let isVisible = false
      let kwItemIndex = this.keywordsOptions.findIndex(kwo => kwo._id === kw._id)
      if (kwItemIndex >= 0) {
        this.keywordsOptions[kwItemIndex].active = !this.keywordsOptions[kwItemIndex].active
        isVisible = this.keywordsOptions[kwItemIndex].active
      }
      // Get words that are in selected highlight
      let wordsInKeywords = []
      if (this.convo.text.length > 0) {
        this.convo.text.map(turn => {
          if(turn.words.length > 0) {
            let wordInKw = turn.words.filter(word => word.keywords.indexOf(kw._id) >= 0)
            if (wordInKw.length > 0) {
              wordInKw.map(winhl => {
                wordsInKeywords.push(winhl.wid)
              })
            }
          }
        })
      }
      if (isVisible) {
        this.setKeyword(wordsInKeywords)
      } else {
        this.unsetKeyword(wordsInKeywords)
      }
    },
    setKeyword (wordsInKeywords) {
      let allWords = document.getElementsByClassName('transcription--word')
      // Set highlights
      for(let span of allWords) {
        let wordId = span.getAttribute('data-word-id')
        if(wordsInKeywords.indexOf(wordId) >= 0) {
          span.classList.add("keyword")
        }
      }
    },
    unsetKeyword (wordsInKeywords) {
      let allWords = document.getElementsByClassName('transcription--word')
      // Set highlights
      for(let span of allWords) {
        let wordId = span.getAttribute('data-word-id')
        if(wordsInKeywords.indexOf(wordId) >= 0) {
          span.classList.remove("keyword")
        }
      }
    },
    /* HIGHLIGHTS */
    updateHighlightColor (event, hl) {
      const color = event.srcElement.value
      let hlOptionIndex = this.highlightsOptions.findIndex(hlo => hlo._id === hl._id)
      if(hlOptionIndex >= 0) {
        this.highlightsOptions[hlOptionIndex].color = color

        // Todo : update model > hl color
        if(this.highlightsOptions[hlOptionIndex].selected) {
          bus.$emit('transcription_update_highlights', {highlightsOptions: this.highlightsOptions})
        }
      }
    },
    updateHighlight (hl) {
      let hlItemIndex = this.highlightsOptions.findIndex(hlo => hlo._id === hl._id)
      if (hlItemIndex >= 0) {
        this.highlightsOptions[hlItemIndex].selected = !this.highlightsOptions[hlItemIndex].selected
      }
      bus.$emit('transcription_update_highlights', {highlightsOptions: this.highlightsOptions})
    },
    /* EDITION MODE */
    cancelEditionMode () {
      this.dispatchStore('getConversations')
      this.refreshConversation++
      this.editionMode = false

    },
    async validateEdition() {
      try {
        this.editionMode = false
        this.editConvoTmp = this.convo

        const newObject = this.buildTextObject()
        console.log('buildTextObject', newObject)
        const updateText = await axios(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/text`, {
          method: 'put', 
          data: {
            convoid: this.convoId,
            text: newObject
            }
          })
          if(updateText.status === 200) {
            this.dispatchStore('getConversations')
            setTimeout(()=>{
              this.refreshConversation++
            }, 300)
          }
      } catch (error) {
        console.error(error)
      }
    },
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
          if (wordSplit[0] === "") {
            // If words have been deleted
            console.log('word deleted ?')
            i++
          }
          if (wordSplit.length > 1) { // If words have been added
            
            console.log('word added ?')
            
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
            // todo
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
    async dispatchStore (topic) {
      try {
        const resp = await this.$options.filters.dispatchStore(topic)
        if (resp.status === 'success') {
          this.convoLoaded = true
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
    KeyboardCommandsFrame
  }
}
</script>