<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal" v-if="speaker !== null && targetSpeaker !== null">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.merge_speakers.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <!-- BODY : merge with a target speaker -->
      <div class="modal--body flex col">
        <p v-html="$t('modals.merge_speakers.content_html', {speakername: speaker.speaker_name, targetspeaker: targetSpeaker.speaker_name })"></p>
      </div>
      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.cancel') }}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn--txt-icon green" @click="mergeSpeakers()">
          <span class="label">{{ $t('buttons.apply') }}</span>
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
      speaker: null,
      targetSpeaker: null
    }
  },
  mounted () {
    bus.$on('modal_merge_speaker_by_target', (data) => {
      this.speaker = data.speaker
      this.targetSpeaker = data.targetSpeaker
      this.showModal()
    })
  },
  methods: {
    showModal () {
      this.modalShow = true
    },
    closeModal () {
      this.modalShow = false
      bus.$emit(`update_speaker`, {})
    },
    async mergeSpeakers () {
      try {
        const payload =  {
          newspeakerid: this.targetSpeaker.speaker_id
        }
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/mergespeakers/${this.speaker.speaker_id}`, 'patch', payload)

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
    }
  }
}
</script>
