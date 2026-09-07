import {
  apiGetGenericFileFromConversation,
  apiGetJsonFileFromConversation,
  apiGetTextFileFromConversation,
} from "@/api/conversation.js"
import { exportFilename } from "@/tools/llm/exportFilename.js"

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function downloadText(content, mime, filename) {
  downloadBlob(new Blob([content], { type: mime }), filename)
}

export async function onVerbatimExport(
  { conversationId, conversationName, t, notify },
  { format },
) {
  try {
    switch (format) {
      case "docx":
      case "pdf": {
        const req = await apiGetGenericFileFromConversation(
          conversationId,
          "verbatim",
          null,
          { preview: format === "pdf", title: conversationName },
        )
        if (req?.status === "success") {
          downloadBlob(req.data, exportFilename(conversationName, format))
        } else {
          throw new Error("verbatim export failed")
        }
        break
      }
      case "txt": {
        const req = await apiGetTextFileFromConversation(conversationId, [], [])
        if (req?.status === "success") {
          downloadText(
            req.data,
            "text/plain",
            exportFilename(conversationName, "txt"),
          )
        } else {
          throw new Error("verbatim txt export failed")
        }
        break
      }
      case "json": {
        const req = await apiGetJsonFileFromConversation(conversationId, [], [])
        if (req?.status === "success") {
          downloadText(
            JSON.stringify(req.data, null, 4),
            "application/json",
            exportFilename(conversationName, "json"),
          )
        } else {
          throw new Error("verbatim json export failed")
        }
        break
      }
      case "whisperx": {
        const req = await apiGetJsonFileFromConversation(
          conversationId,
          [],
          [],
          "whisperx",
        )
        if (req?.status === "success") {
          downloadText(
            JSON.stringify(req.data, null, 2),
            "application/json",
            exportFilename(conversationName, "_whisperx.json"),
          )
        } else {
          throw new Error("verbatim whisperx export failed")
        }
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error("[llm] verbatim export failed", e)
    notify("error", t("publish.export_error"))
  }
}
