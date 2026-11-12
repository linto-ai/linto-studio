import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { loadSavedInstance } from "@/mobile/services/native/instanceStorage.js"
import { buildInstanceConfig } from "@/mobile/tools/buildInstanceConfig.js"

// Side-effect module, imported first by main.js. The API modules read their
// URLs once, when they load (`const BASE_API = getEnv(...)`), and getEnv
// reads window.VUE_APP_CONFIG first: the saved instance has to be there
// before any of them loads. Changing instance therefore reloads the app.
if (IS_NATIVE_APP) {
  window.VUE_APP_CONFIG = {
    ...window.VUE_APP_CONFIG,
    ...buildInstanceConfig(loadSavedInstance().base),
  }
}
