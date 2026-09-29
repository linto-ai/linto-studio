import { sendRequest } from "@/tools/sendRequest.js"
import { apiGetMetadataLLMService } from "@/api/service.js"
import { getEnv } from "@/tools/getEnv"

// What the server holds for a recording sent from the phone: the
// conversation (null when it has been deleted there: `missing`) and the
// documents generated on it. Never throws.
export async function loadRecordingLinks(conversationId) {
  const result = await sendRequest(
    `${getEnv("VUE_APP_CONVO_API")}/conversations/${conversationId}`,
    { method: "get" },
    { projection: {} },
    null,
  )
  if (result?.status !== "success") {
    const missing = result?.error?.response?.status === 404
    return { conversation: null, missing, documents: [] }
  }
  const documents = await apiGetMetadataLLMService(conversationId)
  return { conversation: result.data, missing: false, documents }
}
