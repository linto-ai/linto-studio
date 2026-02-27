import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiFetchFolders(
  organizationId,
  { parentId, tree, withConversationCount } = {},
  notif = null,
) {
  const params = {}
  if (parentId !== undefined) params.parentId = parentId
  if (tree) params.tree = "true"
  if (withConversationCount) params.withConversationCount = "true"

  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders`,
    { method: "get" },
    params,
    notif,
  )
  return requestRes?.data || []
}

export async function apiCreateFolder(
  organizationId,
  { name, parentId, color, emoji, position },
  notif = null,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders`,
    { method: "post" },
    { name, parentId, color, emoji, position },
    notif,
  )

  if (requestRes.status === "error") throw new Error(requestRes.data)
  return requestRes.data
}

export async function apiUpdateFolder(
  organizationId,
  folderId,
  payload,
  notif = null,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders/${folderId}`,
    { method: "patch" },
    payload,
    notif,
  )
  return requestRes?.data
}

export async function apiDeleteFolder(
  organizationId,
  folderId,
  strategy = "move_to_parent",
  notif = null,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders/${folderId}?strategy=${strategy}`,
    { method: "delete" },
    {},
    notif,
  )
  return requestRes
}

export async function apiMoveConversationsToFolder(
  organizationId,
  folderId,
  conversationIds,
  notif = null,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders/${folderId}/conversations`,
    { method: "post" },
    { conversationIds },
    notif,
  )
  return requestRes?.data
}

export async function apiFetchFolderConversations(
  organizationId,
  folderId,
  filters = {},
  notif = null,
) {
  const requestRes = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/folders/${folderId}/conversations`,
    { method: "get" },
    filters,
    notif,
  )
  return requestRes?.data
}
