import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"
import { shouldRedirectToMobileApp } from "@/mobile/tools/shouldRedirectToMobileApp.js"
import { isPhoneDevice } from "@/mobile/tools/isPhoneDevice.js"
import { MOBILE_OPT_OUT_COOKIE } from "@/mobile/const/optOutCookie.js"

// Imported first by the classic entry point (src/main.js). Does nothing unless
// VUE_APP_ENABLE_MOBILE_APP is "true"; then phones land on the mobile app and
// the classic app must not boot: its router would push a history entry while
// /m/ is loading, so a swipe back would land on a frozen classic page.
// The "Full Studio version" link of the mobile app sets the opt-out cookie.
export const redirectingToMobileApp = shouldRedirectToMobileApp({
  enabled: getEnv("VUE_APP_ENABLE_MOBILE_APP") === "true",
  isPhone: isPhoneDevice({
    shortSide: Math.min(window.screen.width, window.screen.height),
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  }),
  optedOut: getCookie(MOBILE_OPT_OUT_COOKIE) !== null,
  pathname: window.location.pathname,
})

if (redirectingToMobileApp) {
  window.location.replace("/m/")
}
