import { sendRequest } from "../tools/sendRequest"

import { getEnv } from "@/tools/getEnv"
import { sendMultipartFormData } from "@/tools/sendMultipartFormData"

const BASE_API = getEnv("VUE_APP_CONVO_API")
const DEFAULT_PAGE_SIZE = 10

export async function apiGetActivityLogs(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "timestamp",
    sortOrder = -1,
    source,
    scope,
    userId,
  } = {},
) {
  let res

  res = await sendRequest(
    `${BASE_API}/administration/activity`,
    {
      method: "get",
    },
    {
      page,
      size: pageSize,
      sortField,
      sortCriteria: sortOrder,
      source,
      scope,
      "user.id": userId,
    },
  )

  return res?.data || { count: 0, list: [] }
}

export async function apiGetBackofficeActivityLogs(page = 0, args) {
  return await apiGetActivityLogs(page, {
    ...args,
    source: "webserver",
    scope: "platform",
  })
}

export async function apiGetKeysActivityLogs(page = 0, args) {
  return await apiGetActivityLogs(page, {
    ...args,
    source: "webserver",
    scope: "tokens",
  })
}

export async function apiGetHttpActivityLogs(page = 0, args) {
  return await apiGetActivityLogs(page, {
    ...args,
    source: "webserver",
    scope: "resource",
  })
}

export async function apiGetSessionActivityLogs(page = 0, args) {
  return await apiGetActivityLogs(page, { ...args, source: "socketio" })
}

export async function apiGetAllOrganizations(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "last_update",
    sortOrder = -1,
    hidePersonal = false,
  } = {},
  search,
) {
  let res
  if (!search) {
    res = await sendRequest(
      `${BASE_API}/administration/organizations`,
      {
        method: "get",
      },
      {
        page,
        size: pageSize,
        sortField,
        sortCriteria: sortOrder,
        hidePersonal,
      },
    )
  } else {
    res = await sendRequest(
      `${BASE_API}/administration/organizations`,
      {
        method: "get",
      },
      {
        page,
        size: pageSize,
        sortField,
        sortCriteria: sortOrder,
        name: search,
      },
    )
  }
  return res?.data || { count: 0, list: [] }
}

export async function apiGetAllUsers(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "last_update",
    sortOrder = -1,
    type = "user",
  } = {},
  search,
) {
  let res

  if (!search) {
    res = await sendRequest(
      `${BASE_API}/administration/users`,
      {
        method: "get",
      },
      { page, size: pageSize, sortField, sortCriteria: sortOrder, type },
    )
  } else {
    res = await sendRequest(
      `${BASE_API}/administration/users`,
      {
        method: "get",
      },
      {
        page,
        size: pageSize,
        sortField,
        sortCriteria: sortOrder,
        email: search,
        type,
      },
    )
  }

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

export async function apiAdminCreateUser(data) {
  const res = await sendMultipartFormData(
    `${BASE_API}/administration/users`,
    "post",
    data,
  )

  return res
}

export async function apiGetUserOrganizations(userId) {
  const res = await sendRequest(
    `${BASE_API}/administration/users/${userId}/organizations`,
    {
      method: "get",
    },
  )
  return res
}

export async function apiGetAllTokens(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "last_update",
    sortOrder = -1,
  } = {},
) {
  const res = await sendRequest(
    `${BASE_API}/administration/tokens`,
    {
      method: "get",
    },
    {
      page,
      size: pageSize,
      sortField,
      sortCriteria: sortOrder,
    },
  )

  if (res?.data) {
    return res.data
  }
  return { count: 0, list: [] }
}

export async function apiCreatePlatformToken({ name, role, expiration }) {
  const res = await sendRequest(
    `${BASE_API}/administration/tokens`,
    { method: "post" },
    { name, role, expires_in: expiration },
    null,
  )

  return res
}

export async function apiDeletePlatformToken(tokenId) {
  const res = await sendRequest(
    `${BASE_API}/administration/tokens/${tokenId}`,
    { method: "delete" },
  )
  return res
}

export async function apiGetDetailToken(tokenId) {
  const res = await sendRequest(
    `${BASE_API}/administration/tokens/${tokenId}`,
    { method: "get" },
  )
  return res
}

