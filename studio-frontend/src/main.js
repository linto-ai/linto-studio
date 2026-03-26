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
import { getEnv } from "@/tools/getEnv"

import Loading from "vue-loading-overlay"

import { register as registerLintoEditor } from "@linto/studio-editor/webcomponent"

import "vue-loading-overlay/dist/vue-loading.css"

export const bus = new Vue()
Vue.use(PortalVue)
Vue.use(vClickOutside)
Vue.use(Fragment.Plugin)
Vue.use(Atoms)
Vue.use(Loading)

Vue.config.productionTip = false
Vue.prototype.debug = Debug("Vue")
Vue.prototype.$apiEventWS = new ApiEventWebSocket()

Debug.enable(getEnv("VUE_APP_DEBUG"))

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app")

registerLintoEditor()
