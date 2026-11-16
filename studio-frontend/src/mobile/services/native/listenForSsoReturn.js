import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { MOBILE_SSO_REDIRECT_URI } from "@/mobile/const/mobileSsoRedirectUri.js"
import { takeSsoVerifier } from "@/mobile/services/native/ssoVerifierStorage.js"
import { loginWithSsoCode } from "@/mobile/services/session/loginWithSsoCode.js"
import { readMobileSsoReturn } from "@/mobile/tools/readMobileSsoReturn.js"

// Native app only: an SSO login started by startSsoLogin.js ends in the
// browser, on a link that opens the app again. The link reaches a running
// app as an event, a stopped one as its launch address.
export async function listenForSsoReturn(router) {
  if (!IS_NATIVE_APP) {
    return
  }
  try {
    const { App } = await import("@capacitor/app")
    App.addListener("appUrlOpen", ({ url }) => finishSsoLogin(url, router))
    const launch = await App.getLaunchUrl()
    if (launch?.url) {
      await finishSsoLogin(launch.url, router)
    }
  } catch (error) {
    console.error("sso return listener registration failed", error)
  }
}

async function finishSsoLogin(url, router) {
  const ssoReturn = readMobileSsoReturn(url, MOBILE_SSO_REDIRECT_URI)
  if (!ssoReturn) {
    return
  }
  const codeVerifier = takeSsoVerifier()
  if (!codeVerifier) {
    return
  }
  let signedIn = false
  if (ssoReturn.code) {
    const result = await loginWithSsoCode(ssoReturn.code, codeVerifier)
    signedIn = result.ok
  }
  if (signedIn) {
    // Same landing as the password login (Login.vue)
    const next = router.currentRoute.query.next || { name: "home" }
    router.replace(next).catch(() => {})
  } else {
    router.replace({ name: "login", query: { error: "sso" } }).catch(() => {})
  }
}
