<template>
  <div class="flex col scrollable" v-if="userOrgasLoaded">
    <h1>Create conversation</h1>

    <div class="form-field flex row" >
      <!-- organization -->
      <div class="flex col" style="margin-right: 10px;">
        <span class="form-label">Organization</span>
        <select 
          type="text" 
          v-model="conversationOrganization.value"
        >
          <option v-for="orga in userOrganizations" :value="orga._id" :key="orga._id">{{orga.name}}</option>
        </select>
        <span class="error-field" v-if="conversationOrganization.error !== null">{{ conversationOrganization.error }}</span>
      </div>

      <div class="flex col">
        <!--Conversation Name -->
        <span class="form-label">Name</span>
        <input 
          type="text" 
          v-model="conversationName.value"
          :class="conversationName.error !== null ? 'error' : ''"
        >
        <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
      </div>
    </div>

    <div class="flex col form-field" v-if="!selectedOrganizationPersonal">
      <div class="flex row">
        <input type="checkbox" v-model="organizationMemberAccess"> <span class="form-label">Grant organization member access</span>
      </div>
      <select v-model="membersRight.value" v-if="organizationMemberAccess">
        <option v-for="right in rigthsList" :key="right.value" :value="right.value">{{right.txt}}</option>
      </select>
    </div>
    <!--Conversations Descirption -->
    <div class="form-field flex col">
      <span class="form-label">Description</span>
      <input type="text" v-model="conversationDescription.value">
    </div>

    <!-- Audio File / record -->
    <div class="form-field flex col">
      <span class="form-label">Media file</span>
      <div class="flex row" style="position: relative;">
        <input 
          type="file" 
          ref="file" 
          id="conv-audio-file" 
          name="conv-audio-file" @change="handleFileUpload()"
        >
        <label 
          for="conv-audio-file"
          :class="[audioFile.error !== null ? 'error' : '', audioFile.valid ? 'valid' : '', 'input-file-label']"
        >{{ audioFileUploadLabel }}</label>
      </div>

      <span class="error-field" v-if="audioFile.error !== null">{{ audioFile.error }}</span>
    </div>
    <!-- Transcription settings -->

    <div class="flex row">
      <button @click="createConversation()">{{ formSubmitLabel }}</button>
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
      audioFile: {
        value:'',
        error: null,
        valid: false
      },
      conversationOrganization: {
        value:'',
        error: null,
        valid: false
      },
      membersRight: {
        value: 1,
        error: null,
        valid: true
      },
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
      organizationMemberAccess: false,
      audioFileUploadLabel: 'Choose a file...',
      formSubmitLabel: 'Create conversation',
      formState: 'available',
      
    }
  },
  async mounted () {
    await this.dispatchUserOrganizations()

    this.conversationOrganization = {
      value: this.currentOrganizationScope,
      valid: true,
      error: null
    }
  },
  computed: {
    selectedOrganizationPersonal () {
      if(this.userOrgasLoaded && this.userOrganizations.length > 0 && this.conversationOrganization.value !== '' &&  typeof(this.conversationOrganization.value) !== 'undefined') {
        return this.getOrganizationById(this.conversationOrganization.value).personal
      }
      return false
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    },
    formValid () {
      return this.conversationName.valid && this.conversationDescription.valid && this.audioFile.valid && this.conversationOrganization.valid
    }
  },
  methods: {
    testForm() {
      // test conversation name
      this.$options.filters.testName(this.conversationName)
      // test audio file
      this.handleFileUpload()
      // todo > test description
    },
    
    async createConversation() {
      this.testForm()
      if(this.formValid) {
        try {
          let formData = new FormData()
          formData.append('file', this.audioFile.value)
          formData.append('name', this.conversationName.value)
          formData.append('description', this.conversationDescription.value)
          formData.append('organizationId', this.conversationOrganization.value)
          formData.append('membersRight', this.organizationMemberAccess ? this.membersRight.value : 0)

          let req = await  axios(`${process.env.VUE_APP_CONVO_API}/conversations/create`, {
            method: 'post',
            headers: {
              'charset': 'utf-8',
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${this.userInfo.token}`
            },
            data: formData
          })

          if(req.status >= 200 && req.status < 300 && (!!req.data.message || !!req.data.msg)) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.message || req.data.msg || 'Conversation created',
              timeout: 3000,
              redirect:'/interface/conversations'
            })
          } else {
            throw req
          }
        } catch (error) {
            console.error(error)
        }
      } 
      return
    },
    getOrganizationById(id){
      return this.$store.getters.getOrganizationById(id)
    },
    handleFileUpload() {
      this.audioFile.value = this.$refs.file.files[0]
      
      const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav'] // todo: Add video file types
      if (typeof(this.audioFile.value) !== 'undefined' && this.audioFile.value !==  null && !!this.audioFile.value.type) {
        
        const type = this.audioFile.value.type
        if (acceptedTypes.indexOf(type) >= 0) {
          this.audioFile.valid = true
          this.audioFile.error = null
          this.audioFileUploadLabel = '1 file selected'
        } else {
          this.audioFile.valid = false
          this.audioFile.error = 'Invalid file type (accept .mp3, .wav)'
          this.audioFileUploadLabel = 'Choose a file...'
        }
      } else {
          this.audioFile.valid = false
          this.audioFile.error = 'This field is required'
          this.audioFile.value = ''
          this.audioFileUploadLabel = 'Choose a file...'
      }
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    }
  }
}
</script>