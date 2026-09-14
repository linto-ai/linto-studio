import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"
import { shouldRedirectToMobileApp } from "@/mobile/tools/shouldRedirectToMobileApp.js"
import { isPhoneDevice } from "@/mobile/tools/isPhoneDevice.js"

// Imported once by the classic entry point (src/main.js). Does nothing unless
// VUE_APP_ENABLE_MOBILE_APP is "true"; then phones land on the mobile app.
// The "Full Studio version" link of the mobile app sets the opt-out cookie.
const redirect = shouldRedirectToMobileApp({
  enabled: getEnv("VUE_APP_ENABLE_MOBILE_APP") === "true",
  isPhone: isPhoneDevice({
    shortSide: Math.min(window.screen.width, window.screen.height),
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  }),
  optedOut: getCookie("mobile_optout") !== null,
  pathname: window.location.pathname,
})

if (redirect) {
  window.location.replace("/m/")
}
