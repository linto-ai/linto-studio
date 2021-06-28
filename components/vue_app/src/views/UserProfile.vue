<template>
  <div>
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
        <button class="btn btn--txt-icon green" @click="sendInfoForm()">
          <span class="label">Update</span>
          <span class="icon icon__plus"></span>
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
    </div>
    </div>
  </div>
</template>
<script>
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
      }
    }
  },
  mounted () {
  },
  computed: { 
    infoFormValid () {
      return this.firstname.valid && this.lastname.valid && this.email.valid
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
              await this.$options.filters.dispatchStore('getuserInfo')
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
    testName (obj) {
      return this.$options.filters.testName(obj)
    },
    testEmail (obj) {
      return this.$options.filters.testEmail(obj)
    }
  }
}
</script>