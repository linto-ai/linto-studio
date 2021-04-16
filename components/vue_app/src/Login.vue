<template>
  <div id="app">
    <div id="app-login" class="flex col flex1">
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
          type="text" 
          v-model="password.value"
          :class="password.error !== null ? 'error' : ''"
          @change="testPasswordEmpty()">
        <span class="error-field" v-if="password.error !== null">{{ password.error }}</span>
      </div>
      <div class="form-field flex row" style="margin-top: 20px;">
        <button
          @click="handleForm()" 
          class="btn btn--txt-icon blue">
          <span class="label">login</span>
          <span class="icon icon__apply"></span></button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        email: {
          value: '',
          error: null,
          valid: false
        },
        password: {
          value: '',
          error: null,
          valid: false
        }
      }
    },
    computed: {
      formValid () {
        return this.email.valid && this.password.valid
      }
    },
    methods: {
      async handleForm () {
        this.testEmail()
        this.testPasswordEmpty()
        
        if(this.formValid) {
          const payload = {
            email: this.email.value,
            password: this.password.value
          }
          const createUser = await axios(`${process.env.VUE_APP_CONVO_AUTH}/login`, {
            method: 'post',
            data: payload
          })
          if(createUser.data.status === 200) {
            window.location.href = '/interface/conversations'
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
