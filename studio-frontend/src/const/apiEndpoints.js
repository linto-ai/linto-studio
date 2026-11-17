import { getEnv } from "@/tools/getEnv"
import { computeApiEndpoints } from "@/tools/request/computeApiEndpoints.js"

// The studio-api URLs, all derived from VUE_APP_CONVO_API. Fixed for the
// page's life: the native app reloads when it changes instance, and
// applySavedInstance.js sets the instance before any module imports this.
const CONVO_API = getEnv("VUE_APP_CONVO_API")

// A misconfigured address must not crash the modules importing this: every
// URL is null, GET /features is not even sent (src/api/features.js) and the
// routers show the "API unreachable" page.
const INVALID_ENDPOINTS = {
  root: null,
  api: null,
  auth: null,
  media: null,
  socketOrigin: null,
  socketPath: null,
}

const endpoints = computeApiEndpoints(CONVO_API)
if (!endpoints) {
  console.error(
    `VUE_APP_CONVO_API must be an absolute http(s) URL ending in /api, got "${CONVO_API}"`,
  )
}

export const API_ENDPOINTS = Object.freeze(endpoints ?? INVALID_ENDPOINTS)
