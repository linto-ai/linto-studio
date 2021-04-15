import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
export const bus = new Vue()

import './filters/index.js'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')