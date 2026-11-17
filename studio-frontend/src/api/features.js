import { sendRequest } from "../tools/request/sendRequest"
import { API_ENDPOINTS } from "@/const/apiEndpoints.js"
import { computeApiFailure } from "@/tools/request/computeApiFailure.js"
import { isFeaturesAnswer } from "@/tools/request/isFeaturesAnswer.js"

// Without a timeout, an address out of reach (a local API seen from
// another network) leaves the request waiting for the system's own, minutes.
const FEATURES_TIMEOUT_MS = 15_000

// VUE_APP_CONVO_API is not an absolute URL (src/const/apiEndpoints.js):
// nothing to ask.
const INVALID_ADDRESS = {
  features: null,
  failure: { reason: "invalid_address" },
}

/**
 * GET /features, public: what the deployment offers. Its answer also tells
 * the API is there, so it is the reachability check too.
 * @returns {Promise<{ features: { saas: boolean, session: boolean, speakerIdentification: boolean }, failure: null }
 *   | { features: null, failure: object }>} failure: computeApiFailure's,
 *   or { reason: "invalid_address" }
 */
export async function apiGetFeatures() {
  if (API_ENDPOINTS.root === null) return INVALID_ADDRESS
  const res = await sendRequest(
    `${API_ENDPOINTS.root}/features`,
    { method: "get", timeout: FEATURES_TIMEOUT_MS },
    {},
    null,
    undefined,
    true,
  )
  const failure = computeApiFailure(res, isFeaturesAnswer)
  return failure === null
    ? { features: res.data, failure: null }
    : { features: null, failure }
}
