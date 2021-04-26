<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
        <div class="modal--header flex row">
          <span class="title flex1">Delete speaker</span>
          <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
            <span class="icon icon--close"></span>
          </button>
        </div>
        <div class="modal--body">
          <div v-if="speakerTxt.length === 0">
            <p>Are you sure you want to <strong>delete</strong> this speaker:  <strong>{{ speakerName }}</strong> ?</p><br/>
          </div>
          <div v-else>
            Sentences are attached to this speaker. If you want to delete it, you will have to select a speaker to replace this one.
            <select v-model="newSpeaker.value">
              <option  v-for="spk in speakersList" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name}}</option>
            </select>
          </div>
        </div>
        <div class="modal--footer">
          <button class="btn btn--txt-icon grey" @click="closeModal()">
            <span class="label">Cancel</span>
            <span class="icon icon__cancel"></span>
          </button>
          
          <button v-if="speakerTxt.length === 0" class="btn btn--txt-icon red" @click="deleteSpeaker()">
            <span class="label">Delete</span>
            <span class="icon icon__trash"></span>
          </button>

          <button v-else class="btn btn--txt-icon green" @click="mergeSpeakers()">
            <span class="label">Merge</span>
            <span class="icon icon__apply"></span>
          </button>
        </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
import axios from 'axios'
export default {
  props: ['convoId'],
  data () {
    return {
      modalShow: false,
      speakerId: null,
      newSpeaker: {
        value: '',
        error: null,
        valid: false
      }
    }
  },
  async mounted () {
    bus.$on('modal_delete_speaker', async (data) => {
        this.showModal()
        this.speakerId = data.speakerId
        setTimeout(() => {
          if (this.speakersList.length > 0) {
            this.newSpeaker.value = this.speakersList[0].speaker_id
            this.newSpeaker.valid = true
            this.newSpeaker.error = null
          }
        }, 200)
    })
    
  },
  computed: {
    speakerTxt () {
      return this.$store.getters.textBySpeakerId(this.convoId, this.speakerId)
    },
    currentSpeaker () {
      return this.allSpeakers.filter(spk => spk.speaker_id === this.speakerId)
    },
    speakerName () {
      if(this.currentSpeaker.length > 0) {
        return this.currentSpeaker[0].speaker_name
      } else {
        return null
      }
    },
    allSpeakers () {
      return this.$store.getters.speakersByConversationId(this.convoId)
    },
    speakersList () {
        return this.allSpeakers.filter(spk => spk.speaker_id !== this.speakerId)
    }
  },
  methods: {
    async showModal () {
      this.modalShow = true
      await this.dispatchStore('getConversations')
    },
    closeModal () {
      this.modalShow = false
      bus.$emit(`update_speaker`, {})
    },
    async deleteSpeaker () {
      try {
        const deleteSpeaker = await axios(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers/${this.speakerId}`, {
          method: 'delete'
        })
        if (deleteSpeaker.status === 200 && !!deleteSpeaker.data.msg ) {
          bus.$emit('app_notif', {
            status: 'success',
            message: deleteSpeaker.data.msg,
            timeout: 3000
          })
          this.closeModal()
        }
      } catch (error) {
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.data && !!error.data.msg ? error.data.msg : 'Error on deleting speaker',
          timeout: null
        })
      }
    },
    async mergeSpeakers () {
      try {
        const updateSpeaker = await axios(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/mergespeakers/${this.speakerId}`, {
          method: 'patch',
          data: {
            newspeakerid: this.newSpeaker.value
          }
        })
        if (updateSpeaker.status === 200 && !!updateSpeaker.data.msg) {
          this.closeModal()
          bus.$emit('app_notif', {
            status: 'success',
            message: updateSpeaker.data.msg,
            timeout: null
          })
        } else {
          throw updateSpeaker
        }  
      } catch (error) {
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.data && !!error.data.msg ? error.data.msg : 'Error on deleting speaker',
          timeout: null
        })
      }
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
