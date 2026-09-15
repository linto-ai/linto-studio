import {
  apiGetGenericFileFromConversation,
  apiGetTextFileFromConversation,
} from "@/api/conversation.js"
import { exportFilename } from "@/tools/llm/exportFilename.js"
import { TRANSCRIPT_EXPORT_FORMATS } from "@/mobile/const/transcriptExportFormats.js"

// The verbatim of a conversation as a File, in one of the offered formats.
// Never throws: null when the API refuses or the format is unknown.
export async function fetchTranscriptFile(conversation, format) {
  const option = TRANSCRIPT_EXPORT_FORMATS.find(
    (item) => item.format === format,
  )
  if (!option) return null
  const content = await fetchContent(conversation, format)
  if (content == null) return null
  return new File([content], exportFilename(conversation.name, format), {
    type: option.mime,
  })
}

async function fetchContent(conversation, format) {
  if (format === "txt") {
    const result = await apiGetTextFileFromConversation(
      conversation._id,
      [],
      [],
    )
    return result?.status === "success" ? result.data : null
  }
  // preview=true makes the API convert the verbatim document to PDF.
  const result = await apiGetGenericFileFromConversation(
    conversation._id,
    "verbatim",
    null,
    { preview: format === "pdf", title: encodeURIComponent(conversation.name) },
  )
  return result?.status === "success" ? result.data : null
}
