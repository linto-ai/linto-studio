import Vue from 'vue'
import App from './App.vue'
import router from './routers/app-router.js'
import store from './store.js'
import VueI18n from 'vue-i18n'
import fr_lang from './i18n/fr.json'
import en_lang from './i18n/en.json'
import './filters/index.js'

export const bus = new Vue()
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'fr',
    messages: {
        'en': en_lang,
        'fr': fr_lang
    }
})

Vue.config.productionTip = false

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')