<template>
  <div class="flex col">
    <div class="flex col create-form-container">
      <div class="form-field flex col">
        <!-- Conversation Name -->
        <span class="form-label">Conversation name <i>*</i> :</span>
        <input 
          type="text" 
          v-model="conversationName.value"
          :class="conversationName.error !== null ? 'error' : ''"
          @change="testConversationName()">
        <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
      </div>

      <!-- Description -->
      <div class="form-field flex col">
        <span class="form-label">Description :</span>
        <textarea 
          v-model="conversationDesc.value"
        ></textarea>
        <span class="error-field" v-if="conversationDesc.error !== null">{{ conversationDesc.error }}</span>
      </div>

      <!-- TODO : Conversation Type Selectbox -->
      
      <!-- Audio File -->
      <div class="form-field flex col">
        <span class="form-label">Audio file (.wav, .mp3) :</span>
        <div class="input-file-container flex col">
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
        <span class="error-field" v-if="audioFile.error !== null">{{ audioFile.error }}</span>
      </div>

      <!-- Share with -->
      <div class="form-field flex row">
      <table v-if="sharedWith.length > 0">
        <thead>
          <tr>
            <th colspan="2">User</th>
            <th>Edition rights</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in sharedWith" :key="user._id">
            <td><img :src="imgPath(user.img)"></td>
            <td>{{ user.firstname }} {{ user.lastname }}</td>
            <td>{{ user.writeAccess }}</td>
          </tr>
        </tbody>

      </table>
      <button @click="shareWith()">Share WITH</button>

      </div>

      <!-- Submit -->
      <div class="form-field flex row" style="margin-top: 20px;">
        <button
          @click="handleForm()" 
          class="btn btn--txt-icon blue">
          <span class="label">Create conversation</span>
          <span class="icon icon__apply"></span></button>
      </div>
    </div>
    <ModalShareWith></ModalShareWith>
  </div>
</template>
<script>
import { bus } from '../main.js'
import axios from 'axios'
import ModalShareWith from '@/components/ModalShareWith.vue'
export default {
  data () {
    return {
      conversationName: {
        value:'',
        error: null,
        valid: false
      },
      conversationDesc: {
        value:'',
        error: null,
        valid: false
      }, 
      audioFile: {
        value: '',
        error: null,
        valid: false
      },
      sharedWith: [],
      audioFileUploadLabel: 'Choose a file...'
    }
  },
  computed: {
    formValid () {
      return this.conversationName.valid && this.audioFile.valid
    },
    authToken () {
      return this.$store.state.auth_token
    }
  },
  async mounted () {
      await this.$options.filters.dispatchStore('getuserInfo')

      bus.$on('update_share_with', (data) => {
        this.sharedWith = data
      })
  },
  methods: {
    shareWith() {
      bus.$emit('modal_share_with', {})
    },
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    },
    handleFileUpload() {
      this.audioFile.value = this.$refs.file.files[0]
      const acceptedTypes = ['audio/mpeg', 'audio/wav']
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
          this.audioFileUploadLabel = 'Choose a file...'
      }
    },
    async handleForm () {
      try {
        this.handleFileUpload()
        this.testConversationName() 
        if(this.formValid) {
          const payload = {
            name: this.conversationName.value,
            description:  this.conversationDesc.value,
            sharedWith: this.sharedWith
            // TODO : ConversationType
          }
          
          let formData = new FormData()
          formData.append('file', this.audioFile.value)
          formData.append('payload', JSON.stringify(payload))


          let req = await this.$options.filters.sendMultipartFormData(`${process.env.VUE_APP_CONVO_API}/conversation/create`, 'post', formData)

          if(req.status === 200) {
              bus.$emit('app_notif', {
                status: 'success',
                message: createConvo.data.msg,
                timeout: 3000,
                redirect: '/interface/conversations'
              })
          }
        }  
      } catch (error) {
        console.error(error)
      }
      
    },
    testConversationName () {
      this.conversationName.valid = false
      this.conversationName.error = null
        
      if (this.conversationName.value === '') {
        this.conversationName.error = 'This field is required'
      } else {
        this.conversationName.valid = true
      }
    }
  },
  components: {
    ModalShareWith
  }
}
</script>