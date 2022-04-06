<template>
  <div class="flex col scrollable">
    <h1>Your profile</h1>
    <div class="flex row">
      <div class="flex col flex1 form-container">
        <h2>Personnal informations</h2>
        <!-- Firstname -->
        <div class="form-field flex col">
          <span class="form-label">Firstname<i>*</i>:</span>
          <input 
            type="text" 
            v-model="firstname.value"
            :class="firstname.error !== null ? 'error' : ''"
          >
          <span class="error-field" v-if="firstname.error !== null">{{ firstname.error }}</span>
        </div>

        <!-- Lastname -->
        <div class="form-field flex col">
          <span class="form-label">Lastname<i>*</i>:</span>
          <input 
            type="text" 
            v-model="lastname.value"
            :class="lastname.error !== null ? 'error' : ''"
          >
          <span class="error-field" v-if="lastname.error !== null">{{ lastname.error }}</span>
        </div>
        
        <!-- Email -->
        <div class="form-field flex col">
          <span class="form-label">Email<i>*</i>:</span>
          <input 
            type="text" 
            v-model="email.value"
            :class="email.error !== null ? 'error' : ''"
          >
          <span class="error-field" v-if="email.error !== null">{{ email.error }}</span>
        </div>

        <div class="form-field flex row">
          <button class="btn btn--txt-icon green" @click="sendInfoForm()" style="margin-top: 10px;">
            <span class="label">Update</span>
            <span class="icon icon__apply"></span>
          </button>
        </div>
      </div>

      <div class="flex col flex1 form-container">
        <h2>Reset password</h2>
        
        <!-- New password -->
        <div class="form-field flex col">
          <span class="form-label">New password<i>*</i>:</span>
          <input 
            type="text" 
            v-model="newPassword.value"
            :class="newPassword.error !== null ? 'error' : ''"
          >
          <span class="error-field" v-if="newPassword.error !== null">{{ newPassword.error }}</span>
        </div>
        
        <!-- New password confirm -->
        <div class="form-field flex col">
          <span class="form-label">New password confirmation<i>*</i>:</span>
          <input 
            type="text" 
            v-model="newPasswordConfirm.value"
            :class="newPasswordConfirm.error !== null ? 'error' : ''"
          >
          <span class="error-field" v-if="newPasswordConfirm.error !== null">{{ newPasswordConfirm.error }}</span>
        </div>
        <div class="form-field flex row" style="margin-top: 10px;">
          <button class="btn btn--txt-icon green" @click="sendPassword()">
            <span class="label">Update</span>
            <span class="icon icon__apply"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="flex row">
      <div class="flex col flex1 form-container">
        <h2>Profile picture</h2>
        <div class="flex row">
          <div class="flex col flex1">
            <img :src="'/' + userInfo.img" class="user-profil-picture">
          </div>
          <div class="flex col flex1">
            <!-- Profil picture -->
            <div class="form-field flex col">
              <span class="form-label">Image (.png, .jpg) :</span>
              <div class="input-file-container flex row">
                <input 
                  type="file" 
                  id="file" 
                  ref="file"
                  class="input__file" 
                  v-on:change="handleFileUpload()"
                  accept=".png, .jpg, .jpeg"
                />
                <label 
                  for="file" 
                  class="input__file-label-btn" 
                  :class="[picture.error !== null ? 'error' : '', picture.valid ? 'valid' : '']"
                >
                  <span class="input__file-icon"></span>
                  <span class="input__file-label">{{ pictureUploadLabel }}</span>
                </label>
              </div>
              <span class="input__file-name" v-if="picture.value !== '' && picture.value['name'] !== ''">{{ picture.value.name }}</span>
              <span class="error-field" v-if="picture.error !== null">{{ picture.error }}</span>
            </div>
            <div class="form-field flex row" style="margin-top: 10px;">
              <button
                @click="handlePictureForm()" 
                class="btn btn--txt-icon green">
              <span class="label">Update picture</span>
              <span class="icon icon__apply"></span>
            </button>
          </div>
          </div>
        </div>
      </div>
      <div class="flex col flex1 form-container no-border"></div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  props: ['userInfo'],
  data () {
    return {
      firstname: {
        value: '',
        error: null,
        valid: false
      },
      lastname: {
        value: '',
        error: null,
        valid: false
      },
      email: {
        value: '',
        error: null,
        valid: false
      },
      newPassword: {
        value: '',
        error: null,
        valid: false
      },
      newPasswordConfirm: {
        value: '',
        error: null,
        valid: false
      },
      picture: {
        value: '',
        error: null,
        valid: false
      },
      pictureUploadLabel: 'Choose a file...'
    }
  },
  mounted () {
  },
  computed: { 
    infoFormValid () {
      return this.firstname.valid && this.lastname.valid && this.email.valid
    },
    pswdFormValid () {
      return this.newPassword.valid && this.newPasswordConfirm.valid
    }
  },
  watch: {
    userInfo (data) {
      this.firstname = {
        value: data.firstname,
        error: null,
        valid: true
      }
      this.lastname = {
        value: data.lastname,
        error: null,
        valid: true
      }
      this.email = {
        value: data.email,
        error: null,
        valid: true
      }
    },
  },
  methods: {
    handleInfoForm () {
      this.testName(this.firstname)
      this.testName(this.lastname)
      this.testEmail(this.email)
    },
    async sendInfoForm () {
      try {
        this.handleInfoForm()
        if(this.infoFormValid) {
          let payload = {}
          if(this.firstname.value !== this.userInfo.firstname) payload.firstname = this.firstname.value
          if(this.lastname.value !== this.userInfo.lastname) payload.lastname = this.lastname.value
          if(this.email.value !== this.userInfo.email) payload.email = this.email.value
          if(Object.keys(payload).length > 0) {
            const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/users/${this.userInfo._id}/infos`, 'put', {payload})
            if(req.status === 200 && !!req.data.msg) {
              //await this.$options.filters.dispatchStore('getuserInfo')
              bus.$emit('refresh_user', {})
              bus.$emit('app_notif', {
                status: 'success',
                message: req.data.msg,
                timeout: 3000
              })
            } else {
              throw req
            }
          }
        }
      }
      catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.msg ? error.msg : 'Error on updating speaker',
          timeout: null
        })
      }
    },
    handlePasswordForm () {
      this.testPassword(this.newPassword)
      this.testPasswordConfirm(this.newPasswordConfirm, this.newPassword)
    },
    async sendPassword () {
      this.handlePasswordForm()
      if(this.pswdFormValid) {
        let payload = {
          newPassword: this.newPassword.value
        }
        const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/users/${this.userInfo._id}/pswd`, 'put', payload)
        if(req.status === 200 && !!req.data.msg) {
          //await this.$options.filters.dispatchStore('getuserInfo')
          bus.$emit('refresh_user', {})
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg,
            timeout: 3000
          })
        } else {
          throw req
        }
      } 
    },
    handleFileUpload() {
      this.picture.value = this.$refs.file.files[0]
      const acceptedTypes = ['image/png', 'image/jpeg']
      if (typeof(this.picture.value) !== 'undefined' && this.picture.value !==  null && !!this.picture.value.type) {
        const type = this.picture.value.type
        if (acceptedTypes.indexOf(type) >= 0) {
          this.picture.valid = true
          this.picture.error = null
          this.pictureUploadLabel = '1 file selected'
        } else {
          this.picture.valid = false
          this.picture.error = 'Invalid file type (accept .png, .jpg, .jpeg)'
          this.pictureUploadLabel = 'Choose a file...'
        }
      } else {
          this.picture.valid = false
          this.picture.error = 'This field is required'
          this.picture.value = ''
          this.pictureUploadLabel = 'Choose a file...'
      }
    },
    async handlePictureForm () {
      this.handleFileUpload()
      if(this.picture.valid) {
        try {
          let formData = new FormData()
          formData.append('file', this.picture.value)
          const req = await axios(`${process.env.VUE_APP_CONVO_API}/users/${this.userInfo._id}/picture`, {
            method: 'put',
            headers: {
            'charset': 'utf-8',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.userInfo.token}`
            },
            data: formData
          })
          if(req.status === 200 && !!req.data.msg) {
            //await this.$options.filters.dispatchStore('getuserInfo')
            bus.$emit('refresh_user', {})
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
          } else {
            throw req
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        this.picture.error = 'Field required'
      }
    },
    testName (obj) {
      return this.$options.filters.testName(obj)
    },
    testEmail (obj) {
      return this.$options.filters.testEmail(obj)
    },
    testPassword (obj) {
      return this.$options.filters.testPassword(obj)
    },
    testPasswordConfirm (pswdConfirm, pswd) {
      return this.$options.filters.testPasswordConfirm(pswdConfirm, pswd)

    }
  }
}
</script>