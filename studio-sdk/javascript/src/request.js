export function prepareRequest(url, method, { token, ...args } = {}) {
  const defaultQueryParams = {
    t: Date.now(),
  }

  const queryParams = new URLSearchParams({
    ...defaultQueryParams,
    ...(method === "get" ? data : {}),
  }).toString()

  const fullUrl = `${url}?${queryParams}`

  const requestObj = new Request(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : null,
    },
    body: method != "GET" ? JSON.stringify(args) : null,
  })

  return requestObj
}

export async function sendMultipartFormData(url, token, formData) {
  console.debug(`Send request POST ${url} in multipart/form-data`)
  return await fetch(url, {
    method: "POST",
    headers: {
      charset: "utf-8",
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : null,
    },
    body: formData,
  })
}

export async function sendRequest(request) {
  console.debug(`Send request ${request.method} ${request.url}`)
  const res = await fetch(request)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return await res.json()
}
