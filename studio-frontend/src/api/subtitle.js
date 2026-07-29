import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetSubtitle(conversationId, subtitleId, notif = null) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle/${subtitleId}`,
    { method: "get" },
    {},
    notif,
  )
}

// Returns the version list (204 from the API means no version yet)
export async function apiListSubtitleVersions(conversationId, notif = null) {
  const res = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle`,
    { method: "get" },
    {},
    notif,
  )
  if (res?.status === "success" && !Array.isArray(res.data)) {
    res.data = []
  }
  return res
}

export async function apiGenerateSubtitle(
  conversationId,
  { version, screenCharSize, screenMaxDuration, screenLines },
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle`,
    { method: "post" },
    { version, screenCharSize, screenMaxDuration, screenLines },
    notif,
  )
}

export async function apiCopySubtitle(
  conversationId,
  subtitleId,
  version,
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle/${subtitleId}/copy`,
    { method: "post" },
    { version },
    notif,
  )
}

export async function apiDeleteSubtitles(
  conversationId,
  subtitleIds,
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle?subtitleId=${subtitleIds.join(",")}`,
    { method: "delete" },
    {},
    notif,
  )
}

// The API expects the full screen object (stime, etime, turn_id, screen_id, text, words)
export async function apiUpdateScreen(
  conversationId,
  subtitleId,
  screen,
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle/${subtitleId}/screen/${screen.screen_id}`,
    { method: "patch" },
    screen,
    notif,
  )
}

// The server mints the new screen_id and returns it as data._id
export async function apiAddScreen(
  conversationId,
  subtitleId,
  referenceScreenId,
  screen,
  placement,
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle/${subtitleId}/screen/${referenceScreenId}?placement=${placement}`,
    { method: "post" },
    screen,
    notif,
  )
}

export async function apiDeleteScreen(
  conversationId,
  subtitleId,
  screenId,
  notif = null,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/subtitle/${subtitleId}/screen/${screenId}`,
    { method: "delete" },
    {},
    notif,
  )
}
