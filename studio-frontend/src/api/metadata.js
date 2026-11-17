import { sendRequest } from "../tools/request/sendRequest"

import { API_ENDPOINTS } from "@/const/apiEndpoints.js"

const BASE_API = API_ENDPOINTS.api

export function apiPostMetadata(
  scopeId,
  tagId,
  metadataSchema,
  metadataValue,
  notif,
) {
  return sendRequest(
    `${BASE_API}/conversations/${scopeId}/tags/${tagId}/metadata`,
    { method: "post" },
    { schema: metadataSchema, value: metadataValue },
    notif,
  )
}

export function apiUpdateMetadata(
  scopeId,
  tagId,
  metadataId,
  metadataValue,
  notif,
) {
  return sendRequest(
    `${BASE_API}/conversations/${scopeId}/tags/${tagId}/metadata/${metadataId}`,
    { method: "patch" },
    { value: metadataValue },
    notif,
  )
}
