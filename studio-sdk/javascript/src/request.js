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

export function prepareMultipartFormData(url, token, formData) {
  const requestObj = new Request(url, {
    method: "POST",
    headers: {
      charset: "utf-8",
      Authorization: token ? `Bearer ${token}` : null,
    },
    body: formData,
  })

  return requestObj
}

export async function sendRequest(request) {
  const res = await fetch(request)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return await res.json()
}
