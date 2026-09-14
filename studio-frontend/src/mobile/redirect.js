import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"
import { shouldRedirectToMobileApp } from "@/mobile/tools/shouldRedirectToMobileApp.js"

// Imported once by the classic entry point (src/main.js). Does nothing unless
// VUE_APP_ENABLE_MOBILE_APP is "true"; then phones land on the mobile app.
// The "Full Studio version" link of the mobile app sets the opt-out cookie.
const PHONE_MEDIA_QUERY = "(max-width: 767px)"

const redirect = shouldRedirectToMobileApp({
  enabled: getEnv("VUE_APP_ENABLE_MOBILE_APP") === "true",
  isPhone: window.matchMedia(PHONE_MEDIA_QUERY).matches,
  optedOut: getCookie("mobile_optout") !== null,
  pathname: window.location.pathname,
})

if (redirect) {
  window.location.replace("/m/")
}
