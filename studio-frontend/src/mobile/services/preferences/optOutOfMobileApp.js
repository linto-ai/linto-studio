import { setCookie } from "@/tools/setCookie"

const OPT_OUT_COOKIE = "mobile_optout"
const OPT_OUT_DAYS = 30

// Marks this phone as "wants the full Studio" and leaves for the classic
// app. redirect.js reads the same cookie to stop sending phones to /m/.
export function optOutOfMobileApp() {
  setCookie(OPT_OUT_COOKIE, "1", OPT_OUT_DAYS)
  window.location.href = "/"
}
