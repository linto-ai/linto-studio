import { sendRequest } from "../tools/request/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function dictionariesUrl(organizationId, dictionaryId) {
  const base = `${BASE_API}/organizations/${organizationId}/hotword-dictionaries`
  return dictionaryId ? `${base}/${dictionaryId}` : base
}

export async function apiGetHotwordDictionaries(organizationId, notif) {
  const requestRes = await sendRequest(
    dictionariesUrl(organizationId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateHotwordDictionary(
  organizationId,
  payload,
  notif,
) {
  return await sendRequest(
    dictionariesUrl(organizationId),
    { method: "post" },
    payload,
    notif,
  )
}

export async function apiUpdateHotwordDictionary(
  organizationId,
  dictionaryId,
  payload,
  notif,
) {
  return await sendRequest(
    dictionariesUrl(organizationId, dictionaryId),
    { method: "patch" },
    payload,
    notif,
  )
}

export async function apiDeleteHotwordDictionary(
  organizationId,
  dictionaryId,
  notif,
) {
  return await sendRequest(
    dictionariesUrl(organizationId, dictionaryId),
    { method: "delete" },
    {},
    notif,
  )
}
