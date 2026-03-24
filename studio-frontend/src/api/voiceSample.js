import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function samplesUrl(organizationId, collectionId, labelId) {
  return `${BASE_API}/organizations/${organizationId}/voiceprint-collections/${collectionId}/labels/${labelId}/voice-samples`
}

export async function apiGetVoiceSamples(
  organizationId,
  collectionId,
  labelId,
  notif,
) {
  const requestRes = await sendRequest(
    samplesUrl(organizationId, collectionId, labelId),
    { method: "get" },
    {},
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateVoiceSample(
  organizationId,
  collectionId,
  labelId,
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
    samplesUrl(organizationId, collectionId, labelId),
    { method: "post" },
    formData,
    notif,
    { "Content-Type": "multipart/form-data" },
  )
  if (requestRes.status === "error") throw new Error(requestRes.message)
  return requestRes.data
}

export async function apiGetVoiceSampleAudio(
  organizationId,
  collectionId,
  labelId,
  voiceSampleId,
) {
  return await sendRequest(
    `${samplesUrl(organizationId, collectionId, labelId)}/${voiceSampleId}/audio`,
    {
      method: "get",
      responseType: "blob",
    },
    {},
  )
}

export async function apiDeleteVoiceSample(
  organizationId,
  collectionId,
  labelId,
  voiceSampleId,
  notif,
) {
  const requestRes = await sendRequest(
    `${samplesUrl(organizationId, collectionId, labelId)}/${voiceSampleId}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}
