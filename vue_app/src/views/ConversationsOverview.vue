<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex row conversation-actions">
      <a :href="`/interface/conversations/${conversation._id}/transcription`" style="margin-right: 10px;">Transcription</a>

      <ConversationShare 
        :userInfo="userInfo" 
        :currentOrganizationScope="currentOrganizationScope"
        :conversation="conversation"
      ></ConversationShare>
    </div>
    <div class="flex row">
      <h1>Conversation overview</h1>
    </div>

    <div class="flex row">
      <div class="flex col flex1">
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
      
      <div class="form-field flex col" v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE)">
        <span class="form-label">Agenda</span>
          <textarea  v-model="conversationAgenda.value"></textarea>
          <span class="error-field" v-if="conversationAgenda.error !== null">{{conversationAgenda.error}}</span>
        </div>
        <div v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE) &&  conversationDescription.value.length > 0">{{ conversationDescription.value }}</div>
      </div>

      <div class="flex col flex1">
        <span class="form-label">Title</span>
        <ul>
          <li><span class="info-list-label">Owner : </span><span class="info-list-value">{{ getUserById(currentOrganization.owner).email}}</span></li> 
          <li><span class="info-list-label">Created date : </span><span class="info-list-value">{{dateToJMYHMS(conversation.created)}}</span></li> 
          <li><span class="info-list-label">Last update : </span><span class="info-list-value">{{dateToJMYHMS(conversation.last_update)}}</span></li> 
        </ul>

        <span class="form-label">Media file</span>
        <ul>
          <li><span class="info-list-label">File : </span><span class="info-list-value"><a target="_blank" :href="`/${conversation.audio.filepath}`">{{conversation.audio.filename}}</a></span></li> 
          <li><span class="info-list-label">Duration : </span><span class="info-list-value">{{timeToHMS(conversation.audio.duration)}}</span></li> 
        
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
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
      },
      conversationAgenda: {
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
        this.conversationAgenda = {
          value: this.conversation.agenda,
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
    currentOrganization() {
      if(this.conversations !== null) return this.$store.getters.getOrganizationById(this.conversation.organization.organizationId)
      return null
    },
    userRights(){
      return this.$store.state.userRights
    }
    
  },
  methods: {
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