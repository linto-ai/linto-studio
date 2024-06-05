import { sendRequest } from "../tools/sendRequest"
const BASE_API = process.env.VUE_APP_CONVO_API

export async function apiGetTranscriberProfiles(notif) {
  const getTranscriberProfiles = await sendRequest(
    `${BASE_API}/transcriber_profiles`,
    { method: "get" },
    {},
    notif
  )

  return getTranscriberProfiles?.data ?? []
}

export async function apiCreateSession(organizationScope, data, notif) {
  const createSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions`,
    { method: "post" },
    data,
    notif
  )

  return createSession
}
