import { sendRequest } from "../tools/sendRequest"

import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetAllOrganizations() {
  const res = await sendRequest(`${BASE_API}/administration/organizations`, {
    method: "get",
  })
  return res?.data || []
}

export async function apiGetAllUsers() {
  const res = await sendRequest(`${BASE_API}/administration/users`, {
    method: "get",
  })

  return res?.data || []
}

export async function apiDeleteMultipleUsers(userIds) {
  const res = await sendRequest(
    `${BASE_API}/administration/users`,
    {
      method: "delete",
    },
    { userIds },
  )

  return res
}

export async function apiAdminUpdateUser(userId, data) {
  const res = await sendRequest(
    `${BASE_API}/administration/users/${userId}`,
    {
      method: "patch",
    },
    data,
  )

  return res
}
