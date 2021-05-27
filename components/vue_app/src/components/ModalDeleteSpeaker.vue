<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
        <div class="modal--header flex row">
          <span class="title flex1">{{ $t('modals.delete_speaker.title' )}} "{{ speakerName }}"</span>
          <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
            <span class="icon icon--close"></span>
          </button>
        </div>
        <div class="modal--body flex col">
          <div v-if="speakerTxt.length === 0">
            <p>Are you sure you want to <strong>delete</strong> this speaker: <strong>{{ speakerName }}</strong> ?</p>
          </div>
          <div v-else>
            <p>{{$tc('modals.delete_speaker.content', {'spk': speakerName}) }}.</p>
            <div class="form-field flex col">
              <span class="form-label">Re-assign turns to:<strong>*</strong> :</span>
              <select 
                v-model="newSpeaker.value" @change="testSpeaker()"
                :class="newSpeaker.error !== null ? 'error' : ''"
              >
                <option  v-for="spk in speakersList" :key="spk.speaker_id" :value="spk.speaker_id">{{ spk.speaker_name }}</option>
                
              </select>
              <span class="error-field" v-if="newSpeaker.error !== null">{{ newSpeaker.error }}</span>
            </div>
          </div>
        </div>
        <div class="modal--footer flex row">
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
        const payload =  {}
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers/${this.speakerId}`, 'delete', payload)

        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          bus.$emit(`update_speaker`, {})
          this.closeModal()
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
    testSpeaker () {
      // Test selected speaker
      return this.$options.filters.testSelectField(this.newSpeaker)
    },
    async mergeSpeakers () {
      try {
        this.testSpeaker()
        if(this.newSpeaker.valid) {
          const payload =  {
            newspeakerid: this.newSpeaker.value
          }
          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/mergespeakers/${this.speakerId}`, 'patch', payload)

          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            bus.$emit(`update_speaker`, {})
            this.closeModal()
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
