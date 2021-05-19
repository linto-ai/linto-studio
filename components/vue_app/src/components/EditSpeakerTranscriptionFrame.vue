<template>
  <div class="edit-frame flex col" :class="showFrame ? 'visible' : 'hidden'" id="edit-speaker-frame">
    <div v-if="dataLoaded">
      <div class="edit-frame--head flex row">
        <span class="icon user"></span>
        <span class="label flex1">Edit speaker name</span>
        <button class="btn--icon" @click="closeFrame()">
            <span class="icon icon--close"></span>
          </button>
      </div>
      <div class="edit-frame--body flex col">
        <div class="form-field edit-frame-options flex col">
        <span class="form-label">Update speaker :</span>
          <div class="flex row edit-frame-options--item">
            <input 
              type="radio" 
              id="edit-speaker-turn" 
              name="edit-speaker" 
              v-model="editSpeakerMode"
              value="turn"
              class="edit-frame-option--radio" 
              checked
            >
            <label 
              class="edit-frame-option--radio-label"  for="edit-speaker-turn"
            >This turn only</label>
          </div>
          <div class="flex row edit-frame-options--item">
            <input 
              type="radio" 
              id="edit-speaker-transcription" 
              name="edit-speaker" 
              value="transcription"
              v-model="editSpeakerMode" 
              class="edit-frame-option--radio" 
            >
            <label 
            class="edit-frame-option--radio-label" 
            for="edit-speaker-transcription">Everywhere</label>
          </div>
        </div>
        <div class="flex col">
          <ul class="speakers-list">
            <li class="speakers-list-item" v-for="spk in convoSpeakers" :key="spk.speaker_id"><button @click="updateSpeaker(spk)">{{ spk.speaker_name }}</button></li>
          </ul>
        </div>
        <div class="form-field flex col">
          <span class="form-label">Type a speaker name :</span>
          <div class="flex row">
            <input 
              type="text" 
              v-model="speakerName.value"
              class="flex1"
              :class="speakerName.error !== null ? 'error' : ''"
            >
            <button class="btn--icon"
            @click="addNewSpeaker()">
              <span class="icon icon--apply"></span>
            </button>
          </div>
          <span class="error-field" v-if="speakerName.error !== null">{{ speakerName.error }}</span>
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
      showFrame: false,
      convoLoaded: false,
      convoId: '',
      turnId: null,
      speaker: null,
      editSpeakerMode: 'turn',
      speakerName: {
        value: '',
        error: null,
        valid: false
      }
    }
  },
  async mounted () {
    bus.$on(`edit_speaker_transcription`, async (data) => {
      bus.$emit('keyup_handler_disable', {})
        this.showFrame = true
        this.convoId = data.conversationId
        this.speaker = data.speaker
        this.turnId = data.turnId
        await this.dispatchStore('getConversations')
    })
  },
  computed: {
    dataLoaded () {
      return this.convoLoaded
    },
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    turn () {
      if(!!this.conversation.text) {
        return this.conversation.text.filter(txt => txt.turn_id === this.turnId)[0] || null
      }
      return []
    },
    convoSpeakers () {
      if(!!this.conversation.speakers) {
        return this.conversation.speakers.filter(spk => spk.speaker_id !== this.speaker.speaker_id && spk.speaker_name.toLowerCase().indexOf(this.speakerName.value.toLowerCase()) >= 0)
      } 
      return []
    }
  },
  methods: {
    closeFrame () {
      this.showFrame = false
      this.selectedSpeaker = {
        value: '',
        valid: false,
        error: null
      }
      this.showEditSpkOptions = false
      this.showMergeTurnsOptions = false
      bus.$emit('keyup_handler_enable', {})
      bus.$emit(`refresh_conversation`, {})
      bus.$emit(`update_speaker`, {})
    },
    async updateSpeaker (targetSpeaker) {
      if(this.editSpeakerMode === 'turn') {
        await this.updateSpeakerTurn(targetSpeaker, this.turnId)
      } else if(this.editSpeakerMode === 'transcription') { 
        bus.$emit('modal_merge_speaker_by_target', {
          speaker: this.speaker,
          targetSpeaker
        })
      }
    },
    // Update speaker turn (on click)
    async updateSpeakerTurn (targetSpeaker, turnId) {
      console.log(targetSpeaker, turnId)
      try{
        let payload =  {
          speakerid: targetSpeaker.speaker_id
        }
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/turnspeaker/${turnId}`, 'put', payload)
        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          this.closeFrame()
        } else {
          throw req
        }
      }catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
      }
    },
    async addNewSpeaker () {
      // check speaker name length
      if(this.speakerName.value.length === 0) {
        this.speakerName.valid = false
        this.speakerName.error = 'Field required or select an user in the list above'
        return 
      }
      // check if user name is not used
      const speakerExist = this.conversation.speakers.filter(spk => spk.speaker_name.toLowerCase() === this.speakerName.value.toLowerCase())
      if(speakerExist.length > 0) {
        this.speakerName.valid = false
        this.speakerName.error = 'This speaker name is already taken'
        return 
      }
      try {
          let newSpeaker = null
          // create new speaker
          let createSpeaker = await this.createSpeaker(this.speakerName.value)
          if(createSpeaker.status === 'success') {
            // refresh store
            await this.dispatchStore('getConversations')
            // get new speaker object (id, name)
            let speakers = this.conversation.speakers.filter(spk => spk.speaker_name.toLowerCase() === this.speakerName.value.toLowerCase())
            if(speakers.length > 0) {
              newSpeaker = speakers[0]
              await this.updateSpeaker(newSpeaker)
            }
        }  
      } catch (error) {
        console.error(error)
      }
    },
    async createSpeaker (speakername) {
      try {
        let payload =  {
          convoid: this.convoId,
          speakername
        }
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers`, 'post', payload)

        if(req.status === 200 && !!req.data.msg) {
          await this.dispatchStore('getConversations')
          return { status: 'success'}
        } else {
          throw req
        }
      } catch (error) {
        console.error(error)
        return { status: 'error'}
      }
    },
    /* END SPEAKERS */
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