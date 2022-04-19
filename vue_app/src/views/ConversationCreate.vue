<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex col">
      <div class="flex row">
        <a href="/interface/conversations" class="btn btn-medium secondary" style="margin-bottom:20px;">
          <span class="icon icon__backto"></span>
          <span class="label">Back to conversations</span>
        </a>
      </div>
    </div>
    <h1>Mes conversations</h1>

  <!-- Conversation name -->
   <div class="form-field flex col">
      <span class="form-label">Organization Name</span>
      <input 
        type="text"
        v-model="conversationName.value"
        :class="conversationName.error !== null ? 'error' : ''"
      >
      <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
    </div>
    
      <!-- Description -->
      <div class="form-field flex col">
        <span class="form-label">Description</span>
        <textarea
          v-model="conversationDesription.value"
        ></textarea>
        <span class="error-field" v-if="conversationDesription.error !== null">{{ conversationDesription.error }}</span>
      </div>

      <!-- Audio File -->
      <div class="form-field flex col">
        <span class="form-label">{{ $t('page.conversations_create.audio_file') }}<i>*</i> (.wav, .mp3):</span>
        <div class="input-file-container flex row">
          <input 
            type="file" 
            id="file" 
            ref="file"
            class="input__file" 
            v-on:change="handleFileUpload()"
            accept=".mp3, .wav"
          />
          <label 
            for="file" 
            class="input__file-label-btn" 
            :class="[audioFile.error !== null ? 'error' : '', audioFile.valid ? 'valid' : '']"
          >
            <span class="input__file-icon"></span>
            <span class="input__file-label">{{ audioFileUploadLabel }}</span>
          </label>
        </div>
        <span class="input__file-name" v-if="!!audioFile.value['name'] && audioFile.value['name'] !== ''">{{ audioFile.value.name }}</span>
        <span class="error-field" v-if="audioFile.error !== null">{{ audioFile.error }}</span>
      </div>


      <!-- Organization -->
      
      <div class="form-field flex col">
        <span class="form-label">Choose an organization</span>
        <select v-model="conversationOrganization.value">
          <option v-for="orga in userOrganizations" :key="orga._id" :value="orga._id">
            {{ orga.name }}
          </option>
        </select>
      </div>
      <!-- Share With -->

      <div class="form-field flex row">
        <button @click="createConversation()">Create conversastion</button>
      </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
    props: ['userInfo'],
  data() {
    return {
      orgaLoaded: false,
      userOrgaLoaded: false,
      usersLoaded: false,
      conversationName: {
        value: '',
        error: null,
        valid: false
      },
      conversationDesription: {
        value: '',
        error: null,
        valid: false
      },
      audioFile: {
        value: '',
        error: null,
        valid: false
      },
      conversationOrganization: {
        value: '',
        error: null,
        valid: false
      },
      audioFileUploadLabel: 'Choose a file...'
    }
  },
  computed: {
    dataLoaded () {
      return this.userOrgaLoaded && this.usersLoaded
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    },
    allUsers () {
      return this.$store.state.users
    }
  },
  async mounted () {
    await this.dispatchUserOrganizations()
    await this.dispatchUsers()
  },
  methods: {
    handleFileUpload() {
      this.audioFile.value = this.$refs.file.files[0]
      const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav']
      if (typeof(this.audioFile.value) !== 'undefined' && this.audioFile.value !==  null && !!this.audioFile.value.type) {
        
        const type = this.audioFile.value.type
        if (acceptedTypes.indexOf(type) >= 0) {
          this.audioFile.valid = true
          this.audioFile.error = null
          this.audioFileUploadLabel = '1 file selected'
        } else {
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
    async createConversation() {
      try {
        let formData = new FormData()
        formData.append('file', this.audioFile.value)
        formData.append('name', this.conversationName.value)
        formData.append('description', this.conversationDesription.value)
        formData.append('organizationId', this.conversationOrganization.value)
        formData.append('role', 3)

        let req = await  axios(`${process.env.VUE_APP_CONVO_API}/conversations/create`, {
            method: 'post',
            headers: {
            'charset': 'utf-8',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.userInfo.token}`
            },
            data: formData
          })
          if(req.status === 200 && (!!req.data.message || !!req.data.msg)) {
            bus.$emit('refresh_user', {})
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.message || req.data.msg || 'Conversation created',
              timeout: 3000
            })
          } else {
            throw req
          }
      } catch (error) {
        console.error(error)
      }
      



    },
    async dispatchUserOrganizations () {
      this.userOrgaLoaded = await this.$options.filters.dispatchStore('getUserOrganisations')
    },
    async dispatchUsers () {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    }

   }
}


</script>