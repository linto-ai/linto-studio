import {
  apiGetGenericFileFromConversation,
  apiGetJsonFileFromConversation,
  apiGetTextFileFromConversation,
} from "@/api/conversation.js"
import { computeAssistantsTrack } from "@/tools/llm/computeAssistantsTrack.js"
import { exportFilename } from "@/tools/llm/exportFilename.js"
import { downloadBlob } from "@/tools/downloadBlob.js"

// Downloads the transcription of the displayed track (the source for the
// cross view) in one of the formats of the verbatim panel.
export async function exportVerbatim(transcriptionController, format) {
  const { core, conversationName, t, notify } = transcriptionController
  const channel = core.activeChannel.value
  if (!channel) return
  const trackId = computeAssistantsTrack(channel).id
  const file = await fetchVerbatimFile(trackId, conversationName, format)
  if (!file) {
    notify("error", t("publish.export_error"))
    return
  }
  downloadBlob(
    file.blob,
    exportFilename(`${conversationName}${file.nameSuffix}`, file.extension),
  )
}

// Null when the export failed, the track has no text (the API answers 204
// with nothing) or the format is unknown.
async function fetchVerbatimFile(trackId, conversationName, format) {
  switch (format) {
    case "docx":
    case "pdf": {
      const response = await apiGetGenericFileFromConversation(
        trackId,
        "verbatim",
        null,
        { preview: format === "pdf", title: conversationName },
      )
      if (!isExported(response) || !response.data.size) return null
      return { blob: response.data, nameSuffix: "", extension: format }
    }
    case "txt": {
      const response = await apiGetTextFileFromConversation(trackId, [], [])
      if (!isExported(response)) return null
      return {
        blob: new Blob([response.data], { type: "text/plain" }),
        nameSuffix: "",
        extension: "txt",
      }
    }
    case "json": {
      const response = await apiGetJsonFileFromConversation(trackId, [], [])
      if (!isExported(response)) return null
      return {
        blob: buildJsonBlob(response.data, 4),
        nameSuffix: "",
        extension: "json",
      }
    }
    case "whisperx": {
      const response = await apiGetJsonFileFromConversation(
        trackId,
        [],
        [],
        "whisperx",
      )
      if (!isExported(response)) return null
      return {
        blob: buildJsonBlob(response.data, 2),
        nameSuffix: "_whisperx",
        extension: "json",
      }
    }
    default:
      console.error("unknown verbatim format", format)
      return null
  }
}

function isExported(response) {
  return response?.status === "success" && !!response.data
}

function buildJsonBlob(data, indent) {
  return new Blob([JSON.stringify(data, null, indent)], {
    type: "application/json",
  })
}
