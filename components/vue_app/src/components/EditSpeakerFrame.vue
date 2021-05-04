<template>
  <div class="edit-frame flex col" :class="showFrame ? 'visible' : 'hidden'" id="edit-speaker-frame">
    <div v-if="this.speaker !== null">
      <h3 class="edit-frame--title">Editing speaker - {{ speaker.speaker_name }}</h3>
      <div class="flex1 flex row speaker-search">
        <input class="input input--search-edit flex1" type="text" placeholder="Type a name" v-model="speakerName">
        <button class="btn--icon" @click="addSpeaker()">
          <span class="icon icon--apply"></span>
        </button>
      </div>
      <div v-if="speakers !== null && speakers.length > 0">
        <div class="flex1" v-for="spk in speakers" :key="spk.speaker_id">
          <button class="btn btn--edit-speaker" @click="updateSpeaker(spk.speaker_name)">{{ spk.speaker_name }}</button>
        </div>
        <div> 
          <button class="btn btn--txt btn--txt__cancel" @click="closeFrame()">
            <span class="label">Cancel</span>
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
      showFrame: false,
      speakerName: '',
      convoId: '',
      convoLoaded: false,
      speaker: null,
      speakers: null
    }
  },
  async mounted () {
    bus.$on(`edit_speaker`, async (data) => {
        this.showFrame = true
        this.convoId = data.conversationId
        this.speaker = data.speaker
        this.speakerName = data.speaker.speaker_name
        if (!!data.speakers && data.speakers.length > 0) {
          this.speakers = data.speakers.filter(spk => spk.speaker_name !== this.speaker.speaker_name)
        } else {
          this.speakers = data.speakers
        }
    })
  } ,
  methods: {
    
    addSpeaker() {
      const speaker = this.speakerName
      if (speaker.length === 0) {
        // TODO Errror
      } else {
        this.updateSpeaker(speaker)
      }
    },
    async updateSpeaker (name) {
      try {
        // check if selected speaker is already in speakers list
        const speakerExist = this.speakers.filter(sp => sp.speaker_name === name)
        
        // Replace a speaker by another one (in the list) > Merge
        if(speakerExist.length > 0) { 
          bus.$emit('modal_merge_speaker_by_target', {
            speaker: this.speaker,
            targetSpeaker: speakerExist[0]
          })
          this.showFrame = false

        } 
        // Replace speaker name by a speaker that has NO TURN in this transcription
        else {
          const payload =  {
            newspeakername: name
          }
          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers/${this.speaker.speaker_id}`, 'patch',payload )

          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })

            bus.$emit(`update_speaker`, {})
            this.showFrame = false
            this.speakerName = ''
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
    },
    closeFrame () {
      this.showFrame = false;
      bus.$emit(`update_speaker`, {})
    }
  }
}
</script>