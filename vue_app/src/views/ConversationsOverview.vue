<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex row conversation-actions">
      <ConversationShare 
        :userInfo="userInfo" 
        :currentOrganizationScope="currentOrganizationScope"
        :conversation="conversation"
      ></ConversationShare>
    </div>
    <h1>Conversation overview</h1>
  </div>
</template>
<script>
import axios from 'axios'
import ConversationShare from '@/components/ConversationShare.vue'
import { bus } from '../main.js'
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
      conversationName: {
        value:'',
        error: null,
        valid: false
      },
      conversationDescription: {
        value:'',
        error: null,
        valid: true
      }
    }
  },
  async mounted () {
    await this.dispatchOrganizations() 
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
    await this.dispatchUsers()


    this.conversationId = this.$route.params.conversationId
  },
  computed: {
    dataLoaded() {
      return this.conversation !== null && this.conversationUsers !== null
    },
    conversation(){
      if(this.conversationId !== '' && this.orgasLoaded) {
        return this.$store.getters.getConversationById(this.conversationId)
      } 
      return null
    }
    
  },
  methods: {
    getUserById(id) {
      return this.$store.getters.getUserById(id)
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