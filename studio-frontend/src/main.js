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
import { getEnv } from "@/tools/getEnv"

import Loading from "vue-loading-overlay"

import "vue-loading-overlay/dist/vue-loading.css"

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

Debug.enable(getEnv("VUE_APP_DEBUG"))

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app")
