import {
  apiGetUsersFromMultipleConversation,
  apiUpdateConversation,
} from "@/api/conversation.js"
import {
  apiUpdateMultipleUsersInMultipleConversations,
  apiSearchUser,
} from "@/api/user.js"
import { indexConversationRightByUsers } from "@/tools/indexConversationRightByUsers.js"

const INVITED_RIGHT = 1

// Sharing of one conversation, through the same endpoints as the classic
// share panel. Readers return data or null, writers return a boolean.

export async function loadConversationShare(conversationId) {
  const list = await apiGetUsersFromMultipleConversation([conversationId])
  if (!Array.isArray(list)) return null
  const indexed = indexConversationRightByUsers(list)
  return {
    organizationMembers: [...indexed.organization_members.values()],
    externalMembers: [...indexed.external_members.values()],
  }
}

export async function setDefaultRight(conversationId, right) {
  const result = await apiUpdateConversation(conversationId, {
    "organization.membersRight": right,
  })
  return result?.status === "success"
}

export async function setUserRight(
  conversationId,
  organizationId,
  userId,
  right,
) {
  const result = await apiUpdateMultipleUsersInMultipleConversations(
    [conversationId],
    [{ id: userId, right }],
    organizationId,
    null,
  )
  return result?.status === "success"
}

// An unknown address gets an account invitation by email, with read access.
export async function inviteByEmail(conversationId, organizationId, email) {
  const result = await apiUpdateMultipleUsersInMultipleConversations(
    [conversationId],
    [{ email, right: INVITED_RIGHT }],
    organizationId,
    null,
  )
  return result?.status === "success"
}

export async function searchUsers(text, signal) {
  const result = await apiSearchUser(text, signal)
  return Array.isArray(result?.data) ? result.data : []
}
