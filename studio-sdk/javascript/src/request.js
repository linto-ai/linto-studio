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

export async function sendRequest(request, { responseType } = {}) {
  const res = await fetch(request)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  if (res.status === 204) {
    return null
  }
  if (responseType === "binary") {
    // Prefer Blob in browser-like environments (window present), otherwise
    // return an ArrayBuffer which is the most portable binary container in
    // Node. Callers can wrap the result themselves if they need a Buffer.
    const isBrowser =
      typeof globalThis !== "undefined" &&
      typeof globalThis.window !== "undefined" &&
      typeof globalThis.window.document !== "undefined"
    if (isBrowser && typeof res.blob === "function") {
      return await res.blob()
    }
    if (typeof res.arrayBuffer === "function") {
      return await res.arrayBuffer()
    }
    if (typeof res.blob === "function") {
      return await res.blob()
    }
  }
  return await res.json()
}
