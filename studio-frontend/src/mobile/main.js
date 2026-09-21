// Entry point of the mobile app served under /m/. It shares the API layer,
// the store modules and the i18n messages with the classic app, nothing else.
import Vue from "vue"
import Debug from "debug"

import Atoms from "@/components/atoms/index.js"
import App from "@/mobile/App.vue"
import router from "@/mobile/router.js"
import store from "@/mobile/store.js"
import i18n from "@/i18n"
import { addMobileMessages } from "@/mobile/services/i18n/addMobileMessages.js"
import { getEnv } from "@/tools/getEnv"
import { registerServiceWorker } from "@/mobile/services/pwa/registerServiceWorker.js"
import { listenForInstallPrompt } from "@/mobile/services/pwa/installPrompt.js"
import { watchOnlineStatus } from "@/mobile/services/network/onlineStatus.js"
import { startUploadResumption } from "@/mobile/services/recording/resumeUploads.js"
import { clearMobileAppOptOut } from "@/mobile/services/preferences/clearMobileAppOptOut.js"
import { clearSsoReturn } from "@/mobile/services/session/markSsoReturn.js"

import "@/mobile/style/tokens.css"
import "@/mobile/style/base.css"

// Global atoms (Button, PhIcon…) are what the shared live component expects.
Vue.use(Atoms)

Vue.config.productionTip = false
// The editor is a custom element registered on demand (loadEditor).
Vue.config.ignoredElements = [/^linto-/]
Vue.prototype.debug = Debug("VueMobile")
Debug.enable(getEnv("VUE_APP_DEBUG"))

addMobileMessages(i18n)

clearMobileAppOptOut()
clearSsoReturn()
listenForInstallPrompt()
registerServiceWorker()
watchOnlineStatus()
// Uploads need the organization scope: wait for the first guarded navigation.
router.onReady(() => startUploadResumption())

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app")
