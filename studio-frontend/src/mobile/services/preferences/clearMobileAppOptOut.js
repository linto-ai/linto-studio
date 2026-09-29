import { MOBILE_OPT_OUT_COOKIE } from "@/mobile/const/optOutCookie.js"

// Reaching /m/ is an explicit choice of the mobile app: forget any earlier
// "Full Studio version" opt-out (including the 30-day cookie set by the first
// builds), so the phone redirect works again on the next classic page load.
export function clearMobileAppOptOut() {
  document.cookie = `${MOBILE_OPT_OUT_COOKIE}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`
}
