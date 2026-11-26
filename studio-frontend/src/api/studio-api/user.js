import { sendRequest } from "../../tools/request/sendRequest"
import { sendMultipartFormData } from "../../tools/request/sendMultipartFormData"

import { API_ENDPOINTS } from "@/const/apiEndpoints.js"
import { LOGOUT_TIMEOUT_MS } from "@/const/auth.js"

const BASE_API = API_ENDPOINTS.api
const BASE_AUTH = API_ENDPOINTS.auth

export async function apiGetPersonalUserInfo() {
  const getUserInfos = await sendRequest(`${BASE_API}/users/self`, {
    method: "get",
  })

  return getUserInfos
}

export async function apiGetPublicUserById(userId) {
  const getUserInfos = await sendRequest(`${BASE_API}/users/${userId}`, {
    method: "get",
  })

  return getUserInfos
}

export async function apiGetUsersByConversationId(conversationId, notif) {
  const res = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/users`,
    { method: "get" },
    null,
    notif,
  )

  return (
    res?.data?.conversationUsers ?? {
      organization_members: [],
      external_members: [],
    }
  )
}

export async function apiUpdateUserRightInConversation(
  conversationId,
  userId,
  right,
  notif,
) {
  return await sendRequest(
    `${BASE_API}/conversations/${conversationId}/users/${userId}`,
    { method: "patch" },
    { right: right },
    notif,
  )
}

export async function apiUpdateMultipleUsersInMultipleConversations(
  conversationsIds,
  users,
  organizationId,
  notif,
) {
  return await sendRequest(
    `${BASE_API}/conversations/shared/access`,
    { method: "post" },
    {
      conversations: conversationsIds.join(","),
      users: JSON.stringify({ users }),
      organizationId,
    },
    notif,
  )
}

export async function apiRemoveUserFromOrganisation(
  organizationId,
  userId,
  notif,
) {
  return await sendRequest(
    `${BASE_API}/organizations/${organizationId}/users`,
    { method: "delete" },
    { userId },
    notif,
  )
}

export async function apiImpersonateUser(userId) {
  return await sendRequest(
    `${BASE_API}/users/${userId}/impersonate`,
    { method: "post" },
    {},
    null,
  )
}

export async function apiLoginUser(email, password) {
  return await sendRequest(
    `${BASE_AUTH}/login`,
    { method: "post" },
    {
      email,
      password,
    },
    null,
  )
}

// Native app: the code an SSO login came back with, against the session
export async function apiExchangeMobileSsoCode(code, codeVerifier) {
  return await sendRequest(
    `${BASE_AUTH}/oidc/mobile/token`,
    { method: "post" },
    {
      code,
      code_verifier: codeVerifier,
    },
    null,
  )
}

export async function apiLoginUserMagicLink(magicId) {
  return await sendRequest(
    `${BASE_AUTH}/login/magic-link`,
    { method: "post" },
    {
      psw: "psw", // Needed
      magicId,
    },
    null,
  )
}

// Revokes the current token in the API (the auth store module's logout)
export async function apiLogout() {
  return await sendRequest(
    `${BASE_AUTH}/logout`,
    { method: "get", timeout: LOGOUT_TIMEOUT_MS },
    {},
    null,
  )
}

// A user picked from the search comes with an id, a typed address only has email
export async function apiAddUserToOrganisation(
  organizationId,
  { userId, email },
  role = 1,
  notif,
) {
  return await sendRequest(
    `${BASE_API}/organizations/${organizationId}/users`,
    { method: "post" },
    {
      userId,
      email,
      role,
    },
    notif,
  )
}

export async function apiUpdateUserRoleInOrganisation(
  organizationId,
  userId,
  role,
  notif,
) {
  return await sendRequest(
    `${BASE_API}/organizations/${organizationId}/users`,
    { method: "patch" },
    {
      role,
      userId,
    },
    notif,
  )
}

export async function apiSearchUser(search, signal, notif) {
  return await sendRequest(
    `${BASE_API}/users/search`,
    { method: "get", signal },
    { search },
    notif,
  )
}

export async function apiSetDefaultOrganization(organizationId) {
  return await sendRequest(
    `${BASE_API}/users/self/default-organization`,
    { method: "put" },
    { organizationId },
  )
}

export async function apiUnsetDefaultOrganization() {
  return await sendRequest(`${BASE_API}/users/self/default-organization`, {
    method: "delete",
  })
}

export async function apiUpdateUserInfo(payload, notif) {
  return await sendRequest(
    `${BASE_API}/users/self`,
    { method: "put" },
    payload,
    notif,
  )
}

// Deletes the logged-in user. The API also cancels the billing and deletes
// the organizations the user is the last administrator of.
export async function apiDeleteSelfUser() {
  return await sendRequest(`${BASE_API}/users/self`, { method: "delete" })
}

export async function apiUpdateUserImage(file, notif) {
  let formData = new FormData()
  formData.append("file", file)
  return await sendMultipartFormData(
    `${BASE_API}/users/self/picture`,
    "put",
    formData,
    notif,
  )
}

export async function apiRecoverPassword(email, notif) {
  return await sendRequest(
    `${BASE_API}/users/self/reset-password`,
    { method: "post" },
    { email },
    notif,
  )
}

export async function apiCreateUser(payload, notif) {
  return await sendMultipartFormData(
    `${BASE_API}/users`,
    "post",
    payload,
    notif,
  )
}

export async function apiResendVerificationEmail(email) {
  return await sendRequest(
    `${BASE_AUTH}/resend-verification`,
    { method: "post" },
    { email },
    null,
  )
}

export async function apiSendVerificationLink(notif) {
  return await sendMultipartFormData(
    `${BASE_API}/users/self/verify-email`,
    "patch",
    {},
    notif,
  )
}

export async function getLoginMethods() {
  const req = await sendRequest(`${BASE_AUTH}/list`, {
    method: "get",
  })

  return req.data || []
}

export async function getOidcToken() {
  return await sendRequest(
    `${BASE_AUTH}/oidc/token`,
    {
      method: "get",
    },
    {},
    false,
    {},
    true,
  )
}

// 404 with code ORGANIZATION_SSO_NOT_FOUND when no organization claims the domain
export async function apiResolveOrganizationSso(email) {
  return await sendRequest(
    `${BASE_AUTH}/oidc/organization/resolve`,
    { method: "post" },
    { email },
  )
}

// providerPath comes from the /auth/list entry of the organization provider
export function organizationSsoLoginUrl(providerPath, email) {
  return `${BASE_AUTH}/${providerPath}/login?email=${encodeURIComponent(email)}`
}
