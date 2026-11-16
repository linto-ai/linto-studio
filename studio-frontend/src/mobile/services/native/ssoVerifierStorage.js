// PKCE verifier of the SSO login in progress. Kept on the phone: Android may
// stop the app while the login goes on in the browser.
const VERIFIER_KEY = "mobile_sso_verifier"

export function saveSsoVerifier(codeVerifier) {
  localStorage.setItem(VERIFIER_KEY, codeVerifier)
}

// A verifier serves once: the return link of a finished login finds none.
export function takeSsoVerifier() {
  const codeVerifier = localStorage.getItem(VERIFIER_KEY)
  localStorage.removeItem(VERIFIER_KEY)
  return codeVerifier
}
