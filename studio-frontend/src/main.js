import "dotenv/config"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./routers/app-router.js"
import store from "./store/index.js"
import i18n from "./i18n"
import Debug from "debug"
import eventBusPlugin, { bus } from "./eventBus.js"
import ApiEventWebSocket from "@/services/websocket/ApiEventWebSocket.js"
import Atoms from "./components/atoms/index.js"
import filtersPlugin from "./filters/index.js"

import { LoadingPlugin } from "vue-loading-overlay"
import "vue-loading-overlay/dist/css/index.css"

// Create v-click-outside directive for Vue 3
import { vOnClickOutside } from "@vueuse/components"

Debug.enable(process.env.VUE_APP_DEBUG)

const app = createApp(App)

// Export bus for backwards compatibility
export { bus }

// Install plugins
app.use(router)
app.use(store)
app.use(i18n)
app.use(eventBusPlugin)
app.use(filtersPlugin)
app.use(Atoms)
app.use(LoadingPlugin)

// Register global directives
app.directive("click-outside", vOnClickOutside)

// Global properties
app.config.productionTip = false
app.config.globalProperties.debug = Debug("Vue")
app.config.globalProperties.$apiEventWS = new ApiEventWebSocket()

// Mount app
app.mount("#app")
