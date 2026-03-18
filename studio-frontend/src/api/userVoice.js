import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

const BASE_URL = `${BASE_API}/users/self/voice`

export async function apiGetUserVoiceSignatures(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/voice-signatures`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateUserVoiceSignature(
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
    `${BASE_URL}/voice-signatures`,
    { method: "post" },
    formData,
    notif,
    { "Content-Type": "multipart/form-data" },
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiGetUserVoiceSignatureAudio(id) {
  return await sendRequest(
    `${BASE_URL}/voice-signatures/${id}/audio`,
    {
      method: "get",
      responseType: "blob",
    },
    {},
  )
}

export async function apiDeleteUserVoiceSignature(id, notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/voice-signatures/${id}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}

export async function apiDeleteAllUserVoiceSignatures(notif) {
  const requestRes = await sendRequest(
    `${BASE_URL}/voice-signatures`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}
