const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i

/**
 * The address an instance is saved under: https:// added when the user left
 * the scheme out, no trailing slash, no query or fragment.
 * @param {string} input - what the user typed ("studio.my-org.fr")
 * @returns {string|null} "https://studio.my-org.fr", or null when the input
 *   is not an http(s) address
 */
export function normalizeInstanceAddress(input) {
  const text = String(input ?? "").trim()
  if (!text) return null
  const withScheme = SCHEME.test(text) ? text : `https://${text}`
  let url
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname) {
    return null
  }
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`
}
