import Vue from 'vue'
import App from './App.vue'
import router from './routers/app-router.js'
import store from './store.js'

import './filters/index.js'

export const bus = new Vue()

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')