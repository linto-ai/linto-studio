const DEFAULT_TIMEOUT_MS = 30 * 1000
const BACKOFFICE_PATH = "/api/administration"

// Fails with the status and the body when studio-api refuses
async function callStudioApi(
  apiUrl,
  path,
  {
    method = "GET",
    token,
    body,
    query = {},
    timeout = DEFAULT_TIMEOUT_MS,
  } = {},
) {
  const url = new URL(apiUrl.replace(/\/+$/, "") + path)
  for (const [name, value] of Object.entries(query)) {
    url.searchParams.set(name, value)
  }

  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers["Content-Type"] = "application/json"

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  })
  if (!response.ok) {
    throw new Error(
      `studio-api answered ${response.status} on ${method} ${path}: ${await response.text()}`,
    )
  }
  return await response.json()
}

// Backoffice routes only answer to the backoffice scope
async function callBackoffice(apiUrl, path, options = {}) {
  return await callStudioApi(apiUrl, BACKOFFICE_PATH + path, {
    ...options,
    query: { ...options.query, userScope: "backoffice" },
  })
}

module.exports = { callStudioApi, callBackoffice }
