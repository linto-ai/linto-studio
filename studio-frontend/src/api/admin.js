import { sendRequest } from "../tools/sendRequest"

import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")
const DEFAULT_PAGE_SIZE = 10

export async function apiGetAllOrganizations(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "last_update",
    sortOrder = -1,
  } = {},
) {
  const res = await sendRequest(
    `${BASE_API}/administration/organizations`,
    {
      method: "get",
    },
    { page, size: pageSize, sortField, sortCriteria: sortOrder },
  )
  return res?.data || { count: 0, list: [] }
}

export async function apiGetAllUsers(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "last_update",
    sortOrder = -1,
  } = {},
) {
  const res = await sendRequest(
    `${BASE_API}/administration/users`,
    {
      method: "get",
    },
    { page, size: pageSize, sortField, sortCriteria: sortOrder },
  )

  return res?.data || { count: 0, list: [] }
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
