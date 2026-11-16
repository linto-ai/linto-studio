import { sendRequest } from "../tools/request/sendRequest"
import { getEnv } from "@/tools/getEnv"
import { computeApiFailure } from "@/tools/request/computeApiFailure.js"

// studio-api answers /healthcheck at its root, sibling to /api:
// VUE_APP_CONVO_API ends in /api, so it is stripped (as in cloud.js).
const HEALTHCHECK_URL =
  getEnv("VUE_APP_CONVO_API").replace(/\/api\/?$/, "") + "/healthcheck"

// Without a timeout, an address out of reach (a local API seen from
// another network) leaves the request waiting for the system's own, minutes.
const HEALTHCHECK_TIMEOUT_MS = 15_000

// GET /healthcheck -> { status: "ok" }, public. Resolves to null when the API
// answered so, otherwise to why not (computeApiFailure).
export async function apiCheckHealth() {
  const res = await sendRequest(
    HEALTHCHECK_URL,
    { method: "get", timeout: HEALTHCHECK_TIMEOUT_MS },
    {},
    null,
    undefined,
    true,
  )
  return computeApiFailure(res, isHealthy)
}

function isHealthy(data) {
  return data?.status === "ok"
}
