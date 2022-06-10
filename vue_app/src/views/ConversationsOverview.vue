<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex row conversation-actions">
      <a :href="`/interface/conversations/${conversation._id}/transcription`" style="margin-right: 10px;">>>> Transcription</a>
      <ConversationShare 
        :userInfo="userInfo" 
        :currentOrganizationScope="currentOrganizationScope"
        :conversation="conversation"
      ></ConversationShare>
      <button v-if="userRights.hasRightAccess(userRight, userRights.DELETE)" @click="deleteConversationConfirm()">Delete</button>
    </div>
    <div class="flex col">
      <h1>Conversation overview</h1>
      <span class="conversation-dates">Created at : {{dateToJMYHMS(conversation.created)}} / Last update : {{dateToJMYHMS(conversation.last_update)}}</span>
    </div>
    <div class="flex row">
       <!-- LEFT COLUMN -->
      <div class="flex col flex1">
        <span class="form-label">Global information</span>
        <div class="flex col form-field-wrapper">
          <!-- conversation name -->
          <div class="form-field flex col" v-if="userRights.hasRightAccess(userRight, userRights.WRITE)">
            <span class="form-label">Title</span>
            <input  type="text" v-model="conversationName.value" @blur="testConverationTitle()">
            <span class="error-field" v-if="conversationName.error !== null">{{conversationName.error}}</span>
          </div>
          <div v-else>{{ conversationName.value }}</div>
          
          <!-- conversation description -->
            <div class="form-field flex col" v-if="userRights.hasRightAccess(userRight, userRights.WRITE)">
            <span class="form-label">Description</span>
            <textarea 
              v-model="conversationDescription.value" 
              @blur="testConverationDescription()"
              :class="conversationDescription.error !== null ? 'error' : ''"
            ></textarea>
            <span class="error-field" v-if="conversationDescription.error !== null">{{conversationDescription.error}}</span>
          </div>
          <div v-if="!userRights.hasRightAccess(userRight, userRights.WRITE) &&  conversationDescription.value.length > 0">
            <span class="form-label">Description</span>
            <div>{{ conversationDescription.value }}</div>
          </div>
          
          <!-- Conversation Agenda  
          <div class="form-field flex col" v-if="userRights.hasRightAccess(conversation.userRight, userRights.WRITE)">
            <span class="form-label">Agenda</span>
            <textarea 
              v-model="conversationAgenda.value"
              @blur="testConverationAgenda()"
              :class="conversationAgenda.error !== null ? 'error' : ''"
            ></textarea>
            <span class="error-field" v-if="conversationAgenda.error !== null">{{conversationAgenda.error}}</span>
          </div>
          <div v-if="!userRights.hasRightAccess(conversation.userRight, userRights.WRITE) && conversationAgenda.value.length > 0">
            <span class="form-label">Agenda</span>
            <div>{{conversationAgenda.value }}</div>
          </div>
        </div> -->
        </div>
        
        <!-- Organization members -->
        <span class="form-label" v-if="userInOrga && !conversation.personal">Organization members</span>
        <div class="flex col form-field-wrapper" v-if="userInOrga && !conversation.personal && userRights.hasRightAccess(userRight, userRights.SHARE)">
          <div class="flex col form-field">
            <div class="flex row">
              <input type="checkbox" v-model="organizationMemberAccess" @change="toggleOrgaMembersAccess()"> <span class="form-label">Grant organization member access</span>
            </div>
            <select v-model="membersRight.value" v-if="organizationMemberAccess" @change="updateOrgaMembersAccess(membersRight.value)">
              <option v-for="right in rigthsList" :key="right.value" :value="right.value">{{right.txt}}</option>
            </select>
          </div>
        </div>
        <div class="flex col form-field-wrapper" v-if="userInOrga && !conversation.personal && !userRights.hasRightAccess(userRight, userRights.SHARE)">
          Members {{ rigthsList.find(right => right.value === membersRight.value ).txt.toLowerCase() }}
        </div>
      </div>
      
      <!-- RIGHT COLUMN -->
      <div class="flex col flex1">
        <!-- Media file -->
        <span class="form-label">Media file</span>
        <div class="flex col form-field-wrapper">
          <div class="conversation-info-item fex row">
            <span class="info-list-label">File : </span><span class="info-list-value"><a target="_blank" :href="`/${conversation.audio.filepath}`">{{conversation.audio.filename}}</a></span>
          </div>
          <div class="conversation-info-item fex row">
            <span class="info-list-label">Duration : </span><span class="info-list-value">{{timeToHMS(conversation.audio.duration)}}</span>
          </div>
        </div>
        <!-- Transcription settings -->
        <span class="form-label">Transcription settings</span>
        <div class="flex col form-field-wrapper">
          <div class="conversation-info-item fex row">
            <span class="info-list-label">Diarization : </span><span class="info-list-value">{{ conversation.transcriptionConfig.diarizationConfig.enableDiarization ? 'enabled' : 'disabled' }}</span>
            <span v-if="conversation.transcriptionConfig.diarizationConfig.enableDiarization">({{ conversation.transcriptionConfig.diarizationConfig.numberOfSpeaker }} speakers)</span>
          </div>
          <div class="conversation-info-item fex row">
            <span class="info-list-label">Punctuation : </span><span class="info-list-value">{{ conversation.transcriptionConfig.enablePunctuation ? 'enabled' : 'disabled' }}</span>
          </div>
          <div class="conversation-info-item fex row">
            <span class="info-list-label">Punctuation : </span><span class="info-list-value">{{ conversation.transcriptionConfig.enableNormalization ? 'enabled' : 'disabled' }}</span>
          </div>
        </div>
      </div>
    </div>
    <Modal></Modal>
  </div>
