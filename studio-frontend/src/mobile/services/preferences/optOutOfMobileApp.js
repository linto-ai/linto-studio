import { MOBILE_OPT_OUT_COOKIE } from "@/mobile/const/optOutCookie.js"

// Marks this browser session as "wants the full Studio" and leaves for the
// classic app. redirect.js reads the same cookie to stop sending phones to
// /m/. Session cookie on purpose, and opening /m/ again clears it
// (clearMobileAppOptOut), so a phone never stays stuck on the classic app.
export function optOutOfMobileApp() {
  document.cookie = `${MOBILE_OPT_OUT_COOKIE}=1;path=/;SameSite=Lax`
  window.location.href = "/"
}
