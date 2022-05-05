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

    <!-- conversation name -->
    <div class="form-field flex col" v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE)"
    >
      <span class="form-label">Title</span>
      <input  type="text" :value="conversationName.value">
      <span class="error-field" v-if="conversationName.error !== null">{{conversationName.error}}</span>
    </div>
    <div v-else>{{ conversationName.value }}</div>
    <!-- conversation description -->
    <div class="form-field flex col" v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE)">
      <span class="form-label">Description</span>
      <textarea  v-model="conversationDescription.value"></textarea>
      <span class="error-field" v-if="conversationName.error !== null">{{conversationName.error}}</span>
    </div>
    <div v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE) &&  conversationDescription.value.length > 0">{{ conversationDescription.value }}</div>
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
    await this.dispatchUserRights()


    this.conversationId = this.$route.params.conversationId
  },
  watch:{
    dataLoaded(data) {
      if(data) {
        this.conversationName = {
          value: this.conversation.name,
          error: null,
          valid: true
        }
        this.conversationDescription = {
          value: this.conversation.description,
          error: null,
          valid: true
        }
      }
    }
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
    userRights(){
      return this.$store.state.userRights
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