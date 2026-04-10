import { apiGetConversationById } from "@/api/conversation.js"

const PROJECTION = { text: 0, type: 1, _id: 1 }

export async function apiGetCanonicalConv(convId) {
  const conversation = await apiGetConversationById(convId, PROJECTION)

  if (conversation.type.mode != "canonical") {
    return await apiGetConversationById(
      conversation.type.from_canonical_id,
      PROJECTION,
    )
  }

  return conversation
}
