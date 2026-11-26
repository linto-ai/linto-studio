import { sendRequest } from "@/tools/request/sendRequest.js"
import { apiGetMetadataLLMService } from "@/api/studio-api/service.js"
import { API_ENDPOINTS } from "@/const/apiEndpoints.js"

// What the server holds for a recording sent from the phone: the
// conversation (null when it has been deleted there: `missing`) and the
// documents generated on it. Never throws.
export async function loadRecordingLinks(conversationId) {
  const result = await sendRequest(
    `${API_ENDPOINTS.api}/conversations/${conversationId}`,
    { method: "get" },
    { projection: {} },
    null,
  )
  if (result?.status !== "success") {
    const missing = result?.error?.response?.status === 404
    return { conversation: null, missing, documents: [] }
  }
  const documents = (await apiGetMetadataLLMService(conversationId)) ?? []
  return { conversation: result.data, missing: false, documents }
}
