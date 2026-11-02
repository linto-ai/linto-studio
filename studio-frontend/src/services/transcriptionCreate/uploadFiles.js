import { apiCreateConversation } from "@/api/conversation"

/**
 * Sends the files one by one and stops at the first failure.
 * @param {string} organizationId
 * @param {object[]} files
 * @param {(file: object) => object} buildRequest - see buildConversationRequest
 * @param {{ onProgress: (percent: number) => void, onFileSent: (file: object) => void }} callbacks
 * @returns {Promise<{ success: boolean, sent: number, total: number, errorCode?: string, errorData?: object }>}
 */
export async function uploadFiles(
  organizationId,
  files,
  buildRequest,
  { onProgress, onFileSent },
) {
  const total = files.length
  let sent = 0
  for (const file of files) {
    const result = await apiCreateConversation(
      organizationId,
      buildRequest(file),
      null,
      ({ loaded, total: size }) =>
        onProgress(Math.floor((loaded * 100) / size)),
    )
    if (!result.success) {
      return {
        success: false,
        sent,
        total,
        errorCode: result.errorCode,
        errorData: result.errorData,
      }
    }
    sent++
    onFileSent(file)
  }
  return { success: true, sent, total }
}
