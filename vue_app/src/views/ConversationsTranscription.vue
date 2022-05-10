<template>
  <div>
    <h1>Transcription</h1>
    <div id="conversation"></div>
    <div id="conversation-audio-player"></div>
  </div>
</template>
<script>
import axios from 'axios'
import ConversationShare from '@/components/ConversationShare.vue'
import { bus } from '../main.js'
import Editor from '../../public/js/editor.js'

export default {
  props:["userInfo", "currentOrganizationScope"],
  data() {
    return {
      userOrgasLoaded: false,
      orgasLoaded: false,
      convosLoaded: false,
      userRightsLoaded: false,
      usersLoaded: false,
      conversationId: '',
      editor: null,
      editorDebounce: null
    }
  },
  async mounted () {
    await this.dispatchOrganizations() 
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
    await this.dispatchUsers()
    await this.dispatchUserRights()
    this.conversationId = this.$route.params.conversationId

    
  },
  computed: {
    dataLoaded() {
      return this.conversation !== null && this.conversationUsers !== null && this.userRightsLoaded
    },
    conversation(){
      if(this.conversationId !== '' && this.orgasLoaded) {
        return this.$store.getters.getConversationById(this.conversationId)
      } 
      return null
    },
    currentOrganization() {
      if(this.conversations !== null) return this.$store.getters.getOrganizationById(this.conversation.organization.organizationId)
      return null
    },
    userRights(){
      return this.$store.state.userRights
    }
  },
  watch: {
    dataLoaded(data){
      if(data) {
        this.setTranscriptEditor()
      } else{
        this.editor = null
      }
    }
  },
  methods: {
    async setTranscriptEditor(){
        let editorObj = {
          conversationId: this.conversationId,
          wrapperId: 'conversation',
          playerWrapperId: 'conversation-audio-player',
          language: 'fr-FR',
          pagination: 6,
          conversation: this.conversation
        }
        this.editor = new Editor(editorObj)
        this.editor.conversation.addEventListener('conversation_update', async (data) => {
          if(this.editorDebounce === null) {
            this.editorDebounce = setTimeout(async () => {
              await this.updateConversation(this.editor.conversation.conversationObj.text)
            }, 1500)
          } else {
            clearTimeout(this.editorDebounce)
            this.editorDebounce = setTimeout(async () => {
              await this.updateConversation(this.editor.conversation.conversationObj.text)
            }, 1500)
          }
        })
    },
    async updateConversation(text) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversations/${this.conversationId}`, 'patch', {text}) 
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          this.formState = 'success'
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          this.formState = 'available'
          bus.$emit('app_notif', {
            status: 'error',
            message:  error.msg || error.message || 'Error on creating organization',
            timeout: null
          })
        }
      }
    },
    timeToHMS (time) {
      return this.$options.filters.timeToHMS(time)
    },
    dateToJMYHMS(date) {
      return this.$options.filters.dateToJMYHMS(date)
    },
    getUserById(id) {
      return this.$store.getters.getUserById(id)
    },
    getOrganizationById(id){
      return this.$store.getters.getOrganizationById(id)
    },
    async dispatchUsers() {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    },
    async dispatchConversations() {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    async dispatchOrganizations() {
      this.orgasLoaded = await this.$options.filters.dispatchStore('getOrganizations')
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    },
    async dispatchUserRights() {
      this.userRightsLoaded = await this.$options.filters.dispatchStore('getUserRights')
    }
  },
  components: {
    ConversationShare
  }
}
</script>