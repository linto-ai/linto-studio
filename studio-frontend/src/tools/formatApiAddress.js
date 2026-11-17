/**
 * The API address as shown to the user: its root, without "https://" (http
 * stays visible: a local address) nor trailing slash.
 * @param {string} root - API_ENDPOINTS.root, an absolute URL
 * @returns {string} e.g. "studio.linto.ai/cm-api", "http://10.0.0.5:8001"
 */
export function formatApiAddress(root) {
  const url = new URL(root)
  const scheme = url.protocol === "https:" ? "" : `${url.protocol}//`
  return `${scheme}${url.host}${url.pathname.replace(/\/$/, "")}`
}
