<template>
  <div>
    <div class="login-form-container flex col">
      <img src="/assets/img/conversation-manager-logo.svg" class="login-logo"/>
      <h2 class="login-title">Sign into your account</h2>
        <div id="app-login" class="flex col">
          <div class="form-field flex col">
            <span class="form-label">Email :</span>
            <input 
                type="text" 
                v-model="email.value"
                :class="email.error !== null ? 'error' : ''"
                @change="testEmail()">
              <span class="error-field" v-if="email.error !== null">{{ email.error }}</span>
          </div>
          <div class="form-field flex col">
            <span class="form-label">Password :</span>
            <input 
              type="password" 
              v-model="password.value"
              :class="password.error !== null ? 'error' : ''"
              @change="testPasswordEmpty()">
            <span class="error-field" v-if="password.error !== null">{{ password.error }}</span>
          </div>
          <div class="form-field flex row" style="margin: 10px 0; justify-content: center;">
            <button
              @click="handleForm()" 
              class="btn btn--txt-icon blue">
              <span class="label">login</span>
              <span class="icon icon__apply"></span></button>
          </div>
              <div class="form-field" v-if="formError !== null"><span class="form-error">{{ formError }}</span></div>
        </div>
        <a href="/create-account" class="toggle-login-link">Create an account</a>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        email: {
          value: 'rlopez@linagora.com',
          error: null,
          valid: true
        },
        password: {
          value: 'azeaze',
          error: null,
          valid: true
        },
        formError: null
      }
    },
    computed: {
      formValid () {
        return this.email.valid && this.password.valid
      }
    },
    methods: {
      async handleForm () {
        try{
          this.formError = null
          this.testEmail()
          this.testPasswordEmpty()
          
          if(this.formValid) {
            const payload = {
              email: this.email.value,
              password: this.password.value
            }
            const login = await axios(`${process.env.VUE_APP_CONVO_AUTH}/login`, {
              method: 'post',
              data: payload
            })
            if(!!login.data.error) {
                throw login
            } else {
              window.location.href = '/interface/conversations'
            }
          }
        }
        catch (error) {
          if(!!error.data.error.message) {
              this.formError = error.data.error.message
          } else {
            this.formError = 'An error has occured, please try again later'
          }
        }

      },
      testEmail () {
        return this.$options.filters.testEmail(this.email)
      },
      testPasswordEmpty () {
        return this.$options.filters.testFieldEmpty(this.password)
      },
    }
  }
</script>
