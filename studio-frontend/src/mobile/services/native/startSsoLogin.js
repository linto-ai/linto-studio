import { getEnv } from "@/tools/getEnv"
import { MOBILE_SSO_REDIRECT_URI } from "@/mobile/const/mobileSsoRedirectUri.js"
import { saveSsoVerifier } from "@/mobile/services/native/ssoVerifierStorage.js"
import { buildMobileSsoLoginUrl } from "@/mobile/tools/buildMobileSsoLoginUrl.js"
import { encodeBase64Url } from "@/mobile/tools/encodeBase64Url.js"

const VERIFIER_BYTES = 32

// Native app only: the login runs in the phone's browser (the address is
// outside the app, Capacitor hands it over) and the API sends the app back
// through MOBILE_SSO_REDIRECT_URI (listenForSsoReturn.js). Never throws.
export async function startSsoLogin(providerPath) {
  try {
    const codeVerifier = encodeBase64Url(
      crypto.getRandomValues(new Uint8Array(VERIFIER_BYTES)),
    )
    const codeChallenge = await computeCodeChallenge(codeVerifier)
    saveSsoVerifier(codeVerifier)
    window.location.assign(
      buildMobileSsoLoginUrl({
        authBase: getEnv("VUE_APP_CONVO_AUTH"),
        providerPath,
        redirectUri: MOBILE_SSO_REDIRECT_URI,
        codeChallenge,
      }),
    )
  } catch (error) {
    console.error("cannot start the sso login", error)
  }
}

async function computeCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  )
  return encodeBase64Url(new Uint8Array(digest))
}
