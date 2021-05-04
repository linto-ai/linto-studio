<template>
  <div id="app">
    <div class="login-container flex col">
      <img src="/assets/img/conversation-manager-logo.svg" class="login-logo"/>
      <h2 class="login-title">Create an account</h2>
        <div id="app-login" class="flex col">
          <!-- First name -->
          <div class="form-field flex col">
            <span class="form-label">First name<strong>*</strong> :</span>
            <input 
                type="text" 
                v-model="firstname.value"
                :class="firstname.error !== null ? 'error' : ''"
                @change="testName(firstname)">
              <span class="error-field" v-if="firstname.error !== null">{{ firstname.error }}</span>
          </div>
          <!-- Last name -->
          <div class="form-field flex col">
            <span class="form-label">Last name<strong>*</strong> :</span>
            <input 
                type="text" 
                v-model="lastname.value"
                :class="lastname.error !== null ? 'error' : ''"
                @change="testName(lastname)">
              <span class="error-field" v-if="lastname.error !== null">{{ lastname.error }}</span>
          </div>
          <!-- Email -->
          <div class="form-field flex col">
            <span class="form-label">Email<strong>*</strong> :</span>
            <input 
                type="text" 
                v-model="email.value"
                :class="email.error !== null ? 'error' : ''"
                @change="testEmail(email)">
              <span class="error-field" v-if="email.error !== null">{{ email.error }}</span>
          </div>
          <!-- Profil picture -->
          <div class="form-field flex col">
            <span class="form-label">Image (.png, .jpg) :</span>
            <div class="input-file-container flex col">
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
            <span class="error-field" v-if="picture.error !== null">{{ picture.error }}</span>
          </div>
          <!-- Password -->
          <div class="form-field flex col">
            <span class="form-label">Password<strong>*</strong> :</span>
            <input 
              type="password" 
              v-model="password.value"
              :class="password.error !== null ? 'error' : ''"
              @change="testPassword(password)">
            <span class="error-field" v-if="password.error !== null">{{ password.error }}</span>
          </div>
          <!-- Password confirmation -->
          <div class="form-field flex col">
            <span class="form-label">Password confirmation<strong>*</strong> :</span>
            <input 
              type="password" 
              v-model="passwordConfirm.value"
              :class="passwordConfirm.error !== null ? 'error' : ''"
              @change="testPasswordConfirm(passwordConfirm, password)">
            <span class="error-field" v-if="passwordConfirm.error !== null">{{ passwordConfirm.error }}</span>
          </div>
          <div class="form-field flex row" style="margin-top: 10px; justify-content: center;">
            <button
              @click="handleForm()" 
              class="btn btn--txt-icon blue">
              <span class="label">Create account</span>
              <span class="icon icon__apply"></span></button>
          </div>
          <div class="form-field" v-if="formError !== null"><span class="form-error">{{ formError }}</span></div>
        </div>
        <a href="/login" class="toggle-login-link">Sign in</a>
      </div>
    <AppNotif></AppNotif>
  </div>
</template>
<script>
  import { bus } from '../main.js'
  import axios from 'axios'
  import AppNotif from '@/components/AppNotif.vue'

  export default {
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
        password: {
          value: '',
          error: null,
          valid: false
        },
        passwordConfirm: {
          value: '',
          error: null,
          valid: false
        },
        picture: {
          value: '',
          error: null,
          valid: false
        },
        pictureUploadLabel: 'Choose a picture',
        formError: null
      }
    },
    computed: {
      formValid () {
        if (!this.pictureSelected) {
          return this.email.valid && this.firstname.valid && this.lastname.valid && this.password.valid && this.passwordConfirm.valid
        } else {
          return this.email.valid && this.firstname.valid && this.lastname.valid && this.password.valid && this.passwordConfirm.valid && this.picture.valid
        }
        
      },
      pictureSelected () {
        return this.picture.value !== ''
      }
    },
   
    methods: {
      async handleForm () {
        try {
          this.formError = null
          this.testEmail(this.email)
          this.testName(this.firstname) 
          this.testName(this.lastname) 
          this.testPassword(this.password) 
          this.testPasswordConfirm(this.passwordConfirm, this.password) 
          if(this.pictureSelected) {
            this.handleFileUpload()
          }
          if(this.formValid) {
            let formData = new FormData()

            const payload = {
              firstname: this.firstname.value,
              lastname: this.lastname.value,
              email: this.email.value,
              password: this.password.value
            }

            if(this.pictureSelected) {
              formData.append('file', this.picture.value)
            }
            formData.append('payload', JSON.stringify(payload))
            
            const createUser = await axios(`${process.env.VUE_APP_CONVO_API}/users`, {
              method: 'post',
              headers: {
              'charset': 'utf-8',
              'Content-Type': 'multipart/form-data',
              },
              data: formData
            })

            if(!!createUser.data.error) {
              throw createUser
            } else {
                bus.$emit('app_notif', {
                  status: 'success',
                  message: 'User has been created',
                  timeout: 3000,
                  redirect: '/login'
                })
            }
          }  
        } catch (error) {
          if(process.env.VUE_APP_DEBUG === 'true') {
            console.error(error)
          }
          if(!!error.data.error.message) {
            if(error.data.error.name === 'UserEmailAlreadyUsed'){
              this.email.valid = false
              this.email.error = error.data.error.message
              } else {
                this.formError = error.data.error.message
              }
          } else {
            this.formError = 'An error has occured, please try again later'
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
            this.picture.error = null
            this.pictureUploadLabel = 'Choose a file...'
        }
      },
      testName (obj) {
        return this.$options.filters.testName(obj)
      },
      testEmail (obj) {
        obj.value = obj.value.toLowerCase()
        return this.$options.filters.testEmail(obj)
      },
      testPassword (obj) {
        return this.$options.filters.testPassword(obj)
      },
      testPasswordConfirm (obj, password) {
        return this.$options.filters.testPasswordConfirm(obj, password)
      }
    },
    components: {
      AppNotif
    }
  }
</script>
