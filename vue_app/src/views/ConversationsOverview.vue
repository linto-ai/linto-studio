<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Conversation overview</h1>
    <div class="flex col">
      <span>Users</span>
      <div class="flex col">
        Organization
        <div v-for="usr of conversationUsers.organization" :key="usr._id">
          {{ usr.email }} / role: {{ usr.role }} / right: {{ usr.right }}
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios'
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
    },
    conversationUsers () {
      if(this.usersLoaded && this.conversation !== null) {
        return this.$store.getters.getUsersByConversation(this.conversationId)
      } return null
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
  }
}
</script>