<template>
  <div id="app-notif" class="flex row" :class="[status, showNotif ? 'visible' : 'closed']" >
    <div class="flex row flex1 app-notif-msg">
      <span class="app-notif__icon" :class="`app-notif__icon-${status}`"></span>
      <span class="app-notif__message" >{{ message }}</span>
    </div>
    <div class="flex row app-notif-close">
      <button class="close-notif" @click="close()"></button>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      message: '',
      timeout: null,
      status: '',
      showNotif: false,
      redirect: null
    }
  }, 
  mounted () {
    bus.$on('app_notif', (data) => {
      this.message = data.message
      this.timeout = data.timeout
      this.status = data.status
      if (!!data.redirect) {
        this.redirect = data.redirect
      }

      this.show()
    })
    bus.$on('app_notif_close', (data) => {
      this.close()
    })
  },
  methods: {
    show () {
      this.showNotif = true
      if (this.timeout !== null) {
        setTimeout(()=>{
          this.close()
          if(this.redirect !== null) {
            window.location.href = this.redirect
          }
        }, this.timeout)
      }
    },
    close () {
      this.showNotif = false
    }
  }

}
</script>