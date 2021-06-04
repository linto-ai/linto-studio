<template>
  <div class="edit-frame flex col" :class="showFrame && dataLoaded ? 'visible' : 'hidden'" id="edit-speaker-frame">
    <div class="edit-frame--head flex row">
      <span class="icon user"></span>
      <span class="label flex1">{{ $t("modals.edit_speaker.edit") }}:</span>
      <button class="btn--icon" @click="closeFrame()">
        <span class="icon icon--close"></span>
      </button>
    </div>
    <div class="edit-frame--body flex col">
      <div class="form-field flex col">
        <span class="form-label">{{ $t("modals.edit_speaker.rename") }}:</span>
        <div class="flex row">
          <input 
            type="text" 
            v-model="speakerName.value"
            class="flex1"
            :class="speakerName.error !== null ? 'error' : ''"
          >
          <button class="btn--icon"
          @click="renameSpeaker()">
            <span class="icon icon--apply"></span>
          </button>
        </div>
        <span class="error-field" v-if="speakerName.error !== null">{{ speakerName.error }}</span>
      </div>
      <div class="form-field flex col">
        <span class="form-label">{{ $t("modals.edit_speaker.replaceby") }}:</span>
        <ul class="speakers-list">
          <li class="speakers-list-item" v-for="spk in convoSpeakers" :key="spk.speaker_id">
            <button @click="replaceSpeaker(spk)">{{ spk.speaker_name }}
            </button>
          </li>
        </ul>
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
      speakerName: {
        value: '',
        error: null,
        valid: false
      },
      speaker: null,
      speakers: null
    }
  },
  async mounted () {
    bus.$on('edit_speaker_frame', async (data) => {
        this.showFrame = true
        this.convoId = data.conversationId
        this.speaker = data.speaker
        this.speakerName.value = data.speaker.speaker_name
        await this.dispatchConversations()
    })
    bus.$on('close_edit_speaker_frame', () => {
      if(this.showFrame) {
        this.closeFrame()
      }
    })
  },
  computed: {
    dataLoaded () {
      return this.convoLoaded
    },
    conversation () {
      return this.$store.getters.conversationById(this.convoId)
    },
    convoSpeakers () {
      if(!!this.conversation.speakers) {
        return this.conversation.speakers.filter(spk => spk.speaker_id !== this.speaker.speaker_id)
      } 
      return []
    }
  },
  methods: {
    async renameSpeaker () {
      try {
        if (this.speakerName.value.length === 0) {
          this.speakerName.error = 'This field is required'
          this.speakerName.valid = false
        } else {
          let speakerExist = this.conversation.speakers.filter(spk => spk.speaker_name.toLowerCase() === this.speakerName.value.toLowerCase())

          if(speakerExist.length > 0) {
            this.speakerName.error = 'This speaker name is already used'
            this.speakerName.valid = false
          }
          else {
            let payload =  {
              newspeakername: this.speakerName.value
            }
            let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/speakers/${this.speaker.speaker_id}`, 'patch', payload)
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
          }
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
      }
    },
    async replaceSpeaker (targetSpeaker) {
      try {
         bus.$emit('modal_merge_speaker_by_target', {
          speaker: this.speaker,
          targetSpeaker
        })
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
      }
    },
    closeFrame () {
      this.showFrame = false
      bus.$emit('update_speaker', {})
    },
    async dispatchConversations () {
      try {
        const resp = await this.$options.filters.dispatchStore('getConversations')
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