export async function apiRenewPlatformToken(tokenId, { expiration }) {
  const res = await sendRequest(
    `${BASE_API}/administration/tokens/${tokenId}`,
    { method: "put" },
    { expires_in: expiration },
    null,
  )

  return res
}

export async function apiAdminGetTranscriberProfiles(notif) {
  const getTranscriberProfiles = await sendRequest(
    `${BASE_API}/administration/transcriber_profiles`,
    { method: "get" },
    {},
    notif,
  )

  return getTranscriberProfiles?.data ?? []
}

export async function apiAdminGetTranscriberProfilesById(transcriberId, notif) {
  return await sendRequest(
    `${BASE_API}/administration/transcriber_profiles/${transcriberId}`,
    { method: "get" },
    {},
    notif,
  )
}

export async function apiAdminUpdateTranscriberProfile(
  transcriberId,
  data,
  notif,
) {
  const dataCopy = structuredClone(data)
  if (dataCopy.config.key === "Secret key is hidden") {
    delete dataCopy.config.key
  }

  return await sendRequest(
    `${BASE_API}/administration/transcriber_profiles/${transcriberId}`,
    { method: "put" },
    dataCopy,
    notif,
  )
}

export async function apiAdminCreateTranscriberProfile(data, notif) {
  return await sendRequest(
    `${BASE_API}/administration/transcriber_profiles`,
    { method: "post" },
    data,
    notif,
  )
}

export async function apiAdminDeleteTranscriberProfile(transcriberId, notif) {
  return await sendRequest(
    `${BASE_API}/administration/transcriber_profiles/${transcriberId}`,
    { method: "delete" },
    {},
    notif,
  )
}

export async function apiAdminCreateAmazonTranscriberProfile(data, files, notif) {
  const formData = new FormData()

  formData.append("config[type]", "amazon")
  formData.append("config[name]", data.config.name)
  formData.append("config[description]", data.config.description || "")
  formData.append("config[languages]", JSON.stringify(data.config.languages))
  formData.append(
    "config[availableTranslations]",
    JSON.stringify(data.config.availableTranslations || []),
  )
  formData.append("config[passphrase]", data.config.passphrase || "")
  formData.append("config[credentials]", data.config.credentials)
  formData.append("config[trustAnchorArn]", data.config.trustAnchorArn)
  formData.append("config[profileArn]", data.config.profileArn)
  formData.append("config[roleArn]", data.config.roleArn)
  formData.append("quickMeeting", data.quickMeeting)

  if (files.certificate) {
    formData.append("config[certificate]", files.certificate)
  }
  if (files.privateKey) {
    formData.append("config[privateKey]", files.privateKey)
  }

  if (data.organizationId) {
    formData.append("organizationId", data.organizationId)
  }

  return sendMultipartFormData(
    `${BASE_API}/administration/transcriber_profiles`,
    "post",
    formData,
    notif,
  )
}

export async function apiAdminUpdateAmazonTranscriberProfile(
  transcriberId,
  data,
  files,
  notif,
) {
  const formData = new FormData()

  formData.append("config[type]", "amazon")
  formData.append("config[name]", data.config.name)
  formData.append("config[description]", data.config.description || "")
  formData.append("config[languages]", JSON.stringify(data.config.languages))
  formData.append(
    "config[availableTranslations]",
    JSON.stringify(data.config.availableTranslations || []),
  )
  formData.append("config[passphrase]", data.config.passphrase || "")
  formData.append("config[credentials]", data.config.credentials)
  formData.append("config[trustAnchorArn]", data.config.trustAnchorArn)
  formData.append("config[profileArn]", data.config.profileArn)
  formData.append("config[roleArn]", data.config.roleArn)
  formData.append("quickMeeting", data.quickMeeting)

  if (files && files.certificate) {
    formData.append("config[certificate]", files.certificate)
  }
  if (files && files.privateKey) {
    formData.append("config[privateKey]", files.privateKey)
  }

  if (data.organizationId) {
    formData.append("organizationId", data.organizationId)
  }

  return sendMultipartFormData(
    `${BASE_API}/administration/transcriber_profiles/${transcriberId}`,
    "put",
    formData,
    notif,
  )
}
