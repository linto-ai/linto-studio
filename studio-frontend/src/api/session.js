import isSessionStarted from "../tools/isSessionStarted"
import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetTranscriberProfiles(notif) {
  const getTranscriberProfiles = await sendRequest(
    `${BASE_API}/transcriber_profiles`,
    { method: "get" },
    {},
    notif,
  )

  return getTranscriberProfiles?.data ?? []
}

export async function apiCreateSession(organizationScope, data, notif) {
  const createSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions`,
    { method: "post" },
    data,
    notif,
  )

  return createSession
}

export async function apiUpdateSession(
  organizationScope,
  sessionId,
  data,
  notif,
) {
  const createSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "put" },
    data,
    notif,
  )

  return createSession
}

export async function apiSearchSessionByName(
  organizationScope,
  sessionName,
  notif,
) {
  const search = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?searchName=${sessionName}&organizationId=${organizationScope}`,
    { method: "get" },
    {},
    notif,
  )

  return search?.data?.sessions ?? []
}

export async function apiGetActiveSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?statusList=active&organizationId=${organizationScope}`,
    { method: "get" },
    {},
    notif,
  )

  if (getStartedSessions.status === "error") {
    throw new Error(getStartedSessions.message)
  }
  return getStartedSessions?.data ?? { sessions: [], totalItems: 0 }
}

// started is not a session api status
export async function apiGetStartedSessions(organizationScope, notif) {
  const allSessionsReq = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions`,
    { method: "get" },
    { limit: 100, organizationId: organizationScope },
    notif,
  )

  const allSessionsList = allSessionsReq?.data?.sessions ?? []

  const allSessionsFiltered = allSessionsList.filter(isSessionStarted)

  return {
    sessions: allSessionsFiltered,
    totalItems: allSessionsFiltered.length,
  }
}

export async function apiCountActiveSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?statusList=active&organizationId=${organizationScope}`,
    { method: "get" },
    { limit: 1 },
    notif,
  )

  return getStartedSessions?.data?.totalItems ?? 0
}

export async function apiGetFutureSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?organizationId=${organizationScope}`,
    { method: "get" },
    {},
    notif,
  )

  if (getStartedSessions.status === "error") {
    throw new Error(getStartedSessions.message)
  }
  return getStartedSessions?.data ?? { sessions: [], totalItems: 0 }
}

export async function apiCountFutureSessions(organizationScope, notif) {
  const getStartedSessions = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions?status=ready&organizationId=${organizationScope}`,
    { method: "get" },
    { limit: 1 },
    notif,
  )

  return getStartedSessions?.data?.totalItems ?? 0
}

export async function apiGetSession(organizationScope, sessionId, notif) {
  const getSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "get" },
    {},
    notif,
  )

  return getSession
}

export async function apiGetSessionsBetweenDates(
  organizationScope,
  start_date,
  end_date,
  notif,
) {
  const allSessionsReq = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions`,
    { method: "get" },
    { limit: 100, organizationId: organizationScope },
    notif,
  )

  const allSessionsList = allSessionsReq?.data?.sessions ?? []

  const allSessionsFiltered = allSessionsList.filter(
    (session) =>
      new Date(session.startTime) >= new Date(start_date) &&
      new Date(session.startTime) <= new Date(end_date),
  )

  return {
    sessions: allSessionsFiltered,
    totalItems: allSessionsFiltered.length,
  }
}

export async function apiGetPublicSession(sessionId, notif) {
  const getSession = await sendRequest(
    `${BASE_API}/sessions/${sessionId}/public`,
    { method: "get" },
    {},
    notif,
  )

  return getSession
}

export async function apiStartSession(organizationScope, sessionId, notif) {
  const startSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}/start`,
    { method: "put" },
    {},
    notif,
  )

  return startSession
}

export async function apiStopSession(organizationScope, sessionId, notif) {
  const stopSession = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}/stop`,
    { method: "put" },
    {},
    notif,
  )

  return stopSession
}

export async function apiDeleteSession(
  organizationScope,
  sessionId,
  { name } = {},
  notif = null,
) {
  let resRequest
  if (name) {
    resRequest = await sendRequest(
      `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}?name=${name}`,
      { method: "delete" },
      {},
      notif,
    )
  } else {
    resRequest = await sendRequest(
      `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
      { method: "delete" },
      {},
      notif,
    )
  }

  return resRequest
}

export async function apiGetSessionChannel(
  organizationScope,
  sessionId,
  channelIndex,
  notif,
) {
  const getSessionChannel = await sendRequest(
    `${BASE_API}/organizations/${organizationScope}/sessions/${sessionId}`,
    { method: "get" },
    { channel_index: channelIndex },
    notif,
  )

  return getSessionChannel
}

export async function apiGetPublicSessionChannel(
  sessionId,
  transcriberId,
  notif,
) {
  const getSessionChannel = await sendRequest(
    `${BASE_API}/sessions/${sessionId}/public`,
    { method: "get" },
    { transcriber_id: transcriberId },
    notif,
  )

  return getSessionChannel
}
