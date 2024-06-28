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

export async function apiGetPublicSession(sessionId, notif) {
  const getSession = await sendRequest(
    `${BASE_API}/sessions/${sessionId}/public`,
    { method: "get" },
    {},
    notif
  )

  return getSession
}

export async function apiStartSession(organizationScope, sessionId, notif) {
  const startSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}/start`,
    { method: "put" },
    {},
    notif
  )

  return startSession
}

export async function apiStopSession(organizationScope, sessionId, notif) {
  const stopSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}/stop`,
    { method: "put" },
    {},
    notif
  )

  return stopSession
}

export async function apiDeleteSession(organizationScope, sessionId, notif) {
  const deleteSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "delete" },
    {},
    notif
  )

  return deleteSession
}

export async function apiGetSessionChannel(
  organizationScope,
  sessionId,
  transcriberId,
  notif
) {
  const getSessionChannel = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "get" },
    { transcriber_id: transcriberId },
    notif
  )

  return getSessionChannel?.data?.channels?.[0] ?? {}
}
