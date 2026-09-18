import { getExtensionForMimeType } from "@/tools/audioMimeTypes.js"
import * as queue from "@/mobile/services/recording/queue.js"

// The audio of a local recording as one File, assembled from its chunks.
// null when nothing is stored (audio dropped, or never captured).
export async function buildRecordingFile(recording) {
  const chunks = await queue.getRecordingChunks(recording.id)
  if (chunks.length === 0) return null
  const extension = getExtensionForMimeType(recording.mimeType || "")
  return new File(chunks, `${recording.name}.${extension}`, {
    type: recording.mimeType || "application/octet-stream",
  })
}
