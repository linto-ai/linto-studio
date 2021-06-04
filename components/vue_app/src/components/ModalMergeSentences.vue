<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
        <div class="modal--header flex row">
          <span class="title flex1">{{ $t('modals.merge_turns.title') }}</span>
          <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
            <span class="icon icon--close"></span>
          </button>
        </div>
        <div class="modal--body flex col" v-if="convoLoaded">
          <p v-html="$t('modals.merge_turns.content_html')"></p>
          <div class="modal-merge-content flex col" v-html="contentFromSelection">
          </div>
          <div class="form-field flex col">
            <span class="form-label">{{ $t('modals.merge_turns.select_speaker') }}:</span>
            <select 
              v-model="selectedSpeaker.value"
              :class="selectedSpeaker.error !== null ? 'error' :''"
              @change="checkSelectedSpeaker()"
            >
              <option v-for="spk in speakers" :key="spk.speaker_id" :value="spk">{{ spk.speaker_name }}</option>
            </select>
            <span class="error-field" v-if="selectedSpeaker.error !== null">{{ selectedSpeaker.error }}</span>
          </div>
      </div>
      <div class="modal--footer flex row">
        <div class="modal--footer-btn-splitted">
          <button 
            class="btn btn--txt-icon grey"
            @click="closeModal()"
          >
            <span class="label">{{ $t('buttons.cancel') }}</span>
          </button>
          <button 
            class="btn btn--txt-icon green"
            @click="mergeTurns()"
          >
            <span class="label">{{ $t('buttons.merge') }}</span>
          </button>
        </div>
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
      positions: [],
      convoLoaded: false,
      selectionObj: null,
      selectedSpeaker: {
        value: '',
        error: null,
        valid: false
      }
    }
  },
  async mounted () {
    bus.$on('merge_sentences_modal', async (data) => {
      this.turnIds = data.turnids
      this.convoId = data.convoid
      this.positions = data.positions
      this.selectionObj = data.selectionObj
      this.selectedSpeaker = {
        value: '',
        error: null,
        valid: false
      }
      await this.dispatchStore('getConversations')
      this.modalShow = true
    })
  },
  computed: {
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    allTurnIds () {
      if (!!this.conversation && this.selectionObj !== null) {
        return this.$store.getters.turnIdsBetweenTwo(this.convoId, this.selectionObj)
      } 
      return []
    },
    speakersArray () {
      let speakersArray = [] 
      if(!!this.conversation && !!this.conversation.speakers && this.conversation.speakers.length > 0) {
        this.conversation.speakers.map(speaker => {
          speakersArray.push({
            speaker_id: speaker.speaker_id,
            speaker_name: speaker.speaker_name
          })
        })
      }
      return speakersArray
    },
    speakers () {
      let speakers = []
      if (this.conversation.text.length > 0 && this.speakersArray.length > 0) {
        this.conversation.text.map(turn => {
          
          if(speakers.findIndex(spk => spk.speaker_id === turn.speaker_id) < 0) {
            speakers.push({
              speaker_id: turn.speaker_id,
              speaker_name: this.speakersArray[this.speakersArray.findIndex(spk => spk.speaker_id === turn.speaker_id)].speaker_name
            })
          }
        })
      }
      return speakers
    },
    contentFromSelection () {
      const turns = this.conversation.text.filter(turn => parseInt(turn.pos) >= parseInt(this.positions[0]) && parseInt(turn.pos) <= parseInt(this.positions[1]))
      let contentHTML = ''
      if (turns.length > 0) {
        turns.map(turn => {
          const speakerName = this.speakersArray[this.speakersArray.findIndex(spk => spk.speaker_id === turn.speaker_id)].speaker_name
          contentHTML += `
          <div class="modal-edit-turn__item flex row"><div class="flex row modal-edit-turn__speaker"><div class="flex col"><span class="modal-edit-turn__speaker-name">${speakerName} :</span></div></div><div class="flex row flex1 modal-edit-turn__content"><span class="modal-edit-turn__content-txt">`
          if (turn.words.length > 0) {
            turn.words.map( word => {
              contentHTML += word.word + ' '
            })
          }
          contentHTML += `</span></div></div>`
        })
      }
      return contentHTML
    }
  },
  methods: {
    closeModal () {
      this.modalShow = false
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
    },
    checkSelectedSpeaker() {
      if(this.selectedSpeaker.value === '' || !this.selectedSpeaker.value.speaker_id || !this.selectedSpeaker.value.speaker_name) {
        this.selectedSpeaker.error = 'This field is required'
        this.selectedSpeaker.valid = false
      } else {
        this.selectedSpeaker.error = null
        this.selectedSpeaker.valid = true
      }
    },
    async mergeTurns () {
      try {
        this.checkSelectedSpeaker()
        if(this.selectedSpeaker.valid === true) {
          const payload = {
            turnids: this.allTurnIds,
            positions: this.positions,
            speakerid: this.selectedSpeaker.value.speaker_id
          }
          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/turn/merge`, 'patch', payload)
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
    }
  }
}
</script>