<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.split_turns.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body flex col" v-if="dataLoaded">
        <p v-html="$t('modals.split_turns.content_html')"></p>
        <div class="flex row split-type-buttons" v-if="oneWordSelected && !oneWordFirstPosition && !oneWordLastPosition">
          <button 
            :class="splitType === 'before' ? 'active' : ''"
            class="split-type-btn before"
            @click="setSplitType('before')"
          >
            <span class="split-type-btn__icon"></span>
            <span class="split-type-btn__label">{{ $t('modals.split_turns.split_before') }}</span>
          </button>
          <button 
            @click="setSplitType('out')"
            class="split-type-btn on"
            :class="splitType === 'out' ? 'active' : ''"
          >
            <span class="split-type-btn__icon"></span>
            <span class="split-type-btn__label">{{ $t('modals.split_turns.split_out') }}</span>
          </button>
          <button 
            @click="setSplitType('after')"
            class="split-type-btn after"
            :class="splitType === 'after' ? 'active' : ''"
          >
            <span class="split-type-btn__icon"></span>
            <span class="split-type-btn__label">{{ $t('modals.split_turns.split_after') }}</span>
          </button>
        </div>
        <div class="flex col modal-edit-turns">
          <!-- BEFORE SPLIT -->
          <div 
            v-if="splitContentArray.before_split !== null"
            class="modal-edit-turn__item flex row"
          >
            <!-- Speaker -->
            <div class="flex row modal-edit-turn__speaker" v-if="splitType === 'after'">
              <div class="flex col">
                <button 
                  class="btn--icon modal-edit-turn__speaker-btn" 
                  @click="newSpeakerMode()" 
                  :data-desc="selectSpeakerList ? $t('modals.split_turns.speaker_create') : $t('modals.split_turns.speaker_select')"
                >
                  <span class="icon"
                  :class="selectSpeakerList ? 'icon--add' : 'icon--list'"></span>
                </button>
              </div>
              <!-- Speaker select/input -->
              <div class="flex col">
                <span class="modal-edit-turn__field-label">{{ selectSpeakerList ? $t('modals.split_turns.speaker_select') : $t('modals.split_turns.speaker_add')}}</span>
                <select 
                  v-if="selectSpeakerList"
                  v-model="newSpeaker.value"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                  class="modal-edit-turn__select"
                  @change="checkForm()"
                >
                  <option  v-for="spk in speakers" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                </select>
                <input 
                  v-else 
                  type="text" 
                  v-model="newSpeaker.value"
                  class="modal-edit-turn__input"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                >
                <span class="error-field">{{newSpeaker.error !== null ? newSpeaker.error : '' }}</span>
              </div>
              <span class="modal-edit-turn__speaker-name" style="padding: 30px 0 0 5px;">:</span>
            </div>
            <div class="flex row modal-edit-turn__speaker" v-else>
              <div class="flex col">
                 <span class="modal-edit-turn__speaker-name">{{ speakers[speakers.findIndex(spk => spk.speaker_id === splitContentArray.before_split.speaker_id)].speaker_name }} :</span>
              </div>
            </div>
            <!-- Content -->
            <div class="flex row flex1 modal-edit-turn__content">
              <span class="modal-edit-turn__content-txt" v-if="splitType === 'after'">{{ splitContentArray.before_split.text }} {{ splitContentArray.split.text }}</span>
              <span class="modal-edit-turn__content-txt" v-else>{{ splitContentArray.before_split.text }}</span>
            </div>

          </div>
          <!-- END BEFORE SPLIT -->
          <!-- ON SPLIT -->
          <div 
            v-if="splitContentArray.split !== null && splitType === 'out'"
            class="modal-edit-turn__item flex row"
          >
            <!-- Speaker -->
            <div class="flex row modal-edit-turn__speaker">
              <div class="flex col">
                <button 
                  class="btn--icon modal-edit-turn__speaker-btn" 
                  @click="newSpeakerMode()" 
                  :data-desc="selectSpeakerList ? $t('modals.split_turns.speaker_create') : $t('modals.split_turns.speaker_select')"
                >
                  <span class="icon"
                  :class="selectSpeakerList ? 'icon--add' : 'icon--list'"></span>
                </button>
              </div>
              <!-- Speaker select/input -->
              <div class="flex col">
                <span class="modal-edit-turn__field-label">{{ selectSpeakerList ? $t('modals.split_turns.speaker_select') : $t('modals.split_turns.speaker_add')}}</span>
                <select 
                  v-if="selectSpeakerList"
                  v-model="newSpeaker.value"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                  class="modal-edit-turn__select"
                  @change="checkForm()"
                >
                  <option  v-for="spk in speakers" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                </select>
                <input 
                  v-else 
                  type="text" 
                  v-model="newSpeaker.value"
                  class="modal-edit-turn__input"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                >
                <span class="error-field">{{newSpeaker.error !== null ? newSpeaker.error : '' }}</span>
              </div>
              <span class="modal-edit-turn__speaker-name" style="padding: 30px 0 0 5px;">:</span>
            </div>
            <!-- Content-->
            <div class="flex row flex1 modal-edit-turn__content">
              <span class="modal-edit-turn__content-txt">{{ splitContentArray.split.text }}</span>
            </div>
          </div>
          <!-- END ON SPLIT -->
          <!-- AFTER SPLIT -->
          <div 
            v-if="splitContentArray.after_split !== null"
            class="modal-edit-turn__item flex row"
          >
            <!-- Speaker -->
            <div class="flex row modal-edit-turn__speaker" v-if="splitType === 'before'">
              <div class="flex col">
                <button 
                  class="btn--icon modal-edit-turn__speaker-btn" 
                  @click="newSpeakerMode()" 
                  :data-desc="selectSpeakerList ? $t('modals.split_turns.speaker_create') : $t('modals.split_turns.speaker_select')"
                >
                  <span class="icon"
                  :class="selectSpeakerList ? 'icon--add' : 'icon--list'"></span>
                </button>
              </div>
              <!-- Speaker select/input -->
              <div class="flex col">
                <span class="modal-edit-turn__field-label">{{ selectSpeakerList ? $t('modals.split_turns.speaker_select') : $t('modals.split_turns.speaker_add')}}</span>
                <select 
                  v-if="selectSpeakerList"
                  v-model="newSpeaker.value"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                  class="modal-edit-turn__select"
                  @change="checkForm()"
                >
                  <option  v-for="spk in speakers" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                </select>
                <input 
                  v-else 
                  type="text" 
                  v-model="newSpeaker.value"
                  class="modal-edit-turn__input"
                  :class="newSpeaker.error !== null ? 'error' : ''"
                >
                <span class="error-field">{{newSpeaker.error !== null ? newSpeaker.error : '' }}</span>
              </div>
              <span class="modal-edit-turn__speaker-name" style="padding: 30px 0 0 5px;">:</span>
            </div>
            <div class="flex row modal-edit-turn__speaker" v-else>
              <div class="flex col">
                 <span class="modal-edit-turn__speaker-name">{{ speakers[speakers.findIndex(spk => spk.speaker_id === splitContentArray.after_split.speaker_id)].speaker_name }} :</span>
              </div>
            </div>
            <!-- Content -->
            <div class="flex row flex1 modal-edit-turn__content">
              <span class="modal-edit-turn__content-txt" v-if="splitType === 'before'">{{ splitContentArray.split.text }} {{ splitContentArray.after_split.text }}</span>
              <span class="modal-edit-turn__content-txt" v-else>{{ splitContentArray.after_split.text }}</span>
            </div>

          </div>
          <!-- END AFTER SPLIT -->
        </div>
      </div>
      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.cancel') }}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn--txt-icon green" @click="splitTurn()">
          <span class="label">{{ $t('buttons.split') }}</span>
          <span class="icon icon__apply"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      modalShow: false,
      convoId: null,
      turnIds: [],
      convoLoaded: false,
      selectionObj: null,
      splitContentArray: {
        before_split: null,
        split: null,
        after_split: null
      },
      newSpeaker: {
        value: '',
        error: null,
        valid: false
      },
      selectSpeakerList: true,
      splitType: 'out',
      
    }
  },
  async mounted () {
    bus.$on('split_modal_open', async (data) => {
      await this.dispatchStore('getConversations')
      this.modalShow = true
      this.newSpeaker = {
        value: '',
        error: null,
        valid: false
      }
      this.selectionObj = data.selectionObj
      this.convoId = data.convoId
      this.splitType = 'out'
      this.setContent()
    })
  },
  computed: {
    dataLoaded () {
      return this.convoLoaded && !!this.speakers && this.speakers.length > 0
    },
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    speakers () {
      if(!!this.conversation) {
        return this.conversation.speakers
      } 
      return {}
    },
    oneWordSelected () {
      if(this.selectionObj !== null) {
        return (this.selectionObj.startTurnPosition === this.selectionObj.endTurnPosition) && (this.selectionObj.startWordPosition === this.selectionObj.endWordPosition)
      }
      return false
    },
    oneWordFirstPosition () {
      if (this.oneWordSelected) {
        return this.oneWordSelected && parseInt(this.selectionObj.startWordPosition) === 0
      }
      return false
    },
    oneWordLastPosition () {
      if (this.oneWordSelected) {
        let turnPos = parseInt(this.selectionObj.startTurnPosition)
        let turn = this.conversation.text.filter(t => parseInt(t.pos) === turnPos)
        let wordPos = parseInt(this.selectionObj.startWordPosition)
        if (turn.length > 0) {
          let nbWords = turn[0].words.length
          return wordPos === nbWords - 1
        }
        return false
      }
      return false
    }
  },
  methods: {
    newSpeakerMode () {
      this.selectSpeakerList = !this.selectSpeakerList
      this.newSpeaker = {
        value: '',
        error: null,
        valid: false
      }
    },
    checkForm () {
      if (this.newSpeaker.value.length === 0) {
        this.newSpeaker.error = 'This field is required'
        this.newSpeaker.valid = false
      } else {
        this.newSpeaker.error = null
        this.newSpeaker.valid = true
      }
    },
    async addSpeaker (speakername) {
      try {
        const payload =  { speakername }
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers`, 'post', payload)
        if((req.status === 200 || req.status === 200) && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          await this.dispatchStore('getConversations')
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
    
    async splitTurn () {
      try {
        this.checkForm()

        // create a new speaker
        if (this.newSpeaker.valid === true) {
          if (!this.selectSpeakerList) {
            await this.addSpeaker(this.newSpeaker.value)
            await this.dispatchStore('getConversations')
            let newSpk = this.conversation.speakers.find(spk => spk.speaker_name === this.newSpeaker.value)
            if (!!newSpk.speaker_id && !!newSpk.speaker_name) {
              this.selectSpeakerList = true
              this.newSpeaker = {
                value: newSpk.speaker_id,
                valid: true,
                error: null
              }
            }
          }
        } 
        let payload = {}
        
        // group of words selected
        if (!this.oneWordSelected) {
          payload = {
            convoid: this.convoId,
            speakerid: this.newSpeaker.value,
            turnpositions: this.selectionObj.startTurnId === this.selectionObj.endTurnId ? [parseInt(this.selectionObj.startTurnPosition)] : [parseInt(this.selectionObj.startTurnPosition), parseInt(this.selectionObj.endTurnPosition)],
            wordids: [this.selectionObj.startWordId, this.selectionObj.endWordId],
            splitype: 0
          }
        } 
            
        // 1 word selected
        else {
          let splitVal = 0
          if (this.splitType === 'before'|| this.oneWordLastPosition) {
            splitVal = 1
          } else if (this.splitType === 'after' || this.oneWordFirstPosition) {
            splitVal = 2
          }
          payload = {
            convoid: this.convoId,
            speakerid: this.newSpeaker.value,
            turnpositions: [parseInt(this.selectionObj.startTurnPosition)],
            turnids: [this.selectionObj.startTurnId],
            wordids: [this.selectionObj.startWordId], 
            splitype: splitVal
          }
        }
        console.log('Split payload', payload)
        // Request 
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/turn/split`, 'put', payload)

        if((req.status === 200 || req.status === 202) && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          this.closeModal()
          bus.$emit('refresh_conversation', {closeToolBox: true})

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
    closeModal () {
      this.modalShow = false
    },
    setSplitType (splitType) {
      if (this.splitType !== splitType) {
        this.splitType = splitType
        
      }
    },
    async setContent () {
      this.splitContentArray = []
      this.splitContentArray.before_split = null
      this.splitContentArray.split = null
      this.splitContentArray.after_split = null

      if(this.selectionObj.startTurnId === this.selectionObj.endTurnId && this.conversation.text.length > 0) {
        // 1 turn selected
        let turnId = this.selectionObj.startTurnId
        const editTurn = this.conversation.text.find(turn => turn.turn_id === turnId)
        if(!!editTurn.words && !!editTurn.turn_id && !!editTurn.speaker_id && editTurn.words.length> 0) {
        let speaker_base = editTurn.speaker_id
        
        
            editTurn.words.map(word => {
              const wordPos = parseInt(word.pos)
              // Words before the split
              if (wordPos < parseInt(this.selectionObj.startWordPosition)) {
                if(this.splitContentArray.before_split !== null) {
                  this.splitContentArray.before_split.text += word.word + ' '
                  this.splitContentArray.before_split.words.push(word)
                } else {
                  this.splitContentArray.before_split = {
                    id: 0,
                    speaker_id: speaker_base,
                    text: word.word + ' ',
                    words: [word]
                  }
                }
              }
              // words In the split
              else if (wordPos >= parseInt(this.selectionObj.startWordPosition) && wordPos <= parseInt(this.selectionObj.endWordPosition)) {
                if(this.splitContentArray.split !== null) {
                  this.splitContentArray.split.text += word.word + ' '
                  this.splitContentArray.split.words.push(word)
                } else {
                  this.splitContentArray.split = {
                    id: 1,
                    speaker_id: 'todefin',
                    text: word.word + ' ',
                    words: [word]
                  }
                }
              } 
              // words after the split
              else {
                if(this.splitContentArray.after_split !== null) {
                  this.splitContentArray.after_split.text += word.word + ' '
                  this.splitContentArray.after_split.words.push(word)
                } else {
                  this.splitContentArray.after_split = {
                    id: 2,
                    speaker_id: speaker_base,
                    text: word.word + ' ',
                    words: [word]
                  }
                }
              }
            })
        }
      }
      else if (this.selectionObj.startTurnId !== this.selectionObj.endTurnId && this.conversation.text.length > 0) { // Multiple turns selected
        const startTurn = this.conversation.text.find(turn => turn.turn_id === this.selectionObj.startTurnId)
        const endTurn = this.conversation.text.find(turn => turn.turn_id === this.selectionObj.endTurnId)
        // Before split 
        if(!!startTurn.words && !!startTurn.turn_id && !!startTurn.speaker_id && startTurn.words.length > 0) {
          startTurn.words.map(word => {
            if (word.pos < parseInt(this.selectionObj.startWordPosition)) {
              if(this.splitContentArray.before_split !== null) {
                this.splitContentArray.before_split.text += word.word + ' '
                this.splitContentArray.before_split.words.push(word)
              } else {
                this.splitContentArray.before_split = {
                  id: 0,
                  speaker_id: this.selectionObj.startTurnSpeakerId,
                  text: word.word + ' ',
                  words: [word]
                }
              }
            }
          })
        }
         // Split
        let selectedTurns = this.conversation.text.filter(turn => turn.pos >= this.selectionObj.startTurnPosition && turn.pos <= this.selectionObj.endTurnPosition) 
        if (selectedTurns.length > 0 ) {
          
          selectedTurns.map(turn => {
            const turnPos = parseInt(turn.pos)
            // start turn
            if (turnPos === parseInt(this.selectionObj.startTurnPosition) && turn.words.length > 0) {
              turn.words.map(word => {
                if(parseInt(word.pos) >= parseInt(this.selectionObj.startWordPosition)) {
                  if(this.splitContentArray.split !== null) {
                    this.splitContentArray.split.text += word.word + ' '
                    this.splitContentArray.split.words.push(word)
                  } else {
                    this.splitContentArray.split = {
                      id: 1,
                      speaker_id: 'todefine',
                      text: word.word + ' ',
                      words: [word]
                    }
                  }
                }
              })
            }
            // between turns
            if (turnPos > parseInt(this.selectionObj.startTurnPosition) && turnPos < parseInt(this.selectionObj.endTurnPosition) && turn.words.length > 0) {
              turn.words.map(word => {
                if(this.splitContentArray.split !== null) {
                  this.splitContentArray.split.text += word.word + ' '
                  this.splitContentArray.split.words.push(word)
                } else {
                  this.splitContentArray.split = {
                    id: 1,
                    speaker_id: 'todefine',
                    text: word.word + ' ',
                    words: [word]
                  }
                }
              })
            }
            // end turn
            if (turnPos === parseInt(this.selectionObj.endTurnPosition) && turn.words.length > 0) {
              turn.words.map(word => {
                if(parseInt(word.pos) <= parseInt(this.selectionObj.endWordPosition)) {
                  if(this.splitContentArray.split !== null) {
                    this.splitContentArray.split.text += word.word + ' '
                    this.splitContentArray.split.words.push(word)
                  } else {
                    this.splitContentArray.split = {
                      id: 1,
                      speaker_id: 'todefine',
                      text: word.word + ' ',
                      words: [word]
                    }
                  }
                }
              })
            }
          })
        }
        // After split
        if(!!endTurn.words && !!endTurn.turn_id && !!endTurn.speaker_id && endTurn.words.length > 0) {
          endTurn.words.map(word => {
            if (word.pos > parseInt(this.selectionObj.endWordPosition)) {
              if(this.splitContentArray.after_split !== null) {
                this.splitContentArray.after_split.text += word.word + ' '
                this.splitContentArray.after_split.words.push(word)
              } else {
                this.splitContentArray.after_split = {
                  id: 2,
                  speaker_id: this.selectionObj.endTurnSpeakerId,
                  text: word.word + ' ',
                  words: [word]
                }
              }
            }
          })
        }
      }
      console.log('splitArray', this.splitContentArray)
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
  }
}
</script>