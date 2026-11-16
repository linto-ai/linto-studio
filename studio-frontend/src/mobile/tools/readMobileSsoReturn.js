/**
 * The code the API answered an SSO login with (null when the login failed),
 * read from the link that opened the native app. Any other link gives null.
 * @param {string} url - the link the app was opened with
 * @param {string} redirectUri - the app's SSO return address
 * @returns {{ code: string | null } | null}
 */
export function readMobileSsoReturn(url, redirectUri) {
  const [address, query = ""] = String(url).split("#")[0].split("?")
  if (address !== redirectUri) return null
  return { code: new URLSearchParams(query).get("code") }
}
