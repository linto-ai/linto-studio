/**
 * Address that starts an SSO login whose callback comes back to the native
 * app instead of the instance's website.
 * @param {{ authBase: string, providerPath: string, redirectUri: string, codeChallenge: string }} login
 *   authBase - VUE_APP_CONVO_AUTH; providerPath - path of a GET /auth/list entry
 * @returns {string}
 */
export function buildMobileSsoLoginUrl({
  authBase,
  providerPath,
  redirectUri,
  codeChallenge,
}) {
  const query = new URLSearchParams({
    client: "mobile",
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
  })
  return `${authBase}/${providerPath}/login?${query}`
}
