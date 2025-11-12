import "dotenv/config"

import Vue from "vue"
import App from "./App.vue"
import router from "./routers/app-router.js"
import store from "./store/index.js"
import i18n from "./i18n"
import Debug from "debug"
import vClickOutside from "v-click-outside"
import Fragment from "vue-fragment"
import PortalVue from "portal-vue"
//import { setDefaultEnv } from "./tools/setDefaultEnv.js"
import ApiEventWebSocket from "@/services/websocket/ApiEventWebSocket.js"
import Atoms from "./components/atoms/index.js"
import "./filters/index.js"

import Loading from "vue-loading-overlay"

import "vue-loading-overlay/dist/vue-loading.css"
//setDefaultEnv() // doesn't work

export const bus = new Vue()
Vue.use(PortalVue.default)
Vue.use(vClickOutside)
Vue.use(Fragment.Plugin)
Vue.use(Atoms)
Vue.use(Loading)

Vue.config.productionTip = false
Vue.prototype.debug = Debug("Vue")
Vue.prototype.$apiEventWS = new ApiEventWebSocket()

Debug.enable(process.env.VUE_APP_DEBUG)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app")
