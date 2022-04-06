<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.delete_conversation.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body flex col">
        <p v-html="$t('modals.delete_conversation.content_html', { convoTitle })"></p>
      </div>
      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.cancel') }}</span>
          <span class="icon icon__cancel"></span>
        </button>

          <button class="btn btn--txt-icon red" @click="removeConversation(convoId)">
          <span class="label">{{ $t('buttons.remove') }}</span>
          <span class="icon icon__trash"></span>
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
      convoTitle: '',
      convoId: ''
    }
  },
  async mounted () {
    bus.$on('modal_remove_conversation', async (data) => {
      this.convoTitle = data.convo.name
      this.convoId = data.convo._id
      this.showModal()
    })
  },
  methods: {
    showModal () {
      this.modalShow = true
    },
    closeModal () {
      this.modalShow = false
    },
    async removeConversation (convoId) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}`, 'delete', {})

        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          bus.$emit('refresh_conversations', {})
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
          message: !!error.msg ? error.msg : 'Error on deleting conversation',
          timeout: null
        })
      }
    }
  }
}
</script>
