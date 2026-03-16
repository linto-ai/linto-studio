import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetVoiceSignatures(organizationId, notif) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/voice-signatures`,
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateVoiceSignature(
  organizationId,
  speakerName,
  audioFile,
  audioDuration,
  notif,
) {
  const formData = new FormData()
  formData.append("speakerName", speakerName)
  formData.append("audio", audioFile)
  if (audioDuration !== undefined) {
    formData.append("audioDuration", String(audioDuration))
  }

  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/voice-signatures`,
    { method: "post" },
    formData,
    notif,
    { "Content-Type": "multipart/form-data" },
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiUpdateVoiceSignature(
  organizationId,
  voiceSignatureId,
  payload,
  notif,
) {
  let data = payload
  let headers = undefined

  // If payload contains an audio file, use FormData
  if (payload.audio) {
    data = new FormData()
    if (payload.speakerName) data.append("speakerName", payload.speakerName)
    data.append("audio", payload.audio)
    headers = { "Content-Type": "multipart/form-data" }
  }

  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/voice-signatures/${voiceSignatureId}`,
    { method: "patch" },
    data,
    notif,
    headers,
  )
  return requestRes
}

export async function apiGetVoiceSignatureAudio(
  organizationId,
  voiceSignatureId,
) {
  return await sendRequest(
    `${BASE_API}/organizations/${organizationId}/voice-signatures/${voiceSignatureId}/audio`,
    {
      method: "get",
      responseType: "blob",
    },
    {},
  )
}

export async function apiDeleteVoiceSignature(
  organizationId,
  voiceSignatureId,
  notif,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/voice-signatures/${voiceSignatureId}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}
