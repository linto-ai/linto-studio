<template>
  <div class="edit-frame flex col" :class="showFrame ? 'visible' : 'hidden'" id="edit-speaker-frame">
    <div v-if="dataLoaded">
      <div class="edit-frame--preheader">
        <button class="btn btn--inline" @click="closeFrame()">
          <span class="label">close</span>
        </button>
        </div>
      <div class="edit-frame--header">
        <h3 class="edit-frame--title">Editing speaker - {{speaker.speaker_name}}</h3>
      </div>
      <div class="edit-frame--body flex col">
        
        <div class="edit-frame-action">
          <!-- Edit speaker BTN -->
          <div class="flex row">
            <span class="edit-frame-action--btn edit-speaker flex1" >
            Edit speaker</span>
         </div>
          <!-- Edit speaker form-->
          <div class="edit-frame-options radio" :class="showEditSpkOptions ? 'opened' : 'closed'">
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
              >For this turn</label>
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
              for="edit-speaker-transcription">For all transcription</label>
            </div>
            <div class="flex col edit-frame-options--item" v-if="!toggleCreateUser">
              <!-- Select speaker -->
              <div class="flex col">
                <label class="edit-frame-option--label" for="edit-speaker-name">Select a speaker :</label>
                <select 
                  id="edit-speaker-name" v-model="selectedSpeaker.value"
                  :class="selectedSpeaker.error !== null ? 'error' : ''"
                  @change="testFormSpeakerName(selectedSpeaker)"
                >
                  <option v-for="spk in speakers" :key="spk.speaker_id" :value="spk">{{spk.speaker_name}}</option>
                </select>
                <span class="error-field" v-if="selectedSpeaker.error !== null">{{ selectedSpeaker.error }}</span>
              </div>
              <div class="flex row edit-frame--btns" style="margin-bottom: 20px;">
                <button 
                  class=" btn btn--small blue-dark"
                  @click="showCreateSpeaker()"
                >
                  <span class="label">Add a speaker</span>
                </button>
                
              </div>
              <div class="flex row edit-frame--btns">
                <button 
                  class=" btn btn--small green border flex1"
                  @click="updateSpeaker(selectedSpeaker)"
                >
                  <span class="label">Update</span>
                </button>
             </div>
            </div>
            <!-- Add a speaker INPUT--> 
            <div class="flex col edit-frame-options--item" v-else>
              <label for="create-new-speaker" class="edit-frame-option--label">Add a speaker: </label>
              <input 
                type="text" 
                id="create-new-speaker" 
                v-model="newSpeakerValue" 
                :class="newSpeakerName.error !== null ? 'error' : ''"
              />
              <span class="error-field" v-if="newSpeakerName.error !== null">{{newSpeakerName.error}}</span>

              <div class="flex row edit-frame--btns" style="margin-bottom: 20px;">
                <button 
                  class=" btn btn--small blue-dark"
                  @click="hideCreateSpeaker()"
                >
                  <span class="label">Select a speaker</span>
                </button>
              </div>
              <div class="flex row edit-frame--btns">
                <button 
                  class=" btn btn--small green border flex1" 
                  @click="addNewSpeaker(newSpeakerName)"
                >
                  <span class="label" >Update</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-frame--footer">
        <button class="btn btn--inline" @click="closeFrame()">
          <span class="label">close</span>
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
      showFrame: false,
      convoId: '',
      convoLoaded: false,
      speaker: null,
      speakers: null,
      selectedSpeaker: {
        value: '',
        valid: false,
        error: null
      },
      newSpeakerValue: '',
      showEditSpkOptions: true,
      toggleCreateUser: false,
      editSpeakerMode: 'turn',
      turnId: null,
      convoLoaded: false
    }
  },
  async mounted () {
    bus.$on(`edit_speaker_transcription`, async (data) => {
        if(this.showFrame) {
          this.closeFrame()
        }
        this.showFrame = true
        this.convoId = data.conversationId
        this.speaker = data.speaker
        this.turnId = data.turnId
        await this.dispatchStore('getConversations')
        if (!!data.speakers && data.speakers.length > 0) {
          this.speakers = data.speakers.filter(spk => spk.speaker_name !== this.speaker.speaker_name)
        } else {
          this.speakers = data.speakers
        }
    })
    
  },
  computed: {
    dataLoaded () {
      return this.convoLoaded && this.speaker !== null && !! this.newSpeakerName
    },
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    turn () {
      if(!!this.conversation.text) {
        return this.conversation.text.filter(txt => txt.turn_id === this.turnId)[0] || null
      } else {
        return []
      }
    },
    newSpeakerName () {
      if(this.newSpeakerValue.length > 0) {
        return ({
            value: {
              speaker_name: this.newSpeakerValue,
              speaker_id: ''
            },
            valid: true,
            error: null
        })
      } else {
        return ({
          value: '',
          valid: false,
          error: 'this field is required'
        })
      }
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
      this.toggleCreateUser = false
      bus.$emit(`update_speaker`, {})
    },
    /* SPEAKERS */
    showCreateSpeaker(){
      this.toggleCreateUser = true
    },
    hideCreateSpeaker(){
      this.toggleCreateUser = false
    },
    async testFormSpeakerName (obj) {
      if(!!obj.value.speaker_name && !!obj.value.speaker_id){
        obj.valid = true
        obj.error = null
      } else {
        obj.valid = false
        obj.error = 'This field is required'
      }
    },
    testSelectedSpeaker () {
      if(!!this.selectedSpeaker.value.speaker_name && !!this.selectedSpeaker.value.speaker_id) {
        this.selectedSpeaker.valid = true
        this.selectedSpeaker.error = null
      } else {
        this.selectedSpeaker.valid = false
        this.selectedSpeaker.error = 'This field is required'
      }
    },
    async updateSpeaker(targetSpeaker) {
      try {
        this.testSelectedSpeaker(targetSpeaker)
        if(targetSpeaker.valid === true) {
          let req = null
          if (this.editSpeakerMode === 'turn') {
            // update speaker for a turn
            let payload =  {
              speakerid: targetSpeaker.value.speaker_id
            }
            req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/turnspeaker/${this.turnId}`, 'put', payload)
          }
          // Update speaker for all transcription
          else if (this.editSpeakerMode === 'transcription') {
            let payload = {
              newspeakerid: targetSpeaker.value.speaker_id
            }
            req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/mergespeakers/${this.speaker.speaker_id}`, 'patch', payload)
          }
          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            this.closeFrame()
            bus.$emit(`refresh_conversation`, {})
          } else {
            throw req
          }
        }
      } catch (error) {
        console.error('ERR:', error)
      }
    },
    async addNewSpeaker (speaker) {
      // Test new speaker name lenght
      if(!speaker.value || !speaker.value.speaker_name || speaker.value.speaker_name.length === 0) {
        return false
      }
      try {
        // check if selected speaker is already in speakers list
        const speakerExist = this.speakers.filter(sp => sp.speaker_name === speaker.value.speaker_name)
        // if speaker exists in this conversation, update with the existing data
        if(speakerExist.length > 0) { 
          this.updateSpeaker({
            value: {
              speaker_name: speakerExist[0].speaker_name,
              speaker_id: speakerExist[0].speaker_id
            },
            valid: true,
            error: null
          })
        } 
        // if speaker doesn't exists in this convesation, create one and update with the created data (id, name)
        else {
          let newSpeaker = null
          // create new speaker
          const createSpeaker = await this.createSpeaker(speaker.value.speaker_name)
          if(createSpeaker.status === 'success') {
            // refresh store
            await this.dispatchStore('getConversations')
            // get new speaker object (id, name)
            let speakers = this.conversation.speakers.filter(spk => spk.speaker_name === speaker.value.speaker_name)
            if(speakers.length > 0) {
              newSpeaker = speakers[0]
              await this.updateSpeaker({
                value: {
                  speaker_name: newSpeaker.speaker_name,
                  speaker_id: newSpeaker.speaker_id
                },
                error: null,
                valid: true
              })
            }
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