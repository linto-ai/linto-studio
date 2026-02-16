export function prepareRequest(url, method, { token, ...args } = {}) {
  const defaultQueryParams = {
    t: Date.now(),
  }

  const queryParams = new URLSearchParams({
    ...defaultQueryParams,
    ...(method.toUpperCase() === "GET" ? args : {}),
  }).toString()

  const fullUrl = `${url}?${queryParams}`

  const requestObj = new Request(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: method !== "GET" ? JSON.stringify(args) : null,
  })

  return requestObj
}

export function prepareMultipartFormData(url, token, formData) {
  const requestObj = new Request(url, {
    method: "POST",
    headers: {
      charset: "utf-8",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  return requestObj
}

export async function sendRequest(request) {
  const res = await fetch(request)
  if (!res.ok) {
    let errorBody = null
    try {
      const text = await res.text()
      try { errorBody = JSON.parse(text) } catch { errorBody = text }
    } catch { errorBody = null }
    const error = new Error(
      `Request failed: ${res.status} ${res.statusText}` +
      (errorBody?.message ? ` - ${errorBody.message}` : '') +
      (errorBody?.error ? ` (${errorBody.error})` : '')
    )
    error.status = res.status
    error.statusText = res.statusText
    error.body = errorBody
    throw error
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return null
  return await res.json()
}