</template>
<script>
import Modal from '@/components/Modal.vue'
import ConversationShare from '@/components/ConversationShare.vue'
import { bus } from '../main.js'
export default {
  props:["userInfo", "currentOrganizationScope"],
  data() {
    return {
      conversationLoaded: false,
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
      membersRight: {
        value: 1,
        error: null,
        valid: true
      },
      organizationMemberAccess: false,
      rigthsList: [
        {
          value: 1,
          txt: 'Can read'
        },
        {
          value: 3,
          txt: 'Can comment'
        },
        {
          value: 7,
          txt: 'Can write'
        },
        {
          value: 23,
          txt: 'Can share'
        },
        {
          value: 31,
          txt: 'Full rights'
        }
      ],
    }
  },
  computed: {
    dataLoaded() {
      return this.conversationLoaded
    },
    conversation() {
      return this.$store.state.conversation
    },
    userOrganizations() {
      return this.$store.state.userOrganizations
    },
    userInOrga() {
      if(this.conversationLoaded){
        return this.conversation.userAccess.role > 0
      }
      return false
    },
    userRight() {
      return this.conversation.userAccess.right
    },
    userRights() {
      return this.$store.state.userRights
    }
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
        this.organizationMemberAccess = this.conversation.organization.membersRight !== 0
        this.membersRight.value = this.conversation.organization.membersRight
      }
    },
    
  },
  async mounted(){
    this.conversationId = this.$route.params.conversationId
    await this.dispatchConversation()
  },
  methods: {
    async testConverationTitle () {
        this.$options.filters.testName(this.conversationName)
        if(this.conversationName.valid) {
          await this.updateConversation('name', this.conversationName.value)
        }
    },
    async testConverationDescription () {
        this.$options.filters.testDescription(this.conversationDescription)
        if(this.conversationDescription.valid) {
          await this.updateConversation('description', this.conversationDescription.value)
        }
    },
    async testConverationAgenda () {
      this.$options.filters.testDescription(this.conversationAgenda)
      if(this.conversationAgenda.valid) {
        await this.updateConversation('agenda', this.conversationAgenda.value)
      }
    },
    async updateConversation(key, value) {
      try {
        let payload = {}
        payload[key] = value

        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversations/${this.conversationId}`, 'patch', payload) 
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
    deleteConversationConfirm(){
      bus.$emit('show_modal', { 
          title: 'Delete conversation',
          content: `Are you sure you want to delete permanently the conversation "${this.conversation.name}" ?`,
          actionBtnLabel: 'Delete conversation',
          actionName: 'delete_conversation',
          conversation: this.conversation
      })
    },
    async toggleOrgaMembersAccess() {
      if(this.organizationMemberAccess) {
        this.membersRight.value = 1
        await this.updateOrgaMembersAccess(1)
      }
      else{
        this.membersRight.value = 0
        await this.updateOrgaMembersAccess(0)
      } 
    },
    async updateOrgaMembersAccess(value) {
      let organization = this.conversation.organization
      organization.membersRight = value
      await this.updateConversation('organization', organization)
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
    ConversationShare,
    Modal
  }
}
</script>