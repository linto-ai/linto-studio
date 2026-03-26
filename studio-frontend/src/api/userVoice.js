import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

const BASE_URL = `${BASE_API}/users/self/voice`

export async function apiGetUserVoiceSamples(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/samples`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateUserVoiceSample(
  audioFile,
  audioDuration,
  notif,
) {
  const formData = new FormData()
  formData.append("audio", audioFile)
  if (audioDuration !== undefined) {
    formData.append("audioDuration", String(audioDuration))
  }

  const requestRes = await sendRequest(
    `${BASE_URL}/samples`,
    { method: "post" },
    formData,
    notif,
    { "Content-Type": "multipart/form-data" },
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiGetUserVoiceSampleAudio(id) {
  return await sendRequest(
    `${BASE_URL}/samples/${id}/audio`,
    {
      method: "get",
      responseType: "blob",
    },
    {},
  )
}

export async function apiDeleteUserVoiceSample(id, notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/samples/${id}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}

export async function apiDeleteAllUserVoiceSamples(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/samples`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}

export async function apiUpdateStorageMode(storageMode, notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/storage-mode`,
    { method: "patch" },
    { storageMode },
    notif,
  )
  return requestRes
}

export async function apiGetVoiceprintStatus(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/voiceprint`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || null
}

export async function apiUpdateVoiceOrganization(orgId, enabled, notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/organizations/${orgId}`,
    { method: "patch" },
    { enabled },
    notif,
  )
  return requestRes
}

export async function apiGetUserVoiceOrganizations(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/organizations`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}
