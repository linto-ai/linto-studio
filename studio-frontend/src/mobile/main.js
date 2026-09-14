// Entry point of the mobile app served under /m/. It shares the API layer,
// the store modules and the i18n messages with the classic app, nothing else.
import Vue from "vue"
import Debug from "debug"

import App from "@/mobile/App.vue"
import router from "@/mobile/router.js"
import store from "@/mobile/store.js"
import i18n from "@/i18n"
import { getEnv } from "@/tools/getEnv"

import "@/mobile/style/tokens.css"
import "@/mobile/style/base.css"

Vue.config.productionTip = false
Vue.prototype.debug = Debug("VueMobile")
Debug.enable(getEnv("VUE_APP_DEBUG"))

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app")
