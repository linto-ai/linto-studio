<template>
  <div class="flex col scrollable">
    <div class="flex col create-form-container">
      <div class="form-field flex col">
        <!-- Conversation Name -->
        <span class="form-label">{{ $t('page.conversations_create.conversation_name') }}<i>*</i>:</span>
        <input 
          type="text" 
          v-model="conversationName.value"
          :class="conversationName.error !== null ? 'error' : ''"
          @change="testConversationName()">
        <span class="error-field" v-if="conversationName.error !== null">{{ conversationName.error }}</span>
      </div>

      <!-- Description -->
      <div class="form-field flex col">
        <span class="form-label">{{ $t('page.conversations_create.description') }}:</span>
        <textarea 
          v-model="conversationDesc.value"
        ></textarea>
        <span class="error-field" v-if="conversationDesc.error !== null">{{ conversationDesc.error }}</span>
      </div>

      <!-- TODO : Conversation Type Selectbox -->
      
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

      <!-- Share with -->
      <div class="form-field flex col">
        <table class="share-with-list" v-if="sharedWith.length > 0">
          <thead>
            <tr>
              <th colspan="2">{{ $t('array_labels.user') }}</th>
              <th>{{ $t('array_labels.editer') }}</th>
              <th>{{ $t('buttons.remove') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in sharedWith" :key="user._id">
              <td class="img"><img class="share-with-list-img" :src="imgPath(user.img)"></td>
              <td>{{ user.firstname }} {{ user.lastname }}</td>
              <td>{{ user.writeAccess === 1 ? 'Reader' : 'Editer' }}</td>
              <td>
                <button class="btn--icon" @click="removeFromList(user)">
                  <span class="icon icon--remove"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex row" style="margin-top: 10px;">
          <button class="btn btn--txt-icon blue" @click="shareWith()">
            <span class="label">{{ $t('buttons.share') }}</span>
            <span class="icon icon__share"></span>
          </button>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-field flex row" style="margin-top: 20px;">
        <button
          @click="handleForm()" 
          class="btn btn--txt-icon green">
          <span class="label">{{ $t('buttons.create_conversation') }}</span>
          <span class="icon" :class="isSending ? 'icon__loading' : ' icon__apply'"></span>
        </button>
      </div>
    </div>
    <ModalCreateConvoShareWith></ModalCreateConvoShareWith>
  </div>
</template>
<script>
import { bus } from '../main.js'
import ModalCreateConvoShareWith from '@/components/ModalCreateConvoShareWith.vue'
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
      audioFileUploadLabel: 'Choose a file...',
      isSending: false
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
        this.sharedWith = data.sharedWith
      })
  },
  methods: {
    shareWith() {
      bus.$emit('modal_share_with', {})
    },
    removeFromList (user) {
      let newList = this.sharedWith.filter(usr => usr._id !== user._id)
      this.sharedWith = newList
      bus.$emit('modal_share_with_remove_user', { user })
    },
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    },
    handleFileUpload() {
      this.audioFile.value = this.$refs.file.files[0]
      const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav']
      console.log(this.audioFile.value)
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
    async handleForm () {
      try {
        if(!this.isSending){
          this.handleFileUpload()
          this.testConversationName() 
          if(this.formValid) {
            this.isSending = true
            let sharedWith = []
            if(this.sharedWith.length > 0) {
              for(let sw of this.sharedWith) {
                sharedWith.push({user_id: sw._id, rights: sw.writeAccess})
              }
            }
            const payload = {
              name: this.conversationName.value,
              description:  this.conversationDesc.value,
              sharedWith 
              // TODO : ConversationType
            }
            
            let formData = new FormData()
            formData.append('file', this.audioFile.value)
            formData.append('payload', JSON.stringify(payload))

            let req = await this.$options.filters.sendMultipartFormData(`${process.env.VUE_APP_CONVO_API}/conversation/create`, 'post', formData)

            if(req.status === 200) {
                bus.$emit('app_notif', {
                  status: 'success',
                  message: req.data.msg,
                  timeout: 3000,
                  redirect: '/interface/conversations'
                })
                this.isSending = false
            }
          }
        }
      } catch (error) {
        console.error(error)
        this.isSending = false
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
    ModalCreateConvoShareWith
  }
}
</script>