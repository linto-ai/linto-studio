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

export async function apiGetStartedSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?status=active`,
    { method: "get" },
    {},
    notif
  )

  if (getStartedSessions.status === "error") {
    throw new Error(getStartedSessions.message)
  }
  return getStartedSessions?.data ?? { sessions: [], totalItems: 0 }
}

export async function apiGetFutureSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?status=ready`,
    { method: "get" },
    {},
    notif
  )

  if (getStartedSessions.status === "error") {
    throw new Error(getStartedSessions.message)
  }
  return getStartedSessions?.data ?? { sessions: [], totalItems: 0 }
}

export async function apiGetSession(organizationScope, sessionId, notif) {
  const getSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "get" },
    {},
    notif
  )

  return getSession
}
