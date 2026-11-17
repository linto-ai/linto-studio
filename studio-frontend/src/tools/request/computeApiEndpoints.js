const HTTP_PROTOCOLS = ["http:", "https:"]

/**
 * Every studio-api URL the front uses, from the only one it is configured
 * with: auth, media, socket.io and the root routes (/features, /cloud) live
 * next to /api, under the same root. socket.io reads the path of its URL as
 * a namespace: its origin and its path are given apart.
 * @param {string} convoApi - VUE_APP_CONVO_API, absolute and ending in /api
 *   ("https://studio.linto.ai/cm-api/api")
 * @returns {{ root: string, api: string, auth: string, media: string, socketOrigin: string, socketPath: string } | null}
 *   null when convoApi is not an absolute http(s) URL: a path would mean
 *   something else from each page.
 */
export function computeApiEndpoints(convoApi) {
  const url = parseAbsoluteUrl(convoApi)
  if (!url) return null
  const rootPath = url.pathname.replace(/\/+$/, "").replace(/\/api$/, "")
  const root = `${url.origin}${rootPath}`
  return {
    root,
    api: `${root}/api`,
    auth: `${root}/auth`,
    media: `${root}/media`,
    socketOrigin: url.origin,
    socketPath: `${rootPath}/socket.io`,
  }
}

function parseAbsoluteUrl(value) {
  try {
    const url = new URL(value)
    return HTTP_PROTOCOLS.includes(url.protocol) ? url : null
  } catch {
    return null
  }
}
