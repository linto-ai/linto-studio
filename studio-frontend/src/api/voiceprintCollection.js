import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function collectionsUrl(organizationId, collectionId) {
  const base = `${BASE_API}/organizations/${organizationId}/voiceprint-collections`
  return collectionId ? `${base}/${collectionId}` : base
}

function optedInMembersUrl(organizationId, collectionId, userId) {
  const base = `${collectionsUrl(organizationId, collectionId)}/opted-in-members`
  return userId ? `${base}/${userId}` : base
}

export async function apiGetVoiceprintCollections(organizationId, notif) {
  const requestRes = await sendRequest(
    collectionsUrl(organizationId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiGetVoiceprintCollection(
  organizationId,
  collectionId,
  notif,
) {
  const requestRes = await sendRequest(
    collectionsUrl(organizationId, collectionId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || null
}

export async function apiCreateVoiceprintCollection(
  organizationId,
  payload,
  notif,
) {
  const requestRes = await sendRequest(
    collectionsUrl(organizationId),
    { method: "post" },
    payload,
    notif,
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiUpdateVoiceprintCollection(
  organizationId,
  collectionId,
  payload,
  notif,
) {
  const requestRes = await sendRequest(
    collectionsUrl(organizationId, collectionId),
    { method: "patch" },
    payload,
    notif,
  )
  return requestRes
}

export async function apiDeleteVoiceprintCollection(
  organizationId,
  collectionId,
  notif,
) {
  const requestRes = await sendRequest(
    collectionsUrl(organizationId, collectionId),
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}

export async function apiGetOptedInMembers(
  organizationId,
  collectionId,
  notif,
) {
  const requestRes = await sendRequest(
    optedInMembersUrl(organizationId, collectionId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiGetOptedInMemberSamples(
  organizationId,
  collectionId,
  userId,
  notif,
) {
  const requestRes = await sendRequest(
    `${optedInMembersUrl(organizationId, collectionId, userId)}/voice-samples`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiGetOptedInMemberSampleAudio(
  organizationId,
  collectionId,
  userId,
  sampleId,
) {
  return await sendRequest(
    `${optedInMembersUrl(organizationId, collectionId, userId)}/voice-samples/${sampleId}/audio`,
    {
      method: "get",
      responseType: "blob",
    },
    {},
  )
}
