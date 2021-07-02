<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal" v-if="dataLoaded">
      <div class="modal--header flex row">
        <span class="title flex1">{{ $t('modals.unshare_with.title') }}</span>
        <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body flex col">
        <p v-html="$t('modals.unshare_with.content_html', { firstname: CapitalizeFirstLetter(user.firstname), lastname: CapitalizeFirstLetter(user.lastname), conversationname: conversationName})"></p>
      </div>
      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.cancel') }}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button class="btn btn--txt-icon red" @click="unshare(userId)">
          <span class="label">{{ $t('buttons.unshare') }}</span>
          <span class="icon icon__trash"></span>
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
      userId: null,
      conversationName: null,
      modalShow: false,
      usersLoaded: false
    }
  },
  async mounted () {
    bus.$on('modal_unshare_user', async (data) => {
      this.conversationName = data.conversation_name
      this.userId = data.userId
      await this.dispatchUsers()
      this.showModal()
    })
  },
  computed: {
   dataLoaded () {
     return this.usersLoaded
   },
   user () {
     return this.$store.getters.getUserById(this.userId)
   }
  },
  methods: {
    async unshare (userId) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/sharewith/${userId}`, 'delete', {})
        if(req.status === 200 && !!req.data.msg) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
          bus.$emit('refresh_conversation', {})
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
    showModal () {
      this.modalShow = true
    },
    closeModal () {
      this.modalShow = false
    },
    CapitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    async dispatchUsers () {
      try {
        const resp = await this.$options.filters.dispatchStore('getUsers')
        if (resp.status === 'success') {
          this.usersLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.usersLoaded = false
      }
    }
  }
}
</script>
