import { apiGetConversationAsDoc } from "./apiGetConversationAsDoc.js"
import { apiGetUserRightFromConversation } from "@/api/conversation"

// What every part of transcript-ui needs before anything is shown: the
// conversation skeleton (channels and tracks, no content) and the user's
// right on it. Resolves to null when the conversation cannot be loaded; a
// right that cannot be loaded is null, which opens the editor read only.
export async function apiGetConversationWithRight(conversationId) {
  try {
    const [conversation, access] = await Promise.all([
      apiGetConversationAsDoc(conversationId),
      apiGetUserRightFromConversation(conversationId),
    ])
    if (access?.right == null) console.error("cannot load conversation right")
    return { conversation, right: access?.right ?? null }
  } catch (error) {
    console.error("cannot load conversation", error)
    return null
  }
}
