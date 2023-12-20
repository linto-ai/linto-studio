import { sendRequest } from "../tools/sendRequest"

const BASE_API = process.env.VUE_APP_CONVO_API

export async function apiGetTranscriptionService(lang, notif) {
  const getTranscriptionService = await sendRequest(
    `${BASE_API}/services`,
    { method: "get" },
    {},
    notif
  )
  return (getTranscriptionService?.data ?? []).filter(
    (service) => service.language === lang
  )
}

export async function apiGetNlpService(notif) {
  const getHighlightsService = await sendRequest(
    `${BASE_API}/services`,
    { method: "get" },
    {},
    notif
  )
  return (getHighlightsService?.data ?? []).filter(
    (service) => service.scope.indexOf("nlp") !== -1
  )
}
