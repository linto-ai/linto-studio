import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function labelsUrl(organizationId, collectionId) {
  return `${BASE_API}/organizations/${organizationId}/voiceprint-collections/${collectionId}/labels`
}

export async function apiGetSpeakerLabels(
  organizationId,
  collectionId,
  notif,
) {
  const requestRes = await sendRequest(
    labelsUrl(organizationId, collectionId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiGetSpeakerLabel(
  organizationId,
  collectionId,
  labelId,
  notif,
) {
  const requestRes = await sendRequest(
    `${labelsUrl(organizationId, collectionId)}/${labelId}`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || null
}

export async function apiCreateSpeakerLabel(
  organizationId,
  collectionId,
  payload,
  notif,
) {
  const requestRes = await sendRequest(
    labelsUrl(organizationId, collectionId),
    { method: "post" },
    payload,
    notif,
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiUpdateSpeakerLabel(
  organizationId,
  collectionId,
  labelId,
  payload,
  notif,
) {
  const requestRes = await sendRequest(
    `${labelsUrl(organizationId, collectionId)}/${labelId}`,
    { method: "patch" },
    payload,
    notif,
  )
  return requestRes
}

export async function apiDeleteSpeakerLabel(
  organizationId,
  collectionId,
  labelId,
  notif,
) {
  const requestRes = await sendRequest(
    `${labelsUrl(organizationId, collectionId)}/${labelId}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}
