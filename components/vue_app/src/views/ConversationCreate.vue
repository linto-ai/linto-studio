<template>
    <div class="flex col">
      
      <div class="flex col create-form-container">
        <div class="form-field flex col">
          <span class="form-label">Conversation name <i>*</i> :</span>
          <input 
            type="text" 
            v-model="conversationName.value"
            :class="conversationName.error !== null ? 'error' : ''"
            @change="testConversationName()">
          <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
        </div>
        <div class="form-field flex col">
          <span class="form-label">Description :</span>
          <textarea 
            v-model="conversationDesc.value"
          ></textarea>
          <span class="error-field" v-if="conversationDesc.error !== null">{{ conversationDesc.error }}</span>
        </div>

        <!-- TODO : Conversation Type Selectbox -->

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
        <div class="form-field flex row" style="margin-top: 20px;">
          <button
            @click="handleForm()" 
            class="btn btn--txt-icon blue">
            <span class="label">Create conversation</span>
            <span class="icon icon__apply"></span></button>
        </div>
      </div>
    </div>
</template>
<script>
import { bus } from '../main.js'
import axios from 'axios'
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
      audioFileUploadLabel: 'Choose a file...'
    }
  },
  computed: {
    formValid () {
      return this.conversationName.valid && this.audioFile.valid
    }
  },
  methods: {
    
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
      this.handleFileUpload()
      this.testConversationName() 
      if(this.formValid) {
        const payload = {
          name: this.conversationName.value,
          description:  this.conversationDesc.value,
          owner: {
            user_id: "todefine1",
            name: "Romain Lopez",
            img: "/assets/img/users/user1.jpg"
          },
          sharedWith: []
          // TODO : ConversationType
        }
        
        let formData = new FormData()
        formData.append('file', this.audioFile.value)
        formData.append('payload', JSON.stringify(payload))
        
        const createConvo = await axios(`${process.env.VUE_APP_CONVO_API}/conversation/create`, {
          method: 'post',
          headers: {
            'charset': 'utf-8',
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        })
        if(createConvo.status === 200) {
            bus.$emit('app_notif', {
              status: 'success',
              message: createConvo.data.msg,
              timeout: 3000,
              redirect: '/interface/conversations'
            })
        }
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
    /*
    async instalLocalSkill (event) {
     this.handleFileUpload()
     try {
      if (this.audioFile.valid && !this.processing) {
        this.processing = true
        this.setBtnLoading(event)
        
        let formData = new FormData()
        formData.append('files', this.audioFile.value)
        const installSkill = await axios.post(`${process.env.VUE_APP_NODERED_RED}/node/file`,
          formData, 
          {
            headers: {
              'charset': 'utf-8',
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        if (installSkill.status === 202) { // module already installed
          bus.$emit('app_notif', {
            status: 'error',
            msg: 'this module is already installed',
            timeout: 3000,
            redirect: false
          })
          this.processing = false
          this.unsetBtnLoading()

        } else if (installSkill.status === 200) { // success
          let payload = {
            name: installSkill.data.name,
            version: installSkill.data.version
          }
          const updateLocalSkills = await axios(`${process.env.VUE_APP_URL}/api/localskills`, {
            method:'post',
            data: payload
          })
          if(updateLocalSkills.data.status === 'success') {
             bus.$emit('app_notif', {
              status: 'success',
              msg: updateLocalSkills.data.msg,
              timeout: 3000,
              redirect: false
            })
            await this.dispatchStore('getLocalSkills')
            this.unsetBtnLoading()
            this.processing = false

          } else {
            throw installNode
          }
        } else {
          throw installSkill
        }
      }
    } catch (error) {
        console.error(error)
        if (!!error.data) {
          bus.$emit('app_notif', {
            status: 'error',
            msg: error.data.msg,
            timeout: 3000,
            redirect: false
          })
        } else {
          bus.$emit('app_notif', {
            status: 'error',
            msg: `error on installing local skill`,
            timeout: 3000,
            redirect: false
          })
        }
        await this.dispatchStore('getLocalSkills')
        this.unsetBtnLoading()
        this.processing = false
      }
    }*/
  } 
}
</script>