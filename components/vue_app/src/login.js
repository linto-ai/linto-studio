import Vue from 'vue'
import Login from './Login.vue'
import router from './routers/login-router.js'
import './filters/index.js'

new Vue({
    router,
    render: h => h(Login)
}).$mount('#app')