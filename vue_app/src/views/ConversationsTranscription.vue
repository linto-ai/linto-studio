<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex row conversation-actions">
      <ConversationShare 
        :userInfo="userInfo" 
        :currentOrganizationScope="currentOrganizationScope"
        :conversation="conversation"
      ></ConversationShare>
    </div>
    <h1>Transcription</h1>
    <div id="conversationss"></div>
    <div id="conversation-audio-player"></div>
  </div>
</template>
<script>
import ConversationShare from '@/components/ConversationShare.vue'
import { bus } from '../main.js'
import Editor from '../../public/js/transcript-editor/editor.js'

export default {
  props:["userInfo", "currentOrganizationScope"],
  data() {
    return {
      conversationLoaded: false,
      conversationId: '',
      editor: null,
      editorInitialized: false,
      editorSettings: {},
      editorDebounce: null
    }
  },
  async mounted () {
    this.conversationId = this.$route.params.conversationId
    await this.dispatchConversation()
    this.initTranscriptEditor()
  },
  computed: {
    dataLoaded() {
      return this.conversationLoaded
    },
    conversation() {
      return this.$store.state.conversation
    },
    userRight() {
      if(this.conversationLoaded) {
        return this.conversation.userAccess.right
      }
      return 0
    },
    userRights() {
      return this.$store.state.userRights
    }
  },
  methods: {
    initTranscriptEditor(){
        // TODO >  Get editor settings cookie for pagination ?
        this.editorSettings = {
          conversationId: this.conversationId,
          wrapperId: 'conversationss',
          playerWrapperId: 'conversation-audio-player',
          language: 'fr-FR',
          pagination: 4,
          conversation: this.conversation
        }
        this.editor = new Editor(this.editorSettings)
        this.bindEditorEvents()
    },
    bindEditorEvents() {
      this.editor.conversation.addEventListener('conversation_update', async (data) => {
          if(this.editorDebounce === null) {
            this.editorDebounce = setTimeout(async () => {
              await this.updateConversationText(this.editor.conversation.conversationObj.text)
            }, 1500)
          } else {
            clearTimeout(this.editorDebounce)
            this.editorDebounce = setTimeout(async () => {
              await this.updateConversationText(this.editor.conversation.conversationObj.text)
            }, 1500)
          }
        })

        this.editor.conversation.addEventListener('speaker_created', async (data) => {
          await this.updateConversationSpeaker(this.editor.conversation.conversationObj.speakers)
        })
    },
    async updateConversationText(text) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversations/${this.conversationId}`, 'patch', {text}) 
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          await this.dispatchConversation()
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
          bus.$emit('app_notif', {
            status: 'error',
            message:  error.msg || error.message || 'Error on creating organization',
            timeout: null
          })
        }
      }
    },
    async updateConversationSpeaker(speakers) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversations/${this.conversationId}`, 'patch', {speakers}) 
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          await this.dispatchConversation()
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
    async dispatchConversation() {
      this.conversationLoaded = await this.$options.filters.dispatchStore('getConversationById', {conversationId: this.conversationId})
    }
  },
  components: {
    ConversationShare
  }
}
</script>