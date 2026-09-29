import { apiGetGenericFileFromConversation } from "@/api/conversation.js"
import { exportFilename } from "@/tools/llm/exportFilename.js"

// A generated document (summary, report…) of a conversation as a PDF File,
// through the same export endpoint as the classic publication modal.
// null when the API refuses.
export async function fetchDocumentFile(conversation, document) {
  const result = await apiGetGenericFileFromConversation(
    conversation._id,
    document.format,
    document.flavorName,
    { preview: true, title: encodeURIComponent(conversation.name) },
  )
  if (result?.status !== "success") return null
  const name = `${conversation.name} - ${document.flavorName || document.format}`
  return new File([result.data], exportFilename(name, "pdf"), {
    type: "application/pdf",
  })
}
