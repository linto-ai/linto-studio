import { sendRequest } from "../tools/sendRequest"
import { sendMultipartFormData } from "../tools/sendMultipartFormData"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function listToken(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens`,
    { method: "get" },
    {},
    null,
  )

  return res?.data || []
}

export async function apiCreateToken(
  organizationId,
  { name, role, expiration },
) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens`,
    { method: "post" },
    { name, role, expires_in: expiration },
    null,
  )

  return res
}

export async function apiGetToken(organizationId, tokenId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens/${tokenId}`,
    { method: "get" },
    {},
    null,
  )

  return res
}

export async function apiDeleteToken(organizationId, tokenId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens/${tokenId}`,
    { method: "delete" },
    {},
    null,
  )

  return res
}

export async function apiRenewToken(organizationId, tokenId, { expiration }) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/tokens/${tokenId}`,
    { method: "put" },
    { expires_in: expiration },
    null,
  )

  return res
}

/**
 * Upload (or replace) the avatar of an API key.
 * The file is sent as multipart/form-data on field `file`.
 */
export async function apiUpdateTokenPicture(organizationId, tokenId, file) {
  const formData = new FormData()
  formData.append("file", file)
  return await sendMultipartFormData(
    `${BASE_API}/organizations/${organizationId}/tokens/${tokenId}/picture`,
    "put",
    formData,
    null,
  )
}
