import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function getTeamsAppInfo(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/teams-app/info`,
    { method: "get" },
    {},
    null,
  )

  return res
}

export async function downloadTeamsApp(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/teams-app/download`,
    { method: "get", responseType: "blob" },
    {},
    null,
  )

  return res
}
