import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function listToken(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens`,
    { method: "get" },
    {},
    null,
  )

  return res?.data || []
}

export async function createToken(organizationId, { role }) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens`,
    { method: "get" },
    { role },
    null,
  )

  return res
}
