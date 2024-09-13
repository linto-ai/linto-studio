import { sendRequest } from "../tools/sendRequest"

import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetAllOrganizations() {
  const res = await sendRequest(`${BASE_API}/admin/organizations`, {
    method: "get",
  })

  return res?.data || []
}
