<template>
  <div class="flex col scrollable" v-if="userOrgasLoaded">
    <h1>Create conversation</h1>
    <div class="flex row">
      <!-- FORM -->
      <div class="flex col flex1" style="padding: 0 20px;">
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
            <span class="form-label">Title</span>
            <input 
              type="text" 
              v-model="conversationName.value"
              :class="conversationName.error !== null ? 'error' : ''"
            >
            <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
          </div>
        </div>

          <!-- Organization members rights -->
        <div class="flex col form-field" v-if="!selectedOrganizationPersonal">
          <div class="flex row">
            <input type="checkbox" v-model="organizationMemberAccess"> <span class="form-label">Grant organization member access</span>
          </div>
          <select v-model="membersRight.value" v-if="organizationMemberAccess">
            <option v-for="right in rigthsList" :key="right.value" :value="right.value">{{right.txt}}</option>
          </select>
        </div>
        
        <!--Conversations Language -->
        <div class="form-field flex col">
          <span class="form-label">Language</span>
          <select v-model="conversationLanguage.value">
            <option v-for="lang of languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
          </select>
        </div>


        <!--Conversations Descirption -->
        <div class="form-field flex col">
          <span class="form-label">Description</span>
          <textarea v-model="conversationDescription.value"></textarea>
        </div>

        <!-- Audio File / record -->
        <span class="form-label">Media FILE</span>
        <div class="flex row">
          <div class="form-field-wrapper flex row">
            <div class="flex col">
              <div class="form-field flex col">
                <span class="form-label">Media type</span>
                <div class="flex row">
                  <input type="radio" id="media-type-file" value="file" v-model="mediaType">
                  <label for="media-type-file">Media file</label>
                  <input type="radio" id="media-type-mic" value="mic" v-model="mediaType">
                  <label for="media-type-mic">Microphone</label>
                </div>
              </div>
              <div class="flex row" style="position: relative;" v-if="mediaType === 'file'">
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
              <div v-if="mediaType === 'mic'" class="flex row">
                  #Feature
              </div>
            </div>
            <!-- Transcription settings -->
            <div class="flex col">
              <div class="flex col form-field">
                <span class="form-label">Transcription settings</span>
                <div class="flex row">
                  <span class="form-label inline">Diarization</span>
                  <input type="checkbox" v-model="diarizationSelected">
                  <select v-if="diarizationSelected" style="min-width: 140px;" v-model="diarizationSpeakers">
                    <option v-for="i in 11" :value="i+1" :key="i+1">{{i+1}} speakers</option>
                  </select>
                </div>
                <div class="flex row">
                  <span class="form-label inline">Punctuation</span>
                  <input type="checkbox" v-model="punctuationSelected">
                </div>
                <div class="flex row">
                  <span class="form-label inline">Normalization</span>
                  <input type="checkbox" v-model="normalizationSelected">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Transcription settings -->

        <div class="flex row" style="margin-top: 20px;">
          <button @click="createConversation()">{{ formSubmitLabel }}</button>
        </div>
      </div>
      <!-- FORM INFOS -->
      <div class="flex col flex1 form-info-container">
        <span class="form-info-title">Organization</span>
        <p class="form-info-content">Choose the organization scope of your conversation</p>

        <span class="form-info-title">Title</span>
        <p class="form-info-content">The title of your conversation</p>

        <span class="form-info-title">Grant organization members access</span>
        <p class="form-info-content">By default, organization members cannot access the conversation.Check this option to grant access to organization members and select them default rights on the conversation (read, write, ...)</p>

        <span class="form-info-title">Language</span>
        <p class="form-info-content">Select the transcription language for the media file</p>

        <span class="form-info-title">Description</span>
        <p class="form-info-content">A short text describing the context of the conversation</p>

        <span class="form-info-title">Media type</span>
        <ul class="form-info-list">
          <li><strong>File</strong> : allows you to upload a media file to be trnascripted (audio or video)</li>
          <li><strong>Microphone</strong> : allows you to record an audio file directly from your microphone</li>
        </ul>

        <span class="form-info-title">Transcription settings</span>
        <ul class="form-info-list">
          <li><strong>Diarization</strong> : Enable diarization and select the number of speakers</li>
          <li><strong>Punctuation</strong> : Enable punctuation restitution</li>
          <li><strong>Normalization</strong> : Enable normalization and replace text numbers by numbers </li>
        </ul>
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
      conversationLanguage: {
        value: 'fr_FR',
        error: null,
        valid: true
      },
      languages: [
        {value: 'fr_FR', label: 'French'},
        {value: 'en_EN', label: 'English'}
      ],
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


      mediaType: 'file',
      diarizationSelected: false,
      punctuationSelected: false,
      normalizationSelected: false,
      diarizationSpeakers: 2
      
      
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
      
      if(this.mediaType === 'file') {
        // test audio file
        this.handleFileUpload()
      }

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
          
          let transcriptionConfig = { 
            enablePunctuation: this.punctuationSelected,
            enableNormalization: this.normalizationSelected,
            diarizationConfig: {
              enableDiarization: this.diarizationSelected,
              numberOfSpeaker: this.diarizationSelected ? this.diarizationSpeakers : 0,
              maxNumberOfSpeaker: this.diarizationSelected ? this.diarizationSpeakers : 0
            }
          }
          formData.append('transcriptionConfig', JSON.stringify(transcriptionConfig))

